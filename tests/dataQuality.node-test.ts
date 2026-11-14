import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeDatasetQuality,
  exportCleanedCsvString,
  calculateSiloIntegrationComplexity,
} from '../lib/dataQuality.ts';
import type { DataSiloSource } from '../lib/types.ts';

test('Data Quality - Correctly identifies missing values and duplicates', () => {
  const sampleData = [
    { id: '1', name: 'Alpha', value: '100', email: 'test@example.com' },
    { id: '2', name: 'Beta', value: null, email: 'invalid-email' },
    { id: '3', name: '', value: '200', email: 'user@corp.com' },
    { id: '1', name: 'Alpha', value: '100', email: 'test@example.com' }, // duplicate
  ];

  const report = analyzeDatasetQuality('sample.csv', sampleData);
  assert.equal(report.totalRows, 4);
  assert.equal(report.totalCols, 4);
  assert.equal(report.duplicateRows, 1);
  assert.ok(report.missingTotal >= 2); // value: null, name: ''
  assert.ok(report.formatErrorsTotal >= 1); // invalid-email
  assert.ok(report.qualityScore < 100);
});

test('Data Quality - Export cleaned CSV contains valid CSV structure', () => {
  const cleaned = [
    { id: '1', name: 'Alpha Corp', value: 100 },
    { id: '2', name: 'Beta, Inc', value: 200 },
  ];
  const csv = exportCleanedCsvString(cleaned);
  assert.ok(csv.includes('id,name,value'));
  assert.ok(csv.includes('"Beta, Inc"')); // properly quoted comma
});

test('Data Quality - Silo integration complexity', () => {
  const silos: DataSiloSource[] = [
    { id: '1', name: 'SAP ERP', department: 'Operations', format: 'Legacy ERP', estimatedVolumeMb: 500, updateFrequency: 'Manual Batch', hasStandardSchema: false },
    { id: '2', name: 'Plant Sensors', department: 'Engineering', format: 'CSV', estimatedVolumeMb: 200, updateFrequency: 'Daily', hasStandardSchema: false },
    { id: '3', name: 'Salesforce', department: 'Sales', format: 'REST API', estimatedVolumeMb: 150, updateFrequency: 'Realtime', hasStandardSchema: true },
  ];

  const result = calculateSiloIntegrationComplexity(silos);
  assert.ok(result.complexityScore > 40);
  assert.ok(result.unifiedSchemaSuggestion.length >= 4);
});

