import type {
  DataQualityReport,
  DataColumnIssue,
  DataCleaningAction,
  DataSiloSource,
  PiiMatch,
} from './types';

export function analyzeDatasetQuality(
  fileName: string,
  rows: Record<string, any>[]
): DataQualityReport {
  if (!rows || rows.length === 0) {
    return {
      fileName,
      totalRows: 0,
      totalCols: 0,
      qualityScore: 0,
      missingTotal: 0,
      duplicateRows: 0,
      formatErrorsTotal: 0,
      outliersTotal: 0,
      piiCount: 0,
      columns: [],
      suggestedActions: [],
      rawDataSample: [],
      cleanedDataSample: [],
    };
  }

  const columns = Object.keys(rows[0] || {});
  const totalRows = rows.length;
  const totalCols = columns.length;

  let missingTotal = 0;
  let formatErrorsTotal = 0;
  let outliersTotal = 0;
  let piiCount = 0;

  // 1. Duplicate row detection
  const rowStrings = new Set<string>();
  let duplicateRows = 0;
  rows.forEach((row) => {
    const serialized = JSON.stringify(row);
    if (rowStrings.has(serialized)) {
      duplicateRows++;
    } else {
      rowStrings.add(serialized);
    }
  });

  const columnIssues: DataColumnIssue[] = [];
  const suggestedActions: DataCleaningAction[] = [];

  // PII Regex patterns
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_REGEX = /^(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/;
  const SSN_REGEX = /^\d{3}-\d{2}-\d{4}$/;
  const CC_REGEX = /^\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}$/;

  columns.forEach((col) => {
    let missingCount = 0;
    let invalidFormatCount = 0;
    let outlierCount = 0;
    const values: any[] = [];
    const numValues: number[] = [];
    const textValues: string[] = [];

    // Analyze each row for this column
    rows.forEach((row, rowIndex) => {
      const val = row[col];
      const isNullOrEmpty =
        val === null ||
        val === undefined ||
        val === '' ||
        (typeof val === 'string' && val.trim().toLowerCase() === 'null') ||
        (typeof val === 'string' && val.trim().toLowerCase() === 'n/a');

      if (isNullOrEmpty) {
        missingCount++;
        missingTotal++;
      } else {
        values.push(val);
        const strVal = String(val).trim();

        // Check for PII
        if (EMAIL_REGEX.test(strVal) || PHONE_REGEX.test(strVal) || SSN_REGEX.test(strVal) || CC_REGEX.test(strVal)) {
          piiCount++;
        }

        // Numeric checks & Outliers
        const parsedNum = Number(strVal);
        if (!isNaN(parsedNum) && strVal !== '') {
          numValues.push(parsedNum);
        } else {
          textValues.push(strVal);
        }
      }
    });

    // Determine Inferred Type
    let inferredType = 'text';
    if (numValues.length > values.length * 0.7) {
      inferredType = 'number';
    } else if (values.some((v) => EMAIL_REGEX.test(String(v).trim()))) {
      inferredType = 'email';
    } else if (values.some((v) => !isNaN(Date.parse(String(v))) && isNaN(Number(v)))) {
      inferredType = 'date';
    }

    // Format errors based on inferred type
    values.forEach((v) => {
      const str = String(v).trim();
      if (inferredType === 'email' && !EMAIL_REGEX.test(str)) {
        invalidFormatCount++;
        formatErrorsTotal++;
      } else if (inferredType === 'number' && isNaN(Number(str))) {
        invalidFormatCount++;
        formatErrorsTotal++;
      }
    });

    // Outlier calculation via IQR for numeric columns
    if (inferredType === 'number' && numValues.length >= 8) {
      const sorted = [...numValues].sort((a, b) => a - b);
      const q1 = sorted[Math.floor(sorted.length * 0.25)];
      const q3 = sorted[Math.floor(sorted.length * 0.75)];
      const iqr = q3 - q1;
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;

      numValues.forEach((num) => {
        if (num < lowerBound || num > upperBound) {
          outlierCount++;
          outliersTotal++;
        }
      });
    }

    // Inconsistent casing variants detection
    const casingVariants: string[] = [];
    if (inferredType === 'text' && textValues.length > 0) {
      const lowerMap = new Map<string, Set<string>>();
      textValues.forEach((tv) => {
        const lower = tv.toLowerCase();
        if (!lowerMap.has(lower)) lowerMap.set(lower, new Set());
        lowerMap.get(lower)!.add(tv);
      });

      lowerMap.forEach((variants, lower) => {
        if (variants.size > 1 && casingVariants.length < 5) {
          casingVariants.push(Array.from(variants).join(' / '));
        }
      });
    }

    const missingPct = Math.round((missingCount / totalRows) * 100);

    columnIssues.push({
      column: col,
      missingCount,
      missingPct,
      duplicateCount: 0,
      invalidFormatCount,
      outlierCount,
      casingVariants,
      inferredType,
    });

    // Cleaning actions recommendations
    if (missingCount > 0) {
      suggestedActions.push({
        id: `impute_${col}`,
        title: `Impute Missing Values in [${col}]`,
        column: col,
        description: `Replace ${missingCount} null/empty cells with statistical median (numbers) or 'Unknown' (text).`,
        impactScoreImprovement: Math.min(12, Math.round((missingCount / totalRows) * 20)),
        applied: false,
      });
    }

    if (invalidFormatCount > 0) {
      suggestedActions.push({
        id: `format_${col}`,
        title: `Standardize Format in [${col}]`,
        column: col,
        description: `Correct or quarantine ${invalidFormatCount} values not adhering to inferred ${inferredType} schema.`,
        impactScoreImprovement: Math.min(10, Math.round((invalidFormatCount / totalRows) * 15)),
        applied: false,
      });
    }

    if (casingVariants.length > 0) {
      suggestedActions.push({
        id: `case_${col}`,
        title: `Harmonize Casing in [${col}]`,
        column: col,
        description: `Standardize case variations (${casingVariants.slice(0, 2).join(', ')}) to Title Case.`,
        impactScoreImprovement: 4,
        applied: false,
      });
    }

    if (outlierCount > 0) {
      suggestedActions.push({
        id: `outlier_${col}`,
        title: `Cap / Winsorize Outliers in [${col}]`,
        column: col,
        description: `Cap ${outlierCount} extreme statistical anomalies at 1.5x IQR boundary.`,
        impactScoreImprovement: 6,
        applied: false,
      });
    }
  });

  if (duplicateRows > 0) {
    suggestedActions.unshift({
      id: `dedup_global`,
      title: `Deduplicate Dataset`,
      column: 'All',
      description: `Remove ${duplicateRows} identical record rows to prevent model bias and wasted training cycles.`,
      impactScoreImprovement: Math.min(15, Math.round((duplicateRows / totalRows) * 25)),
      applied: false,
    });
  }

  // Calculate composite quality score (0-100)
  const missingRate = (missingTotal / (totalRows * totalCols)) * 100;
  const duplicateRate = (duplicateRows / totalRows) * 100;
  const formatErrorRate = (formatErrorsTotal / (totalRows * totalCols)) * 100;
  const outlierRate = (outliersTotal / (totalRows * totalCols)) * 100;

  const rawQuality =
    100 -
    missingRate * 2 -
    duplicateRate * 1.5 -
    formatErrorRate * 2.5 -
    outlierRate * 1.0;

  const qualityScore = Math.max(0, Math.min(100, Math.round(rawQuality * 10) / 10));

  // Generate cleaned dataset preview without mutating original
  const cleanedDataSample = generateCleanedData(rows.slice(0, 20), columnIssues);

  return {
    fileName,
    totalRows,
    totalCols,
    qualityScore,
    missingTotal,
    duplicateRows,
    formatErrorsTotal,
    outliersTotal,
    piiCount,
    columns: columnIssues,
    suggestedActions,
    rawDataSample: rows.slice(0, 20),
    cleanedDataSample,
  };
}

export function generateCleanedData(
  rows: Record<string, any>[],
  columnIssues: DataColumnIssue[]
): Record<string, any>[] {
  const seenRows = new Set<string>();
  const cleaned: Record<string, any>[] = [];

  const issueMap = new Map(columnIssues.map((ci) => [ci.column, ci]));

  for (const row of rows) {
    // 1. Deduplication
    const serialized = JSON.stringify(row);
    if (seenRows.has(serialized)) continue;
    seenRows.add(serialized);

    const newRow: Record<string, any> = {};
    for (const [key, val] of Object.entries(row)) {
      const issue = issueMap.get(key);
      let cleanedVal = val;

      // Handle nulls
      if (
        cleanedVal === null ||
        cleanedVal === undefined ||
        cleanedVal === '' ||
        String(cleanedVal).trim().toLowerCase() === 'null' ||
        String(cleanedVal).trim().toLowerCase() === 'n/a'
      ) {
        cleanedVal = issue?.inferredType === 'number' ? 0 : 'N/A';
      } else if (typeof cleanedVal === 'string') {
        // Harmonize casing for text columns
        const trimmed = cleanedVal.trim();
        if (issue?.inferredType === 'text') {
          // Title case conversion
          cleanedVal = trimmed.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase());
        } else {
          cleanedVal = trimmed;
        }
      }

      newRow[key] = cleanedVal;
    }
    cleaned.push(newRow);
  }

  return cleaned;
}

export function exportCleanedCsvString(rows: Record<string, any>[]): string {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const csvLines = [headers.join(',')];

  rows.forEach((row) => {
    const line = headers.map((h) => {
      const val = row[h] !== undefined && row[h] !== null ? String(row[h]) : '';
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    });
    csvLines.push(line.join(','));
  });

  return csvLines.join('\n');
}

export function calculateSiloIntegrationComplexity(sources: DataSiloSource[]) {
  if (sources.length === 0) {
    return {
      complexityScore: 0,
      riskLevel: 'Low' as const,
      unifiedSchemaSuggestion: [],
    };
  }

  let totalPenalty = 0;
  const departments = new Set(sources.map((s) => s.department));
  const formats = new Set(sources.map((s) => s.format));

  // Department fragmentation penalty
  totalPenalty += departments.size * 6;
  // Format heterogeneity penalty
  totalPenalty += formats.size * 7;
  // Non-standard schemas
  const unstandardized = sources.filter((s) => !s.hasStandardSchema).length;
  totalPenalty += unstandardized * 12;
  // Manual batches
  const manualBatches = sources.filter((s) => s.updateFrequency === 'Manual Batch').length;
  totalPenalty += manualBatches * 10;

  const complexityScore = Math.min(100, Math.max(15, totalPenalty));
  const riskLevel =
    complexityScore > 65 ? 'Critical' : complexityScore > 40 ? 'Moderate' : 'Low';

  const unifiedSchemaSuggestion = [
    { field: 'entity_id', type: 'UUID', source: 'Cross-System Canonical Key', mandatory: true },
    { field: 'department_code', type: 'VARCHAR(16)', source: 'Normalized Silo Domain', mandatory: true },
    { field: 'payload_json', type: 'JSONB', source: 'Semi-structured Unified Document', mandatory: false },
    { field: 'ingested_at', type: 'TIMESTAMPTZ', source: 'UTC Audit Ingestion Timestamp', mandatory: true },
    { field: 'data_provenance', type: 'TEXT', source: 'Source System & Hash Lineage', mandatory: true },
  ];

  return {
    complexityScore,
    riskLevel,
    unifiedSchemaSuggestion,
  };
}

