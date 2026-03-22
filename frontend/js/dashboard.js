requireAuth();

function logout() {
  removeToken();
  window.location.href = 'index.html';
}

// show welcome message
const user = getUser();
if (user) {
  document.getElementById('welcome-msg').textContent =
    `Welcome back, ${user.name}! Keep practicing to improve your skills.`;
}

// load everything when page opens
async function loadDashboard() {
  await Promise.all([
    loadProgress(),
    loadRecommendations(),
    loadRecentSubmissions()
  ]);
}

// load user progress
async function loadProgress() {
  try {
    const data = await progress.getProgress();

    let totalEasy = 0;
    let totalMedium = 0;
    let totalHard = 0;

    const topicContainer = document.getElementById('topic-progress');

    if (!data || data.length === 0) {
      topicContainer.innerHTML = '<p style="color:#555; font-size:14px;">No progress yet. Start solving problems!</p>';
      return;
    }

    let topicHTML = '';

    data.forEach(p => {
      totalEasy += p.easy_solved;
      totalMedium += p.medium_solved;
      totalHard += p.hard_solved;

      const total = p.easy_solved + p.medium_solved + p.hard_solved;
      const maxProblems = 10;
      const percent = Math.min(Math.round((total / maxProblems) * 100), 100);

      topicHTML += `
        <div style="margin-bottom:16px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
            <span style="text-transform:capitalize; font-size:14px;">${p.topic}</span>
            <span style="color:#a0a0b0; font-size:13px;">
              ${p.easy_solved} easy · ${p.medium_solved} medium · ${p.hard_solved} hard
            </span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar" style="width:${percent}%"></div>
          </div>
        </div>
      `;
    });

    topicContainer.innerHTML = topicHTML;

    // update stat cards
    document.getElementById('easy-solved').textContent = totalEasy;
    document.getElementById('medium-solved').textContent = totalMedium;
    document.getElementById('hard-solved').textContent = totalHard;
    document.getElementById('total-solved').textContent = totalEasy + totalMedium + totalHard;

  } catch (err) {
    document.getElementById('topic-progress').innerHTML =
      '<p style="color:#f87171;">Failed to load progress.</p>';
  }
}

// load recommendations
async function loadRecommendations() {
  try {
    const data = await progress.getRecommendations();
    const container = document.getElementById('recommendations');

    if (!data || data.length === 0) {
      container.innerHTML = '<p style="color:#555; font-size:14px;">No recommendations yet.</p>';
      return;
    }

    let html = '';
    data.forEach(problem => {
      html += `
        <div onclick="window.location.href='problem.html?id=${problem.id}'"
          style="display:flex; justify-content:space-between; align-items:center;
          padding:12px 16px; background:#0f0f23; border-radius:8px;
          margin-bottom:10px; cursor:pointer; transition:background 0.2s;"
          onmouseover="this.style.background='#16213e'"
          onmouseout="this.style.background='#0f0f23'">
          <span style="font-size:15px;">${problem.title}</span>
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="color:#a0a0b0; font-size:13px; text-transform:capitalize;">${problem.topic}</span>
            <span class="badge badge-${problem.difficulty}">${problem.difficulty}</span>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

  } catch (err) {
    document.getElementById('recommendations').innerHTML =
      '<p style="color:#f87171;">Failed to load recommendations.</p>';
  }
}

// load recent submissions
async function loadRecentSubmissions() {
  try {
    const data = await submissions.getMySubmissions();
    const container = document.getElementById('recent-submissions');

    if (!data || data.length === 0) {
      container.innerHTML = '<p style="color:#555; font-size:14px;">No submissions yet.</p>';
      return;
    }

    let html = `
      <table class="problems-table">
        <thead>
          <tr>
            <th>Problem</th>
            <th>Language</th>
            <th>Status</th>
            <th>Time</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.slice(0, 10).forEach(s => {
  const date = new Date(s.submitted_at).toLocaleDateString();
  const lang = s.language || '-';
  const time = s.execution_time ? parseFloat(s.execution_time).toFixed(3) + 's' : '-';
  html += `
    <tr>
      <td>${s.title}</td>
      <td style="text-transform:capitalize;">${lang}</td>
      <td><span class="badge badge-${s.status}">${s.status}</span></td>
      <td style="color:#a0a0b0;">${time}</td>
      <td style="color:#555; font-size:13px;">${date}</td>
    </tr>
  `;
});

    html += '</tbody></table>';
    container.innerHTML = html;

  } catch (err) {
    document.getElementById('recent-submissions').innerHTML =
      '<p style="color:#f87171;">Failed to load submissions.</p>';
  }
}

loadDashboard();
