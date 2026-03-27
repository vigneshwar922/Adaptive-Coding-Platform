const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getCollections, createCollection, addItem, shareCollection } = require('../controllers/wishlistController');

router.get('/collections', auth, getCollections);
router.post('/collections', auth, createCollection);
router.post('/add', auth, addItem);
router.post('/share', auth, shareCollection);

module.exports = router;
