const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const FreelancerController = require('../controllers/FreelancerController');

router.get('/me', auth, FreelancerController.getProfile);
router.post('/', auth, FreelancerController.createOrUpdateProfile);
router.delete('/', auth, FreelancerController.deleteProfile);

module.exports = router;
