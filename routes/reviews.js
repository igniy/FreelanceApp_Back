const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ReviewController = require('../controllers/ReviewController');

// @route    POST /api/reviews
// @desc     Create a new review
// @access   Private
router.post('/', auth, ReviewController.createReview);

// @route    GET /api/reviews/:userId
// @desc     Get all reviews for a specific user
// @access   Private
router.get('/:userId', auth, ReviewController.getReviewsByUser);

module.exports = router;
