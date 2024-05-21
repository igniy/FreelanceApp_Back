const Client = require('../models/Client');
const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const profile = await Client.findOne({ user: req.user.id }).populate('user', ['username', 'email']);
        if (!profile) {
            return res.status(400).json({ msg: 'Client profile not found' });
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.createOrUpdateProfile = async (req, res) => {
    const { status } = req.body;

    const profileFields = {
        user: req.user.id,
        status
    };

    try {
        let profile = await Client.findOne({ user: req.user.id });
        if (profile) {
            profile = await Client.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }

        profile = new Client(profileFields);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        await Client.findOneAndRemove({ user: req.user.id });
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
