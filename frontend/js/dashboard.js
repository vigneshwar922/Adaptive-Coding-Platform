// logout function is now handled by api.js renderNavbar

// load everything when page opens
async function loadDashboard() {
  const user = getUser();
  if (user) {
    document.getElementById('welcome-msg').textContent =
      `Welcome back, ${user.name}! You've solved ${document.getElementById('total-solved')?.textContent || 0} problems so far.`;
  }

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
      topicContainer.innerHTML = '<p class="empty-state">No progress yet. Start solving problems!</p>';
      return;
    }

    let topicHTML = '';

    data.forEach(p => {
      totalEasy += (p.easy_solved || 0);
      totalMedium += (p.medium_solved || 0);
      totalHard += (p.hard_solved || 0);

      const total = (p.easy_solved || 0) + (p.medium_solved || 0) + (p.hard_solved || 0);
      const maxProblems = 20; // Increased for better scale
      const percent = Math.min(Math.round((total / maxProblems) * 100), 100);

      topicHTML += `
        <div class="progress-item" style="margin-bottom:20px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <span style="text-transform:capitalize; font-size:15px; font-weight:600; color:#1e293b;">${p.topic}</span>
            <span style="color:#64748b; font-size:13px;">
              ${p.easy_solved || 0} E · ${p.medium_solved || 0} M · ${p.hard_solved || 0} H
            </span>
          </div>
          <div class="progress-bar-container" style="background:#f1f5f9; height:10px; border-radius:10px;">
            <div class="progress-bar" style="width:${percent}%; background:#6366f1; height:100%; border-radius:10px;"></div>
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
    document.getElementById('topic-progress').innerHTML = '<p class="error-msg">Failed to load progress.</p>';
  }
}

// load recommendations
async function loadRecommendations() {
  try {
    const data = await progress.getRecommendations();
    const container = document.getElementById('recommendations');

    if (!data || data.length === 0) {
      container.innerHTML = '<p class="empty-state">Solve more problems to get recommendations.</p>';
      return;
    }

    let html = '';
    data.slice(0, 3).forEach(problem => {
      html += `
        <div class="rec-card" onclick="window.location.href='problem.html?id=${problem.id}'"
          style="padding:16px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px;
          margin-bottom:12px; cursor:pointer; transition:all 0.2s; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:600; color:#1e293b;">${problem.title}</span>
          <span class="badge badge-${problem.difficulty.toLowerCase()}">${problem.difficulty}</span>
        </div>
      `;
    });

    container.innerHTML = html;

  } catch (err) {
    document.getElementById('recommendations').innerHTML = '<p class="error-msg">Failed to load recommendations.</p>';
  }
}

// load recent submissions
async function loadRecentSubmissions() {
  try {
    const data = await submissions.getMySubmissions();
    const container = document.getElementById('recent-submissions');

    if (!data || data.length === 0) {
      container.innerHTML = '<p class="empty-state">No submissions yet.</p>';
      return;
    }

    let html = `
      <table class="problems-table dashboard-table">
        <thead>
          <tr>
            <th>Problem</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
    `;

    data.slice(0, 5).forEach(s => {
      const date = new Date(s.submitted_at).toLocaleDateString();
      html += `
        <tr>
          <td style="font-weight:600; color:#1e293b;">${s.title}</td>
          <td><span class="status-badge-${s.status.toLowerCase()}">${s.status}</span></td>
          <td style="color:#64748b; font-size:13px;">${date}</td>
        </tr>
      `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;

  } catch (err) {
    document.getElementById('recent-submissions').innerHTML = '<p class="error-msg">Failed to load submissions.</p>';
  }
}

loadDashboard();
