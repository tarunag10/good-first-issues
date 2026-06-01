import {
  analyzeRepoReadiness,
  buildMaintainerRoadmap,
  suggestGoodFirstIssues,
  suggestPolicyTodos,
} from './helper.js';

const input = document.querySelector('#files');
const output = document.querySelector('#output');
const sample = document.querySelector('#sample');

const sampleFiles = `README.md
LICENSE
CONTRIBUTING.md
ACCESSIBILITY.md
index.html
.github/ISSUE_TEMPLATE/bug_report.md
.github/labels.yml`;

function parseFiles() {
  return input.value.split(/\n|,/).map((x) => x.trim()).filter(Boolean);
}

function renderList(items) {
  return items.map((item) => `<li>${item}</li>`).join('');
}

function renderIssues(issues) {
  return issues.map((issue) => `<article class="card">
    <h3>${issue.title}</h3>
    <p>${issue.body}</p>
    <p class="keywords"><strong>Labels:</strong> ${issue.labels.join(', ')}</p>
  </article>`).join('');
}

function renderRoadmap(roadmap) {
  return roadmap.map((group) => `<section class="recommendation-group">
    <h4>${group.category} <span>${group.complete}/${group.total}</span></h4>
    <ul>${group.items.map((item) => `<li>
      <strong>${item.status === 'complete' ? 'Done' : 'Next'}:</strong> ${item.title}
      <p>${item.why}</p>
      <p class="keywords"><strong>Acceptance:</strong> ${item.acceptanceCriteria.join('; ')}</p>
    </li>`).join('')}</ul>
  </section>`).join('');
}

function update() {
  const files = parseFiles();
  const analysis = analyzeRepoReadiness(files);
  const todos = suggestPolicyTodos(files);
  const roadmap = buildMaintainerRoadmap(files);
  output.innerHTML = `<h2>Readiness score: ${analysis.score}%</h2>
    <p>${analysis.present.length} of ${analysis.total} maintainer signals found.</p>
    <h3>Found</h3>
    <ul>${renderList(analysis.present.map((check) => check.label)) || '<li>Nothing yet</li>'}</ul>
    <h3>Grouped roadmap checklist</h3>
    ${renderRoadmap(roadmap)}
    <h3>Policy and documentation TODOs</h3>
    <ul>${renderList(todos) || '<li>No obvious policy gaps.</li>'}</ul>
    <h3>Good-first-issue suggestions</h3>
    <div class="cards">${renderIssues(suggestGoodFirstIssues(files))}</div>`;
}

sample.addEventListener('click', () => {
  input.value = sampleFiles;
  update();
  input.focus();
});

input.addEventListener('input', update);
update();
