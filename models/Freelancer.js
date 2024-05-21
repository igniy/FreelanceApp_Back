const mongoose = require('mongoose');

const FreelancerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        required: false,
        default: 'Active'
    },
    skills: {
        type: [String],
        required: false
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
    social: {
        telegram: {
            type: String,
            default: '@ign1y'
        }
    }
});

module.exports = mongoose.model('Freelancer', FreelancerSchema);
