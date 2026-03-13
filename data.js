// Mock Data for the Application

const mockData = {
    // Current user state (simulated)
    // In a real app, this would be fetched via API
    currentUser: null, // Set to an object like { username: "johndoe", email: "john@example.com" } upon login

    problems: [
        { id: 1, title: "Two Sum", difficulty: "Easy", acceptance: "50.2%", status: "Solved" },
        { id: 2, title: "Add Two Numbers", difficulty: "Medium", acceptance: "41.0%", status: "Todo" },
        { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", acceptance: "34.1%", status: "Todo" },
        { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", acceptance: "37.5%", status: "Attempted" },
        { id: 5, title: "Longest Palindromic Substring", difficulty: "Medium", acceptance: "33.2%", status: "Todo" }
    ],

    topics: [
        { name: "Array", count: 1452 },
        { name: "String", count: 668 },
        { name: "Hash Table", count: 524 },
        { name: "Dynamic Programming", count: 489 },
        { name: "Math", count: 472 },
        { name: "Sorting", count: 350 }
    ],

    courses: [
        { id: 101, title: "Dynamic Programming Masterclass", description: "Master DP from scratch.", level: "Advanced" },
        { id: 102, title: "Data Structures & Algorithms", description: "The definitive guide to passing interviews.", level: "Intermediate" },
        { id: 103, title: "Graph Theory", description: "Conquer graph traversal and algorithms.", level: "Hard" }
    ],

    contests: {
        running: [
            { id: 401, title: "Weekly Contest 400", timeRemaining: "1h 24m" }
        ],
        upcoming: [
            { id: 402, title: "Biweekly Contest 135", timeUntil: "2 days" },
            { id: 403, title: "Weekly Contest 401", timeUntil: "5 days" }
        ],
        previous: [
            { id: 399, title: "Weekly Contest 399", date: "Oct 15, 2026" },
            { id: 134, title: "Biweekly Contest 134", date: "Oct 12, 2026" }
        ]
    }
};

// Export to global scope if needed (Vanilla JS standard)
window.appData = mockData;
