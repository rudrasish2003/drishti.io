const { validationResult } = require('express-validator');
const Project = require('../models/Project');
const aiService = require('../services/aiService');

// Create new project
const createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { title, idea } = req.body;

    const project = new Project({
      title,
      idea,
      owner: req.user._id
    });

    await project.save();

    res.status(201).json({
      message: 'Project created successfully',
      project
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

// Get all projects for user
const getUserProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const projects = await Project.find({ owner: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('title idea status createdAt updatedAt prd.generatedAt implementationPlan.generatedAt');

    const total = await Project.countDocuments({ owner: req.user._id });

    res.json({
      projects,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to get projects' });
  }
};

// Get single project
const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project });

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to get project' });
  }
};

// Update project
const updateProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { title, idea } = req.body;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { title, idea },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      message: 'Project updated successfully',
      project
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

// Generate PRD
const generatePRD = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Generate PRD using AI
    const prdContent = await aiService.generatePRD(project.idea);

    // Update project with PRD
    project.prd = {
      version: project.prd.version + 1,
      content: prdContent,
      generatedAt: new Date()
    };
    project.status = 'prd_generated';

    await project.save();

    res.json({
      message: 'PRD generated successfully',
      prd: project.prd
    });

  } catch (error) {
    console.error('Generate PRD error:', error);
    res.status(500).json({ 
      error: 'Failed to generate PRD',
      details: error.message 
    });
  }
};

// Generate Implementation Plan
const generateImplementationPlan = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!project.prd.content) {
      return res.status(400).json({ error: 'PRD must be generated first' });
    }

    // Generate Implementation Plan using AI
    const planContent = await aiService.generateImplementationPlan(project.prd.content);

    // Update project with Implementation Plan
    project.implementationPlan = {
      version: project.implementationPlan.version + 1,
      content: planContent,
      generatedAt: new Date()
    };
    project.status = 'plan_generated';

    await project.save();

    res.json({
      message: 'Implementation plan generated successfully',
      implementationPlan: project.implementationPlan
    });

  } catch (error) {
    console.error('Generate plan error:', error);
    res.status(500).json({ 
      error: 'Failed to generate implementation plan',
      details: error.message 
    });
  }
};

module.exports = {
  createProject,
  getUserProjects,
  getProject,
  updateProject,
  deleteProject,
  generatePRD,
  generateImplementationPlan
};
