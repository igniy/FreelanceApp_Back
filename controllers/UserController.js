const User = require('../models/User');
const Freelancer = require('../models/Freelancer');
const Client = require('../models/Client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Получение информации о пользователе по ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user.role === 'freelancer') {
            const profile = await Freelancer.findOne({ user: req.params.id });
            res.json({ user, profile });
        } else if (user.role === 'client') {
            const profile = await Client.findOne({ user: req.params.id });
            res.json({ user, profile });
        } else {
            res.status(400).json({ msg: 'Profile not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Обновление информации о пользователе по ID
exports.updateUserById = async (req, res) => {
    const { username, email } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.username = username || user.username;
        user.email = email || user.email;

        await user.save();
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
};
