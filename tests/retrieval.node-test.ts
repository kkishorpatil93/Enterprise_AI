import test from 'node:test';
import assert from 'node:assert/strict';
import { chunkText, BM25Ranker } from '../lib/retrieval.ts';

test('Retrieval - Chunks text cleanly with overlap', () => {
  const longText = 'Sentence one is here. '.repeat(50);
  const chunks = chunkText(longText, 'TestDoc.pdf', 'Engineering', 1, { chunkSize: 200, overlap: 30 });
  assert.ok(chunks.length > 2);
  assert.equal(chunks[0].documentName, 'TestDoc.pdf');
  assert.equal(chunks[0].page, 1);
});

test('Retrieval - BM25 accurately ranks matching documents and drops irrelevant queries', () => {
  const chunks = [
    {
      id: 'c1',
      documentName: 'Strategy.pdf',
      page: 1,
      content: 'The primary legacy hardware bottleneck is 26 outdated Windows Server 2012 nodes with high memory saturation.',
      department: 'IT',
    },
    {
      id: 'c2',
      documentName: 'Cost.pdf',
      page: 3,
      content: 'Cloud computing budget shows $28,400 monthly spend with 8 idle EC2 instances in us-east-2.',
      department: 'Finance',
    },
    {
      id: 'c3',
      documentName: 'Security.pdf',
      page: 2,
      content: 'Unmasked personal PII was detected across assembly line telemetry spreadsheets.',
      department: 'Security',
    },
  ];

  const ranker = new BM25Ranker(chunks);

  // Search for legacy hardware
  const infraMatches = ranker.search('legacy hardware Windows Server memory', 2);
  assert.ok(infraMatches.length > 0);
  assert.equal(infraMatches[0].id, 'c1');
  assert.equal(infraMatches[0].page, 1);

  // Search for budget and cloud cost
  const costMatches = ranker.search('cloud compute budget monthly spend', 2);
  assert.ok(costMatches.length > 0);
  assert.equal(costMatches[0].id, 'c2');

  // Search for completely out-of-scope query
  const outOfScope = ranker.search('quantum supersonic aerospace propulsion', 2, 1.5);
  assert.equal(outOfScope.length, 0);
});

