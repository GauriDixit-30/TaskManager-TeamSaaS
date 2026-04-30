const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect, checkRole } = require('../middleware/auth');

// Get all tasks for a project
router.get('/', protect, async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to view tasks for this project' });
    }

    const tasks = await Task.find({ projectId }).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new task (Admin or Member)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, assignedTo, projectId, status, dueDate } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only admin can create tasks for ANY project, members can only create if they are in the project
    if (req.user.role !== 'admin' && !project.members.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to create tasks for this project' });
    }

    // Only admin can assign to others. Members can only assign to themselves (or leave unassigned)
    let finalAssignedTo = assignedTo;
    if (req.user.role === 'member' && assignedTo && assignedTo !== req.user._id.toString()) {
       return res.status(403).json({ message: 'Members can only assign tasks to themselves' });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo: finalAssignedTo,
      projectId,
      status,
      dueDate,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a task
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.projectId);

    // Can only update if admin or if member of the project
    if (req.user.role !== 'admin' && !project.members.includes(req.user._id)) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
    }
    
    // Member constraints: Cannot change assignedTo unless assigning to themselves
    if (req.user.role === 'member' && req.body.assignedTo && req.body.assignedTo !== req.user._id.toString() && req.body.assignedTo !== task.assignedTo?.toString()) {
        return res.status(403).json({ message: 'Members cannot assign tasks to others' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('assignedTo', 'name email');

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a task (Admin only)
router.delete('/:id', protect, checkRole('admin'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
