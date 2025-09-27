const Project = require('../models/Project');
const exportService = require('../services/exportServices');

// Download PRD as Markdown
const downloadPRDMarkdown = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!project.prd?.content) {
      return res.status(400).json({ error: 'No PRD available for download' });
    }

    const markdown = exportService.generatePRDMarkdown(project);
    const filename = `${project.title.replace(/[^a-zA-Z0-9]/g, '_')}_PRD.md`;

    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(markdown);

  } catch (error) {
    console.error('Download PRD markdown error:', error);
    res.status(500).json({ error: 'Failed to download PRD' });
  }
};

// Download PRD as PDF
const downloadPRDPDF = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!project.prd?.content) {
      return res.status(400).json({ error: 'No PRD available for download' });
    }

    const markdown = exportService.generatePRDMarkdown(project);
    const pdf = exportService.generatePDF(markdown, `${project.title} - PRD`);
    const filename = `${project.title.replace(/[^a-zA-Z0-9]/g, '_')}_PRD.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdf.output());

  } catch (error) {
    console.error('Download PRD PDF error:', error);
    res.status(500).json({ error: 'Failed to download PRD PDF' });
  }
};

// Download Implementation Plan as Markdown
const downloadPlanMarkdown = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!project.implementationPlan?.content) {
      return res.status(400).json({ error: 'No implementation plan available for download' });
    }

    const markdown = exportService.generateImplementationPlanMarkdown(project);
    const filename = `${project.title.replace(/[^a-zA-Z0-9]/g, '_')}_Implementation_Plan.md`;

    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(markdown);

  } catch (error) {
    console.error('Download plan markdown error:', error);
    res.status(500).json({ error: 'Failed to download implementation plan' });
  }
};

// Download Implementation Plan as PDF
const downloadPlanPDF = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (!project.implementationPlan?.content) {
      return res.status(400).json({ error: 'No implementation plan available for download' });
    }

    const markdown = exportService.generateImplementationPlanMarkdown(project);
    const pdf = exportService.generatePDF(markdown, `${project.title} - Implementation Plan`);
    const filename = `${project.title.replace(/[^a-zA-Z0-9]/g, '_')}_Implementation_Plan.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdf.output());

  } catch (error) {
    console.error('Download plan PDF error:', error);
    res.status(500).json({ error: 'Failed to download implementation plan PDF' });
  }
};

// Download complete project as ZIP
const downloadProjectZIP = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await exportService.generateProjectZIP(project, res);

  } catch (error) {
    console.error('Download project ZIP error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to download project ZIP' });
    }
  }
};

module.exports = {
  downloadPRDMarkdown,
  downloadPRDPDF,
  downloadPlanMarkdown,
  downloadPlanPDF,
  downloadProjectZIP
};
