const express = require('express');
const router = express.Router();
const { getAllProblems, getProblemById } = require('../controllers/problemController');
const optionalAuth = require('../middleware/optionalAuth');

router.get('/', optionalAuth, getAllProblems);
router.get('/:id', getProblemById);

module.exports = router;