const express = require('express');
const router = express.Router();
const { getCart, updateCart } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getCart).put(protect, updateCart);

module.exports = router;
