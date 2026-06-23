const App = require('../models/App');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

exports.getAll = async (req, res) => {
  try {
    const { status, category, featured, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';
    if (search) query.$text = { $search: search };
    
    const apps = await App.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await App.countDocuments(query);
    res.json({ apps, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBySlug = async (req, res) => {
  try {
    const app = await App.findOne({ slug: req.params.slug });
    if (!app) return res.status(404).json({ error: 'App not found' });
    app.views += 1;
    await app.save();
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const app = await App.findById(req.params.id);
    if (!app) return res.status(404).json({ error: 'App not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const app = await App.create(req.validated || req.body);
    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const app = await App.findByIdAndUpdate(
      req.params.id,
      req.validated || req.body,
      { new: true, runValidators: true }
    );
    if (!app) return res.status(404).json({ error: 'App not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const app = await App.findByIdAndDelete(req.params.id);
    if (!app) return res.status(404).json({ error: 'App not found' });
    res.json({ message: 'App deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateViews = async (req, res) => {
  try {
    const app = await App.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!app) return res.status(404).json({ error: 'App not found' });
    res.json({ views: app.views });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
