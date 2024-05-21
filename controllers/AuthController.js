const User = require('../models/User');
const Freelancer = require('../models/Freelancer'); // Импорт модели Freelancer
const Client = require('../models/Client'); // Импорт модели Client
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username,
            email,
            password,
            role
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        console.log("User created:", user);

        let profile;
        if (role === 'freelancer') {
            profile = new Freelancer({
                user: user._id,
                status: 'Active',
                skills: [] // Или инициализировать другими значениями
            });
        } else if (role === 'client') {
            profile = new Client({
                user: user._id,
                status: 'Active'
            });
        } else {
            return res.status(400).json({ msg: 'Invalid role specified' });
        }

        await profile.save();
        console.log(`${role} profile created for user:`, profile);

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5 days' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: payload.user });
            }
        );
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'Username or email already exists' });
        }
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5 days' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: payload.user });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        const profile = user.role === 'freelancer'
            ? await Freelancer.findOne({ user: req.user.id })
            : await Client.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(400).json({ msg: 'Profile not found for this user' });
        }

        res.json({ user, profile });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


exports.verifyToken = async (req, res) => {
    res.json({ valid: true });
};
