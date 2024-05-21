const Freelancer = require('../models/Freelancer');
const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const profile = await Freelancer.findOne({ user: req.user.id }).populate('user', ['username', 'email']);
        if (!profile) {
            return res.status(400).json({ msg: 'Freelancer profile not found' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.createOrUpdateProfile = async (req, res) => {
    const { status, skills, social } = req.body;

    const profileFields = {
        user: req.user.id,
        status,
        skills: skills ? skills.split(',').map(skill => skill.trim()) : [],
        social
    };

    try {
        let profile = await Freelancer.findOne({ user: req.user.id });
        if (profile) {
            profile = await Freelancer.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }

        profile = new Freelancer(profileFields);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        await Freelancer.findOneAndRemove({ user: req.user.id });
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
