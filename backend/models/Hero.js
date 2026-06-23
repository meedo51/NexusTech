const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: String,
  tagline: String,
  ctaText: String,
  ctaLink: String,
  profileImage: { url: String, alt: String },
  backgroundImage: { url: String, alt: String },
  videoBackground: String,
  socialLinks: [{
    platform: String,
    url: String,
    icon: String
  }],
  stats: [{
    label: String,
    value: String,
    icon: String
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Hero', heroSchema);
