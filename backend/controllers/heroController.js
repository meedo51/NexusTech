const Hero = require('../models/Hero');
const sharp = require('sharp');

exports.getActive = async (req, res) => {
  try {
    let hero = await Hero.findOne({ isActive: true });
    if (!hero) hero = await Hero.findOne();
    if (!hero) return res.status(404).json({ error: 'No hero section found' });
    res.json(hero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const heroes = await Hero.find().sort({ createdAt: -1 });
    res.json(heroes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) return res.status(404).json({ error: 'Hero not found' });
    res.json(hero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const hero = await Hero.create(req.validated || req.body);
    res.status(201).json(hero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const hero = await Hero.findByIdAndUpdate(
      req.params.id,
      req.validated || req.body,
      { new: true, runValidators: true }
    );
    if (!hero) return res.status(404).json({ error: 'Hero not found' });
    res.json(hero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const hero = await Hero.findByIdAndDelete(req.params.id);
    if (!hero) return res.status(404).json({ error: 'Hero not found' });
    res.json({ message: 'Hero deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
