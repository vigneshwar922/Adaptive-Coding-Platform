document.addEventListener('DOMContentLoaded', () => {
    // Utility functions to handle mock auth state
    const authSection = document.getElementById('auth-section');

    function checkAuthState() {
        const user = localStorage.getItem('currentUser');
        renderAuthSection(user ? JSON.parse(user) : null);
    }

    function renderAuthSection(user) {
        if (!authSection) return;

        if (user) {
            // Logged In: Show Photo Icon linking to Profile
            const initial = user.username ? user.username.charAt(0).toUpperCase() : 'U';
            authSection.innerHTML = `
                <div class="auth-group">
                    <a href="profile.html" class="profile-avatar" title="View Profile">
                        ${initial}
                    </a>
                </div>
            `;
        } else {
            // Logged Out: Show Login/Signup
            authSection.innerHTML = `
                <div class="auth-group">
                    <a href="login.html" class="btn btn-secondary">Log In</a>
                    <a href="signup.html" class="btn btn-primary">Sign Up</a>
                </div>
            `;
        }
    }

    // Highlight active nav link based on current path
    function highlightActiveNav() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Initialize globally applicable scripts
    checkAuthState();
    highlightActiveNav();

    // Check if we are on index page to adjust some specific interactions
    const heroCta = document.getElementById('hero-cta');
    if (heroCta) {
        const user = localStorage.getItem('currentUser');
        if (user) {
            heroCta.textContent = 'Go to Problems';
            heroCta.setAttribute('href', 'problems.html');
        }
    }
});
