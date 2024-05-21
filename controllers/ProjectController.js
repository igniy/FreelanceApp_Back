const Project = require('../models/Project');
const Client = require('../models/Client');
const Freelancer = require('../models/Freelancer');

const ProjectController = {
    createProject: async (req, res) => {
        if (req.user.role !== 'client') {
            return res.status(403).json({ msg: 'Only clients can create projects' });
        }

        try {
            const { title, description, status } = req.body;

            const project = new Project({
                client: req.user.id,
                title,
                description,
                status
            });

            await project.save();
            res.status(201).json(project);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Server Error' });
        }
    },

    addProjectToFreelancer: async (req, res) => {
        if (req.user.role !== 'freelancer') {
            return res.status(403).json({ msg: 'Only freelancers can add projects' });
        }

        try {
            const project = await Project.findById(req.params.id);
            if (!project) {
                return res.status(404).json({ msg: 'Project not found' });
            }

            if (project.freelancer && project.freelancer.toString() === req.user.id) {
                return res.status(400).json({ msg: 'Freelancer already assigned to this project' });
            }

            project.freelancer = req.user.id;
            await project.save();

            res.json(project);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Server Error' });
        }
    },

    getAllProjects: async (req, res) => {
        try {
            const projects = await Project.find().populate('client', ['name', 'avatar']);
            res.json(projects);
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ message: 'Server Error' });
        }
    },

    getProjectById: async (req, res) => {
        try {
            const project = await Project.findById(req.params.id).populate('client', ['name', 'avatar']);
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }
            res.json(project);
        } catch (error) {
            console.error(error.message);
            if (error.kind === 'ObjectId') {
                return res.status(404).json({ message: 'Project not found' });
            }
            res.status(500).json({ message: 'Server Error' });
        }
    },

    updateProject: async (req, res) => {
        try {
            const { title, description, status } = req.body;

            let project = await Project.findById(req.params.id);
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            if (project.client.toString() !== req.user.id) {
                return res.status(401).json({ message: 'User not authorized' });
            }

            project.title = title || project.title;
            project.description = description || project.description;
            project.status = status || project.status;
            project.updated_at = Date.now();

            await project.save();
            res.json(project);
        } catch (error) {
            console.error(error.message);
            if (error.kind === 'ObjectId') {
                return res.status(404).json({ message: 'Project not found' });
            }
            res.status(500).json({ message: 'Server Error' });
        }
    },

    deleteProject: async (req, res) => {
        try {
            const project = await Project.findById(req.params.id);
            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            if (project.client.toString() !== req.user.id && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'User not authorized' });
            }

            await Project.findByIdAndDelete(req.params.id);
            res.json({ message: 'Project deleted' });
        } catch (error) {
            console.error(error.message);
            if (error.kind === 'ObjectId') {
                return res.status(404).json({ message: 'Project not found' });
            }
            res.status(500).json({ message: 'Server Error' });
        }
    },

    getProjectsByFreelancer: async (req, res) => {
        try {
            const projects = await Project.find({ freelancer: req.params.id });
            res.json(projects);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    },

    getProjectsByClient: async (req, res) => {
        try {
            const projects = await Project.find({ client: req.params.id });
            res.json(projects);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
};

module.exports = ProjectController;