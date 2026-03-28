const express = require('express');
const router = express.Router();
const { submitCode, getUserSubmissions, runCode } = require('../controllers/submissionController');
const authMiddleware = require('../middleware/auth');

router.post('/run', runCode); // public - no auth required to run code
router.post('/', authMiddleware, submitCode);
router.get('/', authMiddleware, getUserSubmissions);

module.exports = router;