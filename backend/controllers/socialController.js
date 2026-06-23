const Social = require('../models/Social');

exports.getAll = async (req, res) => {
  try {
    const { isActive } = req.query;
    const query = {};
    if (isActive) query.isActive = isActive === 'true';
    const socials = await Social.find(query).sort({ order: 1 });
    res.json(socials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const social = await Social.findById(req.params.id);
    if (!social) return res.status(404).json({ error: 'Social link not found' });
    res.json(social);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const social = await Social.create(req.body);
    res.status(201).json(social);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const social = await Social.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!social) return res.status(404).json({ error: 'Social link not found' });
    res.json(social);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const social = await Social.findByIdAndDelete(req.params.id);
    if (!social) return res.status(404).json({ error: 'Social link not found' });
    res.json({ message: 'Social link deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.reorder = async (req, res) => {
  try {
    const { items } = req.body;
    for (const item of items) {
      await Social.findByIdAndUpdate(item._id, { order: item.order });
    }
    res.json({ message: 'Reordered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
