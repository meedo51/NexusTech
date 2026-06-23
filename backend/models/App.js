const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String, maxlength: 120 },
  features: [String],
  screenshots: [{
    url: String,
    alt: String,
    caption: String,
    order: Number
  }],
  icon: { url: String, alt: String },
  builtDate: Date,
  latestVersion: String,
  stacks: [{
    name: String,
    icon: String,
    color: String
  }],
  demoUrl: String,
  githubUrl: String,
  category: { type: String, index: true },
  tags: [String],
  status: { type: String, enum: ['active', 'inactive', 'draft', 'archived'], default: 'draft' },
  views: { type: Number, default: 0 },
  rating: { type: Number, min: 0, max: 5 },
  featured: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

appSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('App', appSchema);
