const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ProjectController = require('../controllers/ProjectController');

// @route    POST /api/projects
// @desc     Create a project
// @access   Private
router.post('/', auth, ProjectController.createProject);

// @route    PUT /api/projects/add/:id
// @desc     Add project to freelancer
// @access   Private
router.put('/add/:id', auth, ProjectController.addProjectToFreelancer);

// @route    GET /api/projects
// @desc     Get all projects
// @access   Private
router.get('/', auth, ProjectController.getAllProjects);

// @route    GET /api/projects/:id
// @desc     Get project by ID
// @access   Private
router.get('/:id', auth, ProjectController.getProjectById);

// @route    PUT /api/projects/:id
// @desc     Update a project
// @access   Private
router.put('/:id', auth, ProjectController.updateProject);

// @route    DELETE /api/projects/:id
// @desc     Delete a project
// @access   Private
router.delete('/:id', auth, ProjectController.deleteProject);

// @route    GET /api/projects/freelancer/:id
// @desc     Get all projects by freelancer
// @access   Private
router.get('/freelancer/:id', auth, ProjectController.getProjectsByFreelancer);

// @route    GET /api/projects/client/:id
// @desc     Get all projects by client
// @access   Private
router.get('/client/:id', auth, ProjectController.getProjectsByClient);

module.exports = router;
