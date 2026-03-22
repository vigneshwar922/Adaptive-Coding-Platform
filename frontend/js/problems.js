requireAuth();

// show welcome message
const user = getUser();
if (user) {
  document.getElementById('welcome-msg').textContent = `Hello, ${user.name}`;
}

// logout function
function logout() {
  removeToken();
  window.location.href = 'index.html';
}

// load problems from backend
async function loadProblems() {
  const topic = document.getElementById('filter-topic').value;
  const difficulty = document.getElementById('filter-difficulty').value;
  const container = document.getElementById('problems-container');

  container.innerHTML = '<div class="loading">Loading problems...</div>';

  try {
    const data = await problems.getAll(topic, difficulty);

    if (!data || data.length === 0) {
      container.innerHTML = '<div class="loading">No problems found.</div>';
      return;
    }

    let html = `
      <table class="problems-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Topic</th>
            <th>Difficulty</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.forEach((problem, index) => {
      html += `
        <tr onclick="window.location.href='problem.html?id=${problem.id}'">
          <td>${index + 1}</td>
          <td>${problem.title}</td>
          <td><span class="topic-badge">${problem.topic}</span></td>
          <td><span class="badge badge-${problem.difficulty}">${problem.difficulty}</span></td>
        </tr>
      `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;

  } catch (err) {
    container.innerHTML = '<div class="loading">Failed to load problems. Make sure backend is running.</div>';
  }
}

// load problems when page opens
loadProblems();