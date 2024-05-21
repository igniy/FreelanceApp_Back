const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const OrderController = require('../controllers/OrderController');

// @route    GET /api/orders
// @desc     Get all free orders
// @access   Private
router.get('/', auth, OrderController.getAllFreeOrders);

// @route    POST /api/orders/:id/accept
// @desc     Accept an order by freelancer
// @access   Private
router.post('/:id/accept', auth, OrderController.acceptOrder);

module.exports = router;
