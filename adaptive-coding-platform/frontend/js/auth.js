// only redirect if we are logged in and on index.html (which is now the home/login page)
document.addEventListener('DOMContentLoaded', () => {
  const isIndex = window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/frontend/');
  if (isIndex) {
    if (isLoggedIn()) {
      document.getElementById('auth-content').style.display = 'block';
      document.getElementById('guest-content').style.display = 'none';
    } else {
      document.getElementById('auth-content').style.display = 'none';
      document.getElementById('guest-content').style.display = 'block';
    }
  }
});

async function handleLogin() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorDiv = document.getElementById('error-msg');

  if (!email || !password) {
    errorDiv.innerHTML = '<div class="alert alert-error">Please fill in all fields</div>';
    return;
  }

  try {
    const data = await auth.login(email, password);

    if (data.token) {
      saveToken(data.token);
      saveUser(data.user);
      window.location.href = 'problems.html';
    } else {
      errorDiv.innerHTML = `<div class="alert alert-error">${data.message || 'Login failed'}</div>`;
    }
  } catch (err) {
    errorDiv.innerHTML = '<div class="alert alert-error">Something went wrong. Try again.</div>';
  }
}

async function handleRegister() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorDiv = document.getElementById('error-msg');

  if (!name || !email || !password) {
    errorDiv.innerHTML = '<div class="alert alert-error">Please fill in all fields</div>';
    return;
  }

  if (password.length < 6) {
    errorDiv.innerHTML = '<div class="alert alert-error">Password must be at least 6 characters</div>';
    return;
  }

  try {
    const data = await auth.register(name, email, password);

    if (data.token) {
      saveToken(data.token);
      saveUser(data.user);
      window.location.href = 'problems.html';
    } else {
      errorDiv.innerHTML = `<div class="alert alert-error">${data.message || 'Registration failed'}</div>`;
    }
  } catch (err) {
    errorDiv.innerHTML = '<div class="alert alert-error">Something went wrong. Try again.</div>';
  }
}