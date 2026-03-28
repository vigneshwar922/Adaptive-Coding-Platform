// Shared navbar is handled by api.js renderNavbar

let editor;
let currentProblemId;
let currentExamples = [];
let currentProblemLabels = [];
let currentSubmissions = [];

const defaultCode = {
  python: '# Write your solution here\n\n',
  java: `import java.util.Scanner;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    // Write your solution here
  }
}`,
  javascript: '// Write your solution here\n\n',
  cpp: `#include<iostream>
using namespace std;

int main() {
  // Write your solution here
  return 0;
}`
};

function getProblemId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// LEFT TAB SWITCHING
function switchLeftTab(tab) {
  document.querySelectorAll('.problem-left-section .section-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.problem-left-section .tab-pane').forEach(p => p.classList.remove('active'));

  event.target.classList.add('active');
  document.getElementById(`tab-content-${tab}`).classList.add('active');
}

// CONSOLE TAB SWITCHING
function switchConsoleTab(tab) {
  document.querySelectorAll('.console-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.console-pane').forEach(p => p.classList.remove('active'));

  event.target.classList.add('active');
  document.getElementById(`console-${tab}`).classList.add('active');
}

function toggleConsole() {
  const consoleEl = document.querySelector('.fixed-console');
  consoleEl.style.display = consoleEl.style.display === 'none' ? 'flex' : 'none';
  setTimeout(() => { if (editor) editor.layout(); }, 50);
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.style.background = type === 'success' ? '#dcfce7' : '#fee2e2';
  toast.style.color = type === 'success' ? '#15803d' : '#b91c1c';
  toast.style.border = type === 'success' ? '1px solid #86efac' : '1px solid #fca5a5';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '8px';
  toast.style.marginBottom = '10px';
  toast.style.fontWeight = '600';
  toast.textContent = message;

  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Monaco Editor
require.config({
  paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' }
});

require(['vs/editor/editor.main'], function () {
  editor = monaco.editor.create(document.getElementById('editor'), {
    value: defaultCode.python,
    language: 'python',
    theme: 'vs',
    fontSize: 14,
    minimap: { enabled: false },
    automaticLayout: true
  });

  loadProblem();
});

function changeLanguage() {
  const lang = document.getElementById('language-select').value;
  monaco.editor.setModelLanguage(editor.getModel(), lang);
  editor.setValue(defaultCode[lang]);
}

async function loadProblem() {
  const id = getProblemId();
  if (!id) return;

  currentProblemId = id;

  try {
    const problem = await problems.getById(id);

    document.getElementById('problem-title').textContent = problem.title;
    document.getElementById('problem-description').textContent = problem.description;

    currentExamples = Array.isArray(problem.examples) ? problem.examples : [];
    currentProblemLabels = problem.input_labels
      ? problem.input_labels.split(',').map(l => l.trim())
      : [];

    renderExamples();
    loadMySubmissions(id);

  } catch (err) {
    console.log(err);
  }
}

function renderExamples() {
  const examplesDiv = document.getElementById('problem-examples');
  examplesDiv.innerHTML = '';

  currentExamples.forEach((ex, i) => {
    examplesDiv.innerHTML += `
      <div class="example-box">
        <strong>Example ${i + 1}</strong>
        <pre>Input:
${ex.input}

Output:
${ex.expected_output}</pre>
      </div>
    `;
  });
}

async function loadMySubmissions(problemId) {
  try {
    const data = await submissions.getMySubmissions();
    currentSubmissions = data.filter(s => String(s.problem_id) === String(problemId));

    const container = document.getElementById('submissions-list');
    container.innerHTML = currentSubmissions.length === 0
      ? '<p>No submissions yet.</p>'
      : currentSubmissions.map(s => `
          <div>
            ${s.status} | ${s.language}
          </div>
        `).join('');
  } catch (err) {
    console.log(err);
  }
}

// ✅ CLEAN MULTI TESTCASE RUN
async function runCode() {
  const language = document.getElementById('language-select').value;
  const code = editor.getValue();
  const resultContent = document.getElementById('result-content');

  if (!code.trim()) {
    resultContent.innerHTML = 'Write code first.';
    return;
  }

  resultContent.innerHTML = 'Running...';

  try {
    let resultsHTML = '';

    for (let i = 0; i < currentExamples.length; i++) {
      const ex = currentExamples[i];

      const data = await submissions.run(language, code, ex.input);

      const actual = data.stdout?.trim() || '';
      const expected = ex.expected_output.trim();
      const passed = actual === expected;

      resultsHTML += `
        <div>
          <strong>Case ${i + 1}:</strong> ${passed ? '✅ Passed' : '❌ Failed'}<br/>
          Input: ${ex.input}<br/>
          Expected: ${expected}<br/>
          Output: ${actual || data.stderr}
        </div><br/>
      `;
    }

    resultContent.innerHTML = resultsHTML;

  } catch (err) {
    resultContent.innerHTML = 'Error running code.';
  }
}

async function submitCode() {
  const language = document.getElementById('language-select').value;
  const code = editor.getValue();

  try {
    const data = await submissions.submit(currentProblemId, language, code);
    showToast(data.status === 'accepted' ? 'Accepted' : 'Wrong Answer');
    loadMySubmissions(currentProblemId);
  } catch {
    showToast('Submission failed', 'error');
  }
}

function resetCode() {
  const lang = document.getElementById('language-select').value;
  editor.setValue(defaultCode[lang]);
}