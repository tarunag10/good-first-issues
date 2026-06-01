export const checks = [
  {
    id: 'readme',
    category: 'Documentation',
    label: 'README',
    matches: ['README.md', 'README'],
    why: 'Explains what the project does, how to run it, and who it helps.',
    policyTodo: 'Add a README with setup, demo, support, and contribution entry points.',
  },
  {
    id: 'contributing',
    category: 'Community',
    label: 'CONTRIBUTING',
    matches: ['CONTRIBUTING.md', 'docs/CONTRIBUTING.md'],
    why: 'Gives new contributors a safe path from issue to pull request.',
    policyTodo: 'Create CONTRIBUTING.md with local setup, branch naming, tests, and review expectations.',
  },
  {
    id: 'license',
    category: 'Community',
    label: 'LICENSE',
    matches: ['LICENSE', 'LICENSE.md', 'COPYING'],
    why: 'Clarifies whether people can reuse, fork, and contribute.',
    policyTodo: 'Add an OSI-compatible license and note any separate content license.',
  },
  {
    id: 'security',
    category: 'Security',
    label: 'SECURITY',
    matches: ['SECURITY.md', '.github/SECURITY.md'],
    why: 'Shows how to report vulnerabilities privately.',
    policyTodo: 'Add SECURITY.md with supported versions and a private reporting contact.',
  },
  {
    id: 'code-of-conduct',
    category: 'Community',
    label: 'CODE_OF_CONDUCT',
    matches: ['CODE_OF_CONDUCT.md', '.github/CODE_OF_CONDUCT.md'],
    why: 'Sets conduct expectations before community problems appear.',
    policyTodo: 'Add a code of conduct and explain enforcement contact points.',
  },
  {
    id: 'accessibility',
    category: 'Accessibility',
    label: 'Accessibility statement',
    matches: ['ACCESSIBILITY.md', 'accessibility.md', 'docs/accessibility.md'],
    why: 'Makes inclusive contribution and product commitments visible.',
    policyTodo: 'Add accessibility statement, known limitations, keyboard checks, and reporting route.',
  },
  {
    id: 'issue-templates',
    category: 'Community',
    label: 'Issue templates',
    matches: ['.github/ISSUE_TEMPLATE/bug_report.md', '.github/ISSUE_TEMPLATE/feature_request.md', '.github/ISSUE_TEMPLATE/config.yml'],
    why: 'Collects consistent information without maintainer back-and-forth.',
    policyTodo: 'Add bug, feature, documentation, and good-first-issue templates.',
  },
  {
    id: 'good-first-label',
    category: 'Community',
    label: 'Good-first-issue labels',
    matches: ['labels.yml', '.github/labels.yml', 'good first issue', 'good-first-issue'],
    why: 'Lets beginners find scoped, low-risk work.',
    policyTodo: 'Create labels for good first issue, documentation, accessibility, tests, and help wanted.',
  },
  {
    id: 'roadmap',
    category: 'Documentation',
    label: 'Roadmap',
    matches: ['ROADMAP.md', 'docs/roadmap.md', 'roadmap'],
    why: 'Shows contributors what direction the project is taking.',
    policyTodo: 'Publish a short roadmap with now, next, later, and non-goals.',
  },
  {
    id: 'screenshots-demo',
    category: 'Demo quality',
    label: 'Screenshots or demo link',
    matches: ['demo', 'screenshot', 'screenshots/', 'public/demo', 'index.html'],
    why: 'Helps contributors understand the product before installing anything.',
    policyTodo: 'Add screenshots, a hosted demo link, or a static local demo path to the README.',
  },
  {
    id: 'beginner-docs',
    category: 'Documentation',
    label: 'Beginner-friendly docs',
    matches: ['docs/getting-started.md', 'GETTING_STARTED.md', 'quickstart', 'first contribution'],
    why: 'Reduces the hidden knowledge needed for a first pull request.',
    policyTodo: 'Add a getting-started guide with prerequisites, test command, and first task walkthrough.',
  },
];

const normalize = (value) => value.toLowerCase().trim();
const roadmapCategories = ['Documentation', 'Accessibility', 'Security', 'Community', 'Demo quality'];

export const fileListPresets = [
  {
    id: 'empty-static',
    name: 'Empty static starter',
    description: 'A brand-new static project with only an HTML entry point and no maintainer files yet.',
    files: ['index.html', 'styles.css', 'src/app.js'],
  },
  {
    id: 'basic-community',
    name: 'Basic community repo',
    description: 'A small open-source repo with core reuse and contribution documents started.',
    files: ['README.md', 'LICENSE', 'CONTRIBUTING.md', 'index.html'],
  },
  {
    id: 'civic-beta',
    name: 'Civic beta project',
    description: 'A public-service beta with accessibility, security, and issue routing partly in place.',
    files: [
      'README.md',
      'LICENSE',
      'CONTRIBUTING.md',
      'ACCESSIBILITY.md',
      'SECURITY.md',
      '.github/ISSUE_TEMPLATE/bug_report.md',
      'public/demo/index.html',
    ],
  },
  {
    id: 'maintainer-ready',
    name: 'Maintainer-ready repo',
    description: 'A mature starter state with governance, templates, labels, roadmap, and onboarding docs.',
    files: [
      'README.md',
      'LICENSE',
      'CONTRIBUTING.md',
      'SECURITY.md',
      'CODE_OF_CONDUCT.md',
      'ACCESSIBILITY.md',
      '.github/ISSUE_TEMPLATE/bug_report.md',
      '.github/ISSUE_TEMPLATE/feature_request.md',
      '.github/labels.yml',
      'ROADMAP.md',
      'docs/getting-started.md',
      'index.html',
    ],
  },
];

function hasMatch(files, check) {
  const normalizedFiles = files.map(normalize);
  return check.matches.some((needle) => {
    const normalizedNeedle = normalize(needle);
    return normalizedFiles.some((file) => file === normalizedNeedle || file.includes(normalizedNeedle));
  });
}

export function analyzeRepoReadiness(files) {
  const present = [];
  const missing = [];

  for (const check of checks) {
    const target = hasMatch(files, check) ? present : missing;
    target.push(check);
  }

  return {
    score: Math.round((present.length / checks.length) * 100),
    present,
    missing,
    total: checks.length,
  };
}

export function scoreRepoReadiness(files) {
  const analysis = analyzeRepoReadiness(files);
  return {
    score: analysis.score,
    missing: analysis.missing.map((check) => check.label),
  };
}

export function suggestGoodFirstIssues(files) {
  const analysis = analyzeRepoReadiness(files);
  const suggestions = analysis.missing.map((check) => ({
    title: `Add ${check.label} contributor guidance`,
    labels: ['good first issue', 'documentation'],
    body: `${check.why} Suggested task: ${check.policyTodo}`,
  }));

  suggestions.push(
    {
      title: 'Write three small starter issues from the roadmap',
      labels: ['good first issue', 'help wanted'],
      body: 'Create beginner-safe issues with context, changed files, acceptance criteria, and test commands.',
    },
    {
      title: 'Add a no-backend demo walkthrough to the README',
      labels: ['good first issue', 'documentation'],
      body: 'Document how to open the static demo, what to click first, and how to verify the browser-only workflow.',
    },
  );

  return suggestions.slice(0, 8);
}

export function suggestPolicyTodos(files) {
  return analyzeRepoReadiness(files).missing.map((check) => check.policyTodo);
}

export function buildMaintainerRoadmap(files) {
  const analysis = analyzeRepoReadiness(files);
  const presentIds = new Set(analysis.present.map((check) => check.id));

  return roadmapCategories.map((category) => {
    const items = checks
      .filter((check) => check.category === category)
      .map((check) => {
        const complete = presentIds.has(check.id);
        return {
          id: check.id,
          title: complete ? `Keep ${check.label} current` : check.policyTodo,
          status: complete ? 'complete' : 'todo',
          labels: ['good first issue', category.toLowerCase().replace(/\s+/g, '-')],
          why: check.why,
          acceptanceCriteria: complete
            ? [`${check.label} remains easy to find`, 'Links and instructions still match the current project']
            : [`Add or update ${check.label}`, 'Include clear owner, setup, verification, or reporting details'],
        };
      });

    return {
      category,
      complete: items.filter((item) => item.status === 'complete').length,
      total: items.length,
      items,
    };
  });
}

export function buildIssueMarkdown(item) {
  return [
    '## Summary',
    item.title,
    '',
    '## Why this helps',
    item.why,
    '',
    '## Acceptance criteria',
    ...item.acceptanceCriteria.map((criterion) => `- [ ] ${criterion}`),
    '',
    '## Suggested labels',
    `Labels: ${item.labels.join(', ')}`,
  ].join('\n');
}

export function buildCategoryIssueMarkdown(group) {
  const categoryLabel = group.category.toLowerCase().replace(/\s+/g, '-');
  return [
    `## ${group.category} starter backlog`,
    `${group.complete}/${group.total} maintainer signals are already present. Use this issue to split or track beginner-safe improvements in this category.`,
    '',
    '## Recommendations',
    ...group.items.map((item) => `- [ ] ${item.title}`),
    '',
    '## Acceptance criteria',
    '- [ ] Each selected task has a clear owner, changed files, and verification command',
    '- [ ] Completed items link to merged pull requests or follow-up issues',
    '',
    '## Suggested labels',
    `Labels: good first issue, ${categoryLabel}`,
  ].join('\n');
}
