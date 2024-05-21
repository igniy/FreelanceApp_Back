const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ClientController = require('../controllers/ClientController');

router.get('/me', auth, ClientController.getProfile);
router.post('/', auth, ClientController.createOrUpdateProfile);
router.delete('/', auth, ClientController.deleteProfile);

module.exports = router;
