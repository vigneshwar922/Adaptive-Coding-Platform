// Initialize configuration for Monaco Editor
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.38.0/min/vs' } });

const MOCK_DB = {
    problems: [
        {
            id: 1,
            title: "Two Sum",
            topic: "Arrays",
            difficulty: "Easy",
            description: `
                <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>
                <p>You may assume that each input would have <strong><em>exactly</em> one solution</strong>, and you may not use the same element twice.</p>
                <div class="example-block">
                    <p class="example-title">Example 1:</p>
                    <div class="example-content">
                        <strong>Input:</strong> nums = [2,7,11,15], target = 9<br>
                        <strong>Output:</strong> [0,1]<br>
                        <strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].
                    </div>
                </div>
            `,
            starterCode: {
                javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Write your code here\n};`,
                python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write your code here\n        pass`
            }
        },
        {
            id: 2,
            title: "Valid Parentheses",
            topic: "Strings",
            difficulty: "Easy",
            description: `
                <p>Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.</p>
                <p>An input string is valid if:</p>
                <ul><li>Open brackets must be closed by the same type of brackets.</li><li>Open brackets must be closed in the correct order.</li></ul>
            `,
            starterCode: {
                javascript: `/**\n * @param {string} s\n * @return {boolean}\n */\nvar isValid = function(s) {\n    \n};`,
                python: `class Solution:\n    def isValid(self, s: str) -> bool:\n        pass`
            }
        },
        {
            id: 3,
            title: "Longest Substring Without Repeating Characters",
            topic: "Sliding Window",
            difficulty: "Medium",
            description: `<p>Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters.</p>`,
            starterCode: {
                javascript: `/**\n * @param {string} s\n * @return {number}\n */\nvar lengthOfLongestSubstring = function(s) {\n    \n};`,
                python: `class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass`
            }
        }
    ],
    topics: ["All", "Arrays", "Strings", "Sliding Window", "Dynamic Programming", "Trees"]
};

// Main Application Controller
class AppController {
    constructor() {
        this.appContent = document.getElementById('app-content');
        this.navProfileArea = document.getElementById('nav-profile-area');
        this.monacoInstance = null;
        this.currentProblemId = null;
        this.currentTopicFilter = "All";

        // Ensure Monaco theme is registered once
        this.isMonacoThemeRegistered = false;

        this.init();
    }

    init() {
        this.updateAuthNav();
        // Read hash route on load
        this.handleRouting();

        // Listen to hash changes for browser back/forward buttons
        window.addEventListener('hashchange', () => this.handleRouting());
    }

    // --- State Management ---

    get currentUser() {
        const user = localStorage.getItem('algoSolveUser');
        return user ? JSON.parse(user) : null;
    }

    set currentUser(user) {
        if (user) {
            localStorage.setItem('algoSolveUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('algoSolveUser');
        }
        this.updateAuthNav();
    }

    // --- Routing ---

    navigate(path, id = null) {
        let hash = `#${path}`;
        if (id) hash += `/${id}`;
        window.location.hash = hash;
    }

    handleRouting() {
        const hash = window.location.hash.substring(1) || 'home';
        const parts = hash.split('/');
        const route = parts[0];
        const id = parts[1] ? parseInt(parts[1]) : null;

        if (route === 'workspace') {
            if (!this.currentUser) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Authentication Required',
                    text: 'You must be logged in to solve problems.',
                    background: '#14151B',
                    color: '#E2E2E2',
                    confirmButtonColor: '#3B82F6'
                });
                this.navigate('auth');
                return;
            }
            if (id) {
                this.currentProblemId = id;
                this.renderWorkspace();
            } else {
                this.navigate('home');
            }
        } else if (route === 'auth') {
            if (this.currentUser) {
                this.navigate('home'); // already logged in
            } else {
                this.renderAuth();
            }
        } else {
            // Default to home
            this.renderHome();
        }
    }

    // --- View Rendering ---

    renderHome() {
        const template = document.getElementById('view-home').content.cloneNode(true);
        this.appContent.innerHTML = '';
        this.appContent.appendChild(template);

        this.renderTopicsGrid();
        this.renderProblemsTable();

        document.getElementById('difficulty-filter').addEventListener('change', (e) => {
            this.renderProblemsTable(e.target.value);
        });
    }

    renderTopicsGrid() {
        const grid = document.getElementById('topics-grid');
        grid.innerHTML = MOCK_DB.topics.map(topic => `
            <div class="topic-card ${this.currentTopicFilter === topic ? 'active' : ''}" 
                 onclick="app.setTopicFilter('${topic}')">
                <h3>${topic}</h3>
                <span class="topic-count">${topic === 'All' ? MOCK_DB.problems.length : MOCK_DB.problems.filter(p => p.topic === topic).length} Problems</span>
            </div>
        `).join('');
    }

    setTopicFilter(topic) {
        this.currentTopicFilter = topic;
        this.renderTopicsGrid(); // re-render to update active state
        this.renderProblemsTable(document.getElementById('difficulty-filter').value);
    }

    renderProblemsTable(difficultyFilter = 'all') {
        const tbody = document.getElementById('problems-tbody');
        let filtered = MOCK_DB.problems;

        if (this.currentTopicFilter !== 'All') {
            filtered = filtered.filter(p => p.topic === this.currentTopicFilter);
        }
        if (difficultyFilter !== 'all') {
            filtered = filtered.filter(p => p.difficulty === difficultyFilter);
        }

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding: 2rem; color: var(--text-muted)">No problems found for this criteria.</td></tr>';
            return;
        }

        tbody.innerHTML = filtered.map(p => {
            const diffClass = `diff-${p.difficulty.toLowerCase()}`;
            return `
                <tr onclick="app.navigate('workspace', ${p.id})" class="cursor-pointer hover-row">
                    <td><i class="fa-regular fa-circle text-muted"></i></td>
                    <td class="prob-title">${p.id}. ${p.title}</td>
                    <td><span class="tag">${p.topic}</span></td>
                    <td><span class="${diffClass}">${p.difficulty}</span></td>
                </tr>
            `;
        }).join('');
    }

    renderAuth() {
        const template = document.getElementById('view-auth').content.cloneNode(true);
        this.appContent.innerHTML = '';
        this.appContent.appendChild(template);
        setTimeout(() => this.switchAuthTab('login'), 0); // Initialize tab state
    }

    renderWorkspace() {
        const problem = MOCK_DB.problems.find(p => p.id === this.currentProblemId);
        if (!problem) {
            this.navigate('home');
            return;
        }

        const template = document.getElementById('view-workspace').content.cloneNode(true);
        this.appContent.innerHTML = '';
        this.appContent.appendChild(template);

        // Populate Problem Details
        const detailsContainer = document.getElementById('workspace-problem-details');
        detailsContainer.innerHTML = `
            <h1 class="problem-title">${problem.id}. ${problem.title}</h1>
            <div class="problem-meta">
                <span class="badge diff-${problem.difficulty.toLowerCase()}">${problem.difficulty}</span>
                <span class="meta-item"><i class="fa-solid fa-tag"></i> ${problem.topic}</span>
            </div>
            <div class="problem-description">
                ${problem.description}
            </div>
        `;

        // Initialize Monaco Editor
        this.initMonaco(problem);
    }

    initMonaco(problem) {
        require(['vs/editor/editor.main'], () => {
            if (!this.isMonacoThemeRegistered) {
                monaco.editor.defineTheme('algoTheme', {
                    base: 'vs-dark',
                    inherit: true,
                    rules: [{ background: '14151B' }],
                    colors: {
                        'editor.background': '#14151B',
                        'editor.lineHighlightBackground': '#1E1F28',
                        'editorLineNumber.foreground': '#4B4D63',
                        'editorLineNumber.activeForeground': '#E2E2E2',
                        'editorIndentGuide.background': '#262730',
                    }
                });
                this.isMonacoThemeRegistered = true;
            }

            const container = document.getElementById('monaco-container');
            if (!container) return; // safety check if user navigated away quickly

            // Clean up old instance if it exists
            if (this.monacoInstance) {
                this.monacoInstance.dispose();
            }

            const langSelect = document.getElementById('language');
            const currentLang = langSelect.value;

            this.monacoInstance = monaco.editor.create(container, {
                value: problem.starterCode[currentLang] || '// No starter code available',
                language: currentLang,
                theme: 'algoTheme',
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false },
                automaticLayout: true,
                padding: { top: 16, bottom: 16 }
            });
        });
    }

    changeLanguage(lang) {
        if (!this.monacoInstance) return;
        const problem = MOCK_DB.problems.find(p => p.id === this.currentProblemId);
        if (problem && problem.starterCode[lang]) {
            this.monacoInstance.setValue(problem.starterCode[lang]);
            monaco.editor.setModelLanguage(this.monacoInstance.getModel(), lang);
        }
    }

    // --- Authentication Logic ---

    updateAuthNav() {
        const user = this.currentUser;
        if (user) {
            this.navProfileArea.innerHTML = `
                <div class="user-profile">
                    <span class="text-muted">Welcome, <strong>${user.username}</strong></span>
                    <button class="btn btn-secondary btn-sm ml-2" onclick="app.logout()">Logout</button>
                    <div class="avatar ml-3">
                        <img src="https://ui-avatars.com/api/?name=${user.username}&background=3B82F6&color=fff" alt="Avatar">
                    </div>
                </div>
            `;
        } else {
            this.navProfileArea.innerHTML = `
                <button class="btn btn-secondary mr-2" onclick="app.navigate('auth'); setTimeout(()=>app.switchAuthTab('signup'), 50);">Register</button>
                <button class="btn btn-primary" onclick="app.navigate('auth'); setTimeout(()=>app.switchAuthTab('login'), 50);">Login</button>
            `;
        }
    }

    switchAuthTab(type) {
        const tabLogin = document.getElementById('tab-login');
        const tabSignup = document.getElementById('tab-signup');
        const formLogin = document.getElementById('form-login');
        const formSignup = document.getElementById('form-signup');

        if (!tabLogin || !tabSignup) return; // not on auth page

        if (type === 'login') {
            tabLogin.classList.add('active');
            tabSignup.classList.remove('active');
            formLogin.classList.add('active-form');
            formSignup.classList.remove('active-form');
        } else {
            tabSignup.classList.add('active');
            tabLogin.classList.remove('active');
            formSignup.classList.add('active-form');
            formLogin.classList.remove('active-form');
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const btn = e.target.querySelector('.btn-submit');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';
        btn.disabled = true;

        setTimeout(() => {
            // Mock authentication
            this.currentUser = { username: username, joined: new Date().toISOString() };
            Swal.fire({
                icon: 'success',
                title: 'Welcome back!',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                background: '#14151B', color: '#fff'
            });
            this.navigate('home');
        }, 1000);
    }

    handleSignup(e) {
        e.preventDefault();
        const username = document.getElementById('signup-username').value;
        const btn = e.target.querySelector('.btn-submit');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating...';
        btn.disabled = true;

        setTimeout(() => {
            // Mock registration & auto-login
            this.currentUser = { username: username, joined: new Date().toISOString() };
            Swal.fire({
                icon: 'success',
                title: 'Account created successfully!',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                background: '#14151B', color: '#fff'
            });
            this.navigate('home');
        }, 1000);
    }

    logout() {
        this.currentUser = null;
        Swal.fire({
            icon: 'info',
            title: 'Logged out',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            background: '#14151B', color: '#fff'
        });
        this.navigate('home');
    }

    // --- Mock Execution Logic ---

    runCode() {
        const consoleOut = document.getElementById('console-output');
        consoleOut.innerHTML = '<p class="text-muted"><i class="fa-solid fa-spinner fa-spin"></i> Running code against sample test cases...</p>';

        setTimeout(() => {
            consoleOut.innerHTML = `
                <div style="color: var(--success); font-family: var(--font-mono); font-weight: bold; margin-bottom: 8px;">Run Successful</div>
                <div class="tc-input" style="margin-bottom: 8px;">Output: [0, 1]</div>
                <div class="tc-input">Expected: [0, 1]</div>
            `;
        }, 1500);
    }

    submitCode() {
        const consoleOut = document.getElementById('console-output');
        consoleOut.innerHTML = '<p class="text-muted"><i class="fa-solid fa-spinner fa-spin"></i> Submitting evaluation payload to judge server...</p>';

        setTimeout(() => {
            consoleOut.innerHTML = `
                <div style="color: var(--success); font-size: 1.5rem; font-weight: bold; margin-bottom: 12px;">Accepted</div>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Runtime: <strong>48 ms</strong>, faster than 92.5% of JavaScript online submissions.</p>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Memory Usage: <strong>42.1 MB</strong>, less than 85.2% of JavaScript online submissions.</p>
            `;
        }, 2000);
    }
}

// Initialize application
const app = new AppController();
window.app = app; // Expose to global scope for HTML inline handlers
