<div align="center">

#  BiteCode
### Adaptive Coding Platform

**A full-stack, collaborative competitive programming platform with smart solution stacking, curated wishlists, and a premium IDE experience.**

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Judge0](https://img.shields.io/badge/Judge0-Code_Engine-orange?style=for-the-badge)](https://judge0.com/)
[![Deployed on Render](https://img.shields.io/badge/Deployed_on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)

---

*Developed by [Pokala Vigneshwar](https://www.linkedin.com/in/vigneshwar-pokala-14b24931b/) · [Akula Vaishnavi](https://www.linkedin.com/in/akula-vaishnavi-663873281/) · [Katteboina ShashiNandini](https://www.linkedin.com/in/shashinandini-katteboina-0802a62b0/)*

</div>

---

## 📋 Table of Contents

1. [What is BiteCode?](#-what-is-bitecode)
2. [What Makes BiteCode Different?](#-what-makes-bitecode-different)
3. [Features — Detailed Breakdown](#-features--detailed-breakdown)
   - [Authentication & Security](#1-authentication--security)
   - [Adaptive Dashboard & Analytics](#2-adaptive-dashboard--analytics)
   - [Problem Library](#3-problem-library)
   - [Monaco IDE & Code Execution](#4-monaco-ide--code-execution)
   - [Submission System](#5-submission-system)
   - [🌟 Wishlist & Collections (Unique)](#6--wishlist--collections-unique-feature)
   - [🚀 Solutions Explorer — Time Stacking (Unique)](#7--solutions-explorer--time-stacking-unique-feature)
   - [Courses & Workspace](#8-courses--workspace)
4. [Tech Stack](#-tech-stack)
5. [Project Architecture](#-project-architecture)
6. [API Reference](#-api-reference)
7. [Database Schema](#-database-schema)
8. [Environment Variables](#-environment-variables)
9. [Local Development Setup](#-local-development-setup)
10. [Deployment](#-deployment)

---

## 🎯 What is BiteCode?

BiteCode is a **full-stack adaptive coding platform** built for developers who want to  
practice Data Structures & Algorithms in a collaborative, performance-aware environment.

Unlike traditional competitive programming platforms, BiteCode emphasizes:
- **Collaborative Learning** through shareable problem collections
- **Performance Awareness** by grouping community solutions by execution time
- **Premium UX** with a VS Code-grade editor, dark mode, and rich analytics
- **Adaptive Intelligence** by recommending problems based on mastery gaps

---

## 💎 What Makes BiteCode Different?

| Feature | LeetCode / HackerRank | **BiteCode** |
|---|---|---|
| **Solutions View** | Listed chronologically | **Stacked by execution time (complexity)** |
| **Bookmarking** | Simple favorites list | **Named collections with sharing & collaboration** |
| **Dashboard** | Basic submit count | **Heatmap, streaks, topic mastery ring chart** |
| **IDE** | Custom proprietary editor | **Monaco Editor (same as VS Code)** |
| **Code Restore** | Not available | **One-click restore from any submission** |
| **Custom Input** | Limited | **Full custom stdin sandbox** |
| **Social Layer** | None / minimal | **Share collections, accept/reject invites** |

---

## 🔍 Features — Detailed Breakdown

### 1. Authentication & Security

BiteCode uses a production-grade auth pipeline:

- **Registration/Login**: Users register with an email and password. Passwords are hashed using **bcrypt** before being stored — raw passwords are never persisted.
- **JWT Tokens**: On login, a signed **JSON Web Token** is issued and stored client-side. Every protected API call includes this token in the `Authorization` header.
- **Auth Middleware**: A dedicated Express middleware validates the JWT on every protected route. If the token is missing or expired, the request is rejected with `401 Unauthorized`.
- **Rate Limiting**: The submission API is protected with `express-rate-limit` — **max 10 submissions per minute per IP** — to prevent abuse of the Judge0 code execution engine.

```
POST /api/auth/register  → Hash password → Save user → Return JWT
POST /api/auth/login     → Verify password → Return JWT
All /api/* routes        → Middleware validates JWT → Forward or 401
```

---

### 2. Adaptive Dashboard & Analytics

The Dashboard is the heart of the user experience.

#### Solved Ring Chart (SVG)
- An animated **SVG ring chart** shows Easy / Medium / Hard problems solved.
- Three concentric arcs are drawn proportionally using `stroke-dasharray` — each ring segment animates on page load via CSS transitions.
- Data is fetched live from the PostgreSQL `submissions` table filtered by `status = accepted`.

#### Activity Heatmap
- A **GitHub-style contribution heatmap** maps submission activity over the past year.
- Cells are colour-coded from `heat-0` (inactive) to `heat-4` (very active) using CSS classes.
- **Active days** and **max streak** are computed and displayed in the header.
- Supports year filter (Last Year, 2026, 2025, 2024).

#### Topic Progress Hub
- Shows mastery per topic (e.g., Arrays, DP, Graphs) as solved/total counts.
- A **"Check Progress" modal** lists all topics with deep-linked navigation to the filtered problem list for that topic.

#### Recent Submissions & Recommendations
- The last 5 accepted/attempted submissions are shown with timestamps.
- **"Recommended for You"** suggests problems in topics where the user has gaps.

#### Profile Editing
- Avatar auto-generated via **ui-avatars.com** API using the user's name.
- Custom photo upload via native `<input type="file">`.
- Inline **Edit Profile dialog** to update username and email.
- Rank display (community position).

---

### 3. Problem Library

The problems page lists all DSA challenges with a rich filtering system.

- **Filter by Topic**: Arrays, Strings, Linked Lists, Trees, Graphs, DP, etc.
- **Filter by Difficulty**: Easy, Medium, Hard — displayed as coloured badges.
- **Solved Status Indicator**: Each problem row shows whether you've previously solved it.
- **Wishlist Trigger**: A `⋮` three-dot menu on every problem row opens a popup to quickly add the problem to any of your collections.
- **Wishlist Mode**: When navigating from a Wishlist collection, the problems page automatically loads only problems from that collection.

---

### 4. Monaco IDE & Code Execution

The problem-solving workspace uses the **Monaco Editor v0.44** (the VS Code engine).

#### Editor Features
- **Multi-Language**: Python, Java, C++, JavaScript — each with syntax highlighting, bracket matching, and auto-indentation.
- **Language Switching**: Changing the language dropdown resets the editor to a clean language-specific boilerplate template.
- **Auto Layout**: The editor automatically resizes when the console panel is toggled.
- **Dark/Light Theme**: Respects the platform's dark mode toggle.

#### Custom Input Sandbox
- A dedicated **"Custom Input"** tab in the console lets you type arbitrary stdin.
- If custom input is present, `Run Code` will execute only against it (not test cases).
- Output, errors, and status are all displayed clearly in the Output tab.

#### Run Code (Test Cases)
- Iterates through **all example test cases** stored in the database.
- For each case: sends code + input to Judge0, receives stdout, compares against `expected_output`.
- Displays ✅ Pass / ❌ Fail for each case with Input, Expected, and Actual values.
- **TLE Detection**: If Judge0 returns `File too large` (Python infinite loop output), it is automatically reclassified as `Time Limit Exceeded`.

#### Error Reporting
- **Compilation errors** are caught from `compile_output` and displayed in a red pre-block.
- **Runtime errors** are captured from `stderr`.
- Execution stops on the first error (no false "Test 2 passed" on a broken submission).

---

### 5. Submission System

Full submissions are graded against all test cases on the server side.

- **Submit Flow**: Code is sent to the backend → backend calls Judge0 with all test cases → result is stored in the `submissions` table.
- **Statuses**: `accepted`, `wrong_answer`, `runtime_error`, `time_limit_exceeded`, `error`.
- **Execution Time**: Stored per submission. Also stored in the `solutions` table if accepted (for community display).
- **My Submissions Tab**: On the problem page, a chronological list of your submissions for that problem, showing status, language, runtime, and date.
- **Submission Modal**: Click any submission to view full code in a styled modal.
- **Restore to Editor**: One-click button that loads any past submission's code and language back into the Monaco editor — via `sessionStorage` for a clean page-transition handoff.

---

### 6. 🌟 Wishlist & Collections (Unique Feature)

This is BiteCode's most powerful collaborative feature — far beyond a simple "bookmark."

#### What is a Collection?
A **Collection** is a named, ordered list of problems. Think: *"FAANG Top 50"*, *"Graph Playlist"*, *"DP for Beginners"*.

#### How It Works (End-to-End)

**Creating a Collection**
```
User clicks "+ New Collection" → inputs name + Public/Private toggle
→ POST /api/wishlist/collections
→ INSERT INTO wishlist_collections (user_id, name, is_public) 
→ Collection appears in sidebar
```

**Adding a Problem to a Collection**
```
User clicks ⋮ on any problem row → popup shows their collections
→ Selects a collection
→ POST /api/wishlist/add { collection_id, problem_id }
→ INSERT INTO wishlist_items ON CONFLICT DO NOTHING  (no duplicates!)
```

**Sharing a Collection**
```
User clicks "Share" on their collection → enters a username
→ POST /api/wishlist/share { collection_id, username }
→ Backend looks up user by name → Inserts into wishlist_shares with status='pending'
→ Recipient sees a notification badge
```

**Receiving & Accepting a Share**
```
Recipient opens Wishlist → sees "Pending Invitations"
→ Clicks Accept → POST /api/wishlist/notifications/:id/respond { action: 'accept' }
→ UPDATE wishlist_shares SET status='accepted'
→ Collection now appears in recipient's sidebar (read access)
```

**Access Control Logic (PostgreSQL)**
```sql
WHERE c.user_id = $1                              -- own collections
   OR (s.shared_with_user_id = $1 
       AND s.status = 'accepted')                 -- accepted shares
   OR c.is_public = true                          -- public collections
```

**Unfollowing a Shared Collection**
```
DELETE FROM wishlist_shares WHERE collection_id=$1 
AND shared_with_user_id=$2 AND status='accepted'
```

#### Significance
- Enables **mentors to curate roadmaps** for students.
- Enables **friends to prep together** for the same interviews.
- Adds a **social knowledge-sharing layer** absent from most DSA platforms.

---

### 7. 🚀 Solutions Explorer — Time Stacking (Unique Feature)

This is BiteCode's most technically distinctive feature for learning algorithmic efficiency.

#### The Problem with Traditional Platforms
On LeetCode/HackerRank, when you view "Solutions," you see a flat list sorted by votes or date. You have **no immediate way to understand the performance distribution** of submitted solutions.

#### BiteCode's Approach: Time Stacks

After solving a problem, navigate to the **"Solutions"** tab on the left panel.

**Step 1: Group by Execution Time**
```javascript
// All accepted solutions from the community are fetched
// Then grouped by their execution_time value:
groupedSolutions = {};
allProblemSolutions.forEach(s => {
  const timeLabel = (s.execution_time || '0.00') + 's';
  if (!groupedSolutions[timeLabel]) groupedSolutions[timeLabel] = [];
  groupedSolutions[timeLabel].push(s);
});
```

**Step 2: Render Time Stacks (Sorted Ascending)**
```javascript
const sortedTimes = Object.keys(groupedSolutions)
  .sort((a, b) => parseFloat(a) - parseFloat(b));
// Renders clickable "stack" buttons: [0.01s ×3] [0.05s ×7] [0.42s ×2]
```

**Step 3: Stack Drill-Down**
- Click a time stack (e.g., `0.01s`) → the right pane reveals **all users** who solved it at that speed.
- Each solution card shows the **username** and **language** used.
- Click a card to open the full code in a modal.

#### Visual Layout
```
┌─────────────────────────────────────────────────┐
│  Solutions                                       │
├──────────────┬──────────────────────────────────┤
│ Time Stacks  │  Solutions Deck                   │
│              │                                   │
│ [0.01s ×3]  │  Solutions: 0.01s                 │
│ [0.05s ×7]  │  ┌──────────────────────────────┐ │
│ [0.42s ×2]  │  │ alice_dev        Python       │ │
│              │  │ bobcoder99       C++           │ │
│              │  │ xyz_coder        Java          │ │
│              │  └──────────────────────────────┘ │
└──────────────┴──────────────────────────────────┘
```

#### Significance
- Learners can **target specific performance tiers** (e.g., "I want to see how the O(N) solutions look").
- Creates a natural learning progression: solve it → view brute force → study optimized → re-submit.
- **No other major platform** visualizes community solution performance this way.

---

### 8. Courses & Workspace

- **Courses Page**: A curated library of DSA learning materials organized by topic.
- **Workspace**: An embedded code editor (connected to Judge0) that can run code without being tied to a specific problem. Great for experimenting with data structures standalone.
- Both support the same multi-language run functionality as the problem IDE.

---

## 🛠 Tech Stack

### Frontend
| Technology | Usage |
|---|---|
| **HTML5** | Semantic page structure, SEO meta tags |
| **CSS3 (Vanilla)** | Custom design system, dark mode, animations |
| **Vanilla JavaScript** | DOM manipulation, API calls (Fetch API), state management |
| **Monaco Editor v0.44** | VS Code-grade IDE via CDN |
| **SVG** | Animated ring chart on dashboard |

### Backend
| Technology | Usage |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js v5** | REST API framework |
| **JWT (jsonwebtoken)** | Stateless authentication |
| **bcrypt / bcryptjs** | Password hashing |
| **express-rate-limit** | API abuse prevention |
| **axios** | HTTP client for Judge0 communication |
| **dotenv** | Environment variable management |
| **uuid** | Unique ID generation |
| **nodemon** | Dev hot-reload |

### Database
| Technology | Usage |
|---|---|
| **PostgreSQL** | Primary relational database |
| **node-postgres (pg)** | PostgreSQL driver for Node.js |
| **SQL Joins & Subqueries** | Complex wishlist access control |
| **ON CONFLICT DO NOTHING** | Idempotent wishlist inserts |

### Infrastructure
| Service | Usage |
|---|---|
| **Render** | Backend hosting (Node.js service) |
| **Render PostgreSQL** | Managed database |
| **Judge0** | Sandboxed multi-language code execution |

---

## 🏗 Project Architecture

```
adaptive-coding-platform/
│
├── backend/
│   ├── config/
│   │   └── db.js                  # PostgreSQL connection pool
│   ├── controllers/
│   │   ├── authController.js      # Register, Login logic
│   │   ├── problemController.js   # CRUD for problems
│   │   ├── submissionController.js # Submit, Run, Solutions, Sync
│   │   └── wishlistController.js  # Collections, Shares, Items
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification
│   ├── models/                    # DB helper functions
│   ├── routes/
│   │   ├── auth.js                # /api/auth/*
│   │   ├── problems.js            # /api/problems/*
│   │   ├── submissions.js         # /api/submissions/*
│   │   ├── progress.js            # /api/progress/*
│   │   ├── wishlist.js            # /api/wishlist/*
│   │   └── codeRoutes.js          # /api/code/* (Judge0 proxy)
│   ├── scripts/
│   │   └── migrateSolutions.js    # One-time DB seeding script
│   ├── services/                  # Judge0 integration service
│   ├── server.js                  # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── css/
│   │   └── style.css              # Full design system
│   ├── js/
│   │   ├── api.js                 # Shared API client + navbar renderer
│   │   ├── dashboard.js           # Dashboard logic (heatmap, rings)
│   │   ├── problems.js            # Problem list + wishlist popup
│   │   ├── problem.js             # IDE, run, submit, solutions stacking
│   │   └── wishlist.js            # Wishlist page management
│   ├── index.html                 # Landing / Login page
│   ├── dashboard.html             # User profile & analytics
│   ├── problems.html              # Problem library
│   ├── problem.html               # Individual problem + IDE
│   ├── wishlist.html              # Collections management
│   ├── courses.html               # Learning courses
│   └── workspace.html             # Standalone code workspace
│
└── judge0/                        # Judge0 configuration
```

---

## 📡 API Reference

### Auth Routes — `/api/auth`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/register` | Register a new user | ❌ |
| `POST` | `/login` | Login and receive JWT | ❌ |

### Problem Routes — `/api/problems`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/` | Get all problems | ✅ |
| `GET` | `/:id` | Get problem by ID (with examples) | ✅ |

### Submission Routes — `/api/submissions` *(Rate Limited: 10/min)*
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/submit` | Submit code for grading | ✅ |
| `POST` | `/run` | Run code against custom input | ✅ |
| `GET` | `/my` | Get user's submission history | ✅ |
| `GET` | `/solutions/:problemId` | Get all accepted solutions for a problem | ✅ |
| `GET` | `/sync-solutions` | Admin: sync solutions table | ❌ |

### Wishlist Routes — `/api/wishlist`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/collections` | Get all collections accessible to user | ✅ |
| `POST` | `/collections` | Create a new collection | ✅ |
| `DELETE` | `/collections/:id` | Delete own collection | ✅ |
| `GET` | `/collections/:id/items` | Get problems in a collection | ✅ |
| `POST` | `/add` | Add a problem to a collection | ✅ |
| `POST` | `/remove` | Remove a problem from a collection | ✅ |
| `POST` | `/share` | Send a share invitation by username | ✅ |
| `GET` | `/notifications` | Get pending share invitations | ✅ |
| `POST` | `/notifications/:id/respond` | Accept or reject a share | ✅ |
| `DELETE` | `/unfollow/:id` | Unfollow a shared collection | ✅ |

### Progress Routes — `/api/progress`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/` | Get user's topic-wise progress | ✅ |

---

## 🗄 Database Schema

### Core Tables

```sql
-- Users
users (id UUID PK, name, email, password_hash, created_at)

-- Problems
problems (id UUID PK, title, description, difficulty, topic, 
          input_labels, examples[] JSON)

-- Submissions (all attempts)
submissions (id UUID PK, user_id FK, problem_id FK, language, 
             code, status, execution_time, stderr, submitted_at)

-- Solutions (best accepted per user per problem)
solutions (id UUID PK, user_id FK, problem_id FK, user_name, 
           language, code, execution_time, submitted_at)
```

### Wishlist Tables

```sql
-- Collections (named playlists)
wishlist_collections (id, user_id FK, name, is_public BOOL)

-- Items (problem membership in a collection)
wishlist_items (id, collection_id FK, problem_id FK, added_at,
                UNIQUE(collection_id, problem_id))

-- Shares (invitation system)
wishlist_shares (id, collection_id FK, shared_with_user_id FK, 
                 status ENUM('pending','accepted'))
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Judge0
JUDGE0_API_URL=https://your-judge0-instance.com
JUDGE0_API_KEY=your_judge0_rapidapi_key

# Server
PORT=5000
```

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js ≥ 18.x
- PostgreSQL ≥ 14
- A Judge0 instance (self-hosted or RapidAPI)

### Steps

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd adaptive-coding-platform

# 2. Install backend dependencies
cd backend
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your credentials

# 4. Start the backend server
npm run dev
# Server starts on http://localhost:5000

# 5. Open the frontend
# Open frontend/index.html directly in a browser
# OR serve it with a static server:
npx serve ../frontend
```

> **Note:** The frontend uses relative API URLs configured in `frontend/js/api.js`. Update `API_URL` to point to your local backend (`http://localhost:5000/api`).

---

## 🚀 Deployment

### Backend (Render)
1. Connect your GitHub repository to Render.
2. Create a new **Web Service** pointing to the `backend/` directory.
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `node server.js`
5. Add all environment variables from `.env` to the Render dashboard.
6. Create a **PostgreSQL** database on Render and connect its `DATABASE_URL`.

### Frontend
- The frontend is **pure static HTML/CSS/JS** — deploy to any static hosting:
  - **Render Static Site**, **Netlify**, **Vercel**, **GitHub Pages**
- Update `API_URL` in `frontend/js/api.js` to your live Render backend URL before deploying.

### Judge0
- Use the **RapidAPI Judge0 CE** endpoint, or self-host Judge0 via Docker.
- Set `JUDGE0_API_URL` and `JUDGE0_API_KEY` accordingly.

---

## 👥 Team

| Name | LinkedIn |
|---|---|
| **Pokala Vigneshwar** | [linkedin.com/in/vigneshwar-pokala](https://www.linkedin.com/in/vigneshwar-pokala-14b24931b/) |
| **Akula Vaishnavi** | [linkedin.com/in/akula-vaishnavi](https://www.linkedin.com/in/akula-vaishnavi-663873281/) |
| **Katteboina ShashiNandini** | [linkedin.com/in/shashinandini-katteboina](https://www.linkedin.com/in/shashinandini-katteboina-0802a62b0/) |

---

<div align="center">

**⭐ If you found this project useful, consider giving it a star! ⭐**

*Built with ❤️ by the BiteCode Team*

</div>
