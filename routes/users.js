const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const UserController = require('../controllers/UserController');

// @route    GET /api/users/:id
// @desc     Get user by ID
// @access   Private
router.get('/:id', auth, UserController.getUserById);

// @route    PUT /api/users/:id
// @desc     Update user by ID
// @access   Private
router.put(
    '/:id',
    [
        auth,
        [
            check('username', 'Username is required').not().isEmpty(),
            check('email', 'Please include a valid email').isEmail()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        UserController.updateUserById(req, res);
    }
);

module.exports = router;
