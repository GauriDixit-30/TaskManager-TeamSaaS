const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, checkRole } = require('../middleware/auth');

// Create a new project (Admin only)
router.post('/', protect, checkRole('admin'), async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members: [req.user._id], // Admin is a member by default
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all projects for a user
router.get('/', protect, async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user._id })
      .populate('createdBy', 'name email')
      .populate('members', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single project
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');
      
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    if (!project.members.some(member => member._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to view this project' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a member to a project (Admin only)
router.post('/:id/add-member', protect, checkRole('admin'), async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    project.members.push(userId);
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
