import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeRepoReadiness,
  buildCategoryIssueMarkdown,
  buildIssueMarkdown,
  buildMaintainerRoadmap,
  fileListPresets,
  scoreRepoReadiness,
  suggestGoodFirstIssues,
  suggestPolicyTodos,
} from '../src/helper.js';

test('scores repository readiness and suggests contributor issues', () => {
  assert.equal(scoreRepoReadiness(['README.md', 'LICENSE', 'CONTRIBUTING.md']).missing.includes('SECURITY'), true);
  assert.ok(suggestGoodFirstIssues(['README.md']).some((issue) => /accessibility/i.test(issue.title)));
});

test('checks expected maintainer signals', () => {
  const analysis = analyzeRepoReadiness([
    'README.md',
    'LICENSE',
    'CONTRIBUTING.md',
    'SECURITY.md',
    'CODE_OF_CONDUCT.md',
    'ACCESSIBILITY.md',
    '.github/ISSUE_TEMPLATE/bug_report.md',
    '.github/labels.yml',
    'ROADMAP.md',
    'index.html',
    'docs/getting-started.md',
  ]);

  assert.equal(analysis.score, 100);
  assert.equal(analysis.missing.length, 0);
});

test('generates concrete policy todos and good-first-issue bodies', () => {
  const todos = suggestPolicyTodos(['README.md']);
  assert.ok(todos.some((todo) => todo.includes('SECURITY.md')));
  assert.ok(todos.some((todo) => todo.includes('code of conduct')));

  const issues = suggestGoodFirstIssues(['README.md']);
  assert.ok(issues.every((issue) => issue.labels.includes('good first issue')));
  assert.ok(issues.some((issue) => issue.body.includes('Suggested task')));
});

test('groups maintainer roadmap recommendations by improvement area', () => {
  const roadmap = buildMaintainerRoadmap(['README.md', 'LICENSE']);

  assert.deepEqual(
    roadmap.map((group) => group.category),
    ['Documentation', 'Accessibility', 'Security', 'Community', 'Demo quality'],
  );

  const security = roadmap.find((group) => group.category === 'Security');
  assert.ok(security.items.some((item) => item.id === 'security'));
  assert.ok(security.items.every((item) => item.labels.includes('security')));

  const demo = roadmap.find((group) => group.category === 'Demo quality');
  assert.ok(demo.items.some((item) => item.id === 'screenshots-demo'));
  assert.ok(demo.items.every((item) => item.acceptanceCriteria.length >= 2));
});

test('marks grouped maintainer recommendations complete when signals are present', () => {
  const roadmap = buildMaintainerRoadmap([
    'README.md',
    'LICENSE',
    'CONTRIBUTING.md',
    'SECURITY.md',
    'CODE_OF_CONDUCT.md',
    'ACCESSIBILITY.md',
    '.github/ISSUE_TEMPLATE/bug_report.md',
    '.github/labels.yml',
    'ROADMAP.md',
    'index.html',
    'docs/getting-started.md',
  ]);

  assert.ok(roadmap.every((group) => group.items.every((item) => item.status === 'complete')));
  assert.ok(roadmap.every((group) => group.complete === group.total));
});

test('generates GitHub issue markdown for a roadmap recommendation', () => {
  const roadmap = buildMaintainerRoadmap(['README.md']);
  const accessibility = roadmap.find((group) => group.category === 'Accessibility').items[0];

  const markdown = buildIssueMarkdown(accessibility);

  assert.match(markdown, /^## Summary/m);
  assert.match(markdown, /Add accessibility statement/);
  assert.match(markdown, /## Why this helps/);
  assert.match(markdown, /## Acceptance criteria/);
  assert.match(markdown, /- \[ \] Add or update Accessibility statement/);
  assert.match(markdown, /Labels: good first issue, accessibility/);
});

test('generates category issue markdown grouped by recommendation category', () => {
  const documentation = buildMaintainerRoadmap(['README.md'])
    .find((group) => group.category === 'Documentation');

  const markdown = buildCategoryIssueMarkdown(documentation);

  assert.match(markdown, /^## Documentation starter backlog/m);
  assert.match(markdown, /- \[ \] Keep README current/);
  assert.match(markdown, /- \[ \] Publish a short roadmap/);
  assert.match(markdown, /Labels: good first issue, documentation/);
});

test('provides starter repository file-list presets', () => {
  assert.ok(fileListPresets.length >= 3);
  assert.ok(fileListPresets.some((preset) => preset.id === 'empty-static'));
  assert.ok(fileListPresets.every((preset) => preset.files.includes('README.md') || preset.id === 'empty-static'));
  assert.ok(fileListPresets.every((preset) => preset.description.length > 20));
});
