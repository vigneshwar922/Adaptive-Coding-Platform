const express = require('express');
const router = express.Router();
const { submitCode, getUserSubmissions, runCode } = require('../controllers/submissionController');
const authMiddleware = require('../middleware/auth');

router.post('/run', authMiddleware, runCode);
router.post('/', authMiddleware, submitCode);
router.get('/', authMiddleware, getUserSubmissions);

module.exports = router;