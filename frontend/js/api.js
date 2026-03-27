const API_URL = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : 'https://adaptive-coding-platform.onrender.com/api';

// save token to localStorage
function saveToken(token) {
  localStorage.setItem('token', token);
}

// get token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

// remove token (logout)
function removeToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// save user info
function saveUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

// get user info
function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// check if logged in
function isLoggedIn() {
  return getToken() !== null;
}

// redirect to login if not logged in
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'index.html';
  }
}

// render navbar based on auth status
function renderNavbar() {
  const navActions = document.getElementById('nav-actions');
  if (!navActions) return;

  const currentPath = window.location.pathname;
  const isProblems = currentPath.includes('problems.html');
  const isCourses = currentPath.includes('courses.html');
  const isWishlist = currentPath.includes('wishlist.html');

  if (isLoggedIn()) {
    const user = getUser();
    navActions.innerHTML = `
      <div class="user-nav-top">
        <div class="profile-icon" onclick="window.location.href='dashboard.html'" title="Profile">
          <img src="${user.profile_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)}" alt="${user.name}">
        </div>
        <a href="#" onclick="logout()" class="logout-link">Logout</a>
      </div>
    `;
  } else {
    navActions.innerHTML = `
      <a href="index.html">Login</a>
      <a href="register.html">Sign Up</a>
    `;
  }

  // Add secondary navbar always (persistent navigation)
  let secondaryNav = document.getElementById('secondary-nav');
  if (!secondaryNav) {
    secondaryNav = document.createElement('div');
    secondaryNav.id = 'secondary-nav';
    secondaryNav.className = 'secondary-nav';
    const mainNav = document.querySelector('.main-nav') || document.querySelector('nav');
    if (mainNav) mainNav.after(secondaryNav);
  }
  
  secondaryNav.innerHTML = `
    <div class="container secondary-nav-container">
      <a href="problems.html" class="${isProblems ? 'active' : ''}">Problems</a>
      <a href="courses.html" class="${isCourses ? 'active' : ''}">Courses</a>
      <a href="wishlist.html" class="${isWishlist || currentPath.includes('wishlist') ? 'active' : ''}">Wishlist</a>
    </div>
  `;
}

function logout() {
  removeToken();
  window.location.href = 'index.html';
}

// init navbar on load
document.addEventListener('DOMContentLoaded', renderNavbar);

// AUTH API calls
const auth = {
  register: async (name, email, password) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return res.json();
  },

  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  }
};

// PROBLEMS API calls
const problems = {
  getAll: async (topic = '', difficulty = '') => {
    let url = `${API_URL}/problems?`;
    if (topic) url += `topic=${topic}&`;
    if (difficulty) url += `difficulty=${difficulty}`;
    const res = await fetch(url);
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_URL}/problems/${id}`);
    return res.json();
  }
};

// SUBMISSIONS API calls
const submissions = {
   run: async (language, code, input) => {
    const res = await fetch(`${API_URL}/submissions/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, code, input })
    });
    return res.json();
   },
  submit: async (problem_id, language, code) => {
    const res = await fetch(`${API_URL}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ problem_id, language, code })
    });
    return res.json();
  },

  getMySubmissions: async () => {
    const res = await fetch(`${API_URL}/submissions`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  }
};

// PROGRESS API calls
const progress = {
  getProgress: async () => {
    const res = await fetch(`${API_URL}/progress`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  },

  getRecommendations: async () => {
    const res = await fetch(`${API_URL}/progress/recommendations`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  }
};

// WISHLIST API calls
const wishlist = {
  getCollections: async () => {
    const res = await fetch(`${API_URL}/wishlist/collections`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  },
  getCollectionItems: async (collection_id) => {
    const res = await fetch(`${API_URL}/wishlist/collections/${collection_id}/items`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return res.json();
  },
  createCollection: async (name, is_public = false) => {
    const res = await fetch(`${API_URL}/wishlist/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ name, is_public })
    });
    return res.json();
  },
  addItem: async (collection_id, problem_id) => {
    const res = await fetch(`${API_URL}/wishlist/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ collection_id, problem_id })
    });
    return res.json();
  },
  share: async (collection_id, username) => {
    const res = await fetch(`${API_URL}/wishlist/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ collection_id, username })
    });
    return res.json();
  }
};
