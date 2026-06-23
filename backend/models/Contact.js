const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  open: { type: String, default: '09:00' },
  close: { type: String, default: '18:00' },
  isClosed: { type: Boolean, default: false }
}, { _id: false });

const contactSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  phoneSecondary: String,
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zipCode: { type: String, default: '' },
    country: { type: String, default: 'USA' },
    fullAddress: { type: String, default: '' }
  },
  location: {
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    mapUrl: { type: String, default: '' },
    mapEmbedUrl: { type: String, default: '' }
  },
  businessHours: {
    days: { type: String, default: 'Monday - Friday' },
    hours: { type: String, default: '9:00 AM - 6:00 PM' },
    is24Hours: { type: Boolean, default: false },
    timezone: { type: String, default: 'UTC' },
    schedule: {
      monday: { type: daySchema, default: () => ({}) },
      tuesday: { type: daySchema, default: () => ({}) },
      wednesday: { type: daySchema, default: () => ({}) },
      thursday: { type: daySchema, default: () => ({}) },
      friday: { type: daySchema, default: () => ({}) },
      saturday: { type: daySchema, default: () => ({ open: '10:00', close: '16:00' }) },
      sunday: { type: daySchema, default: () => ({ isClosed: true }) }
    }
  },
  socialMedia: [{
    platform: { type: String, required: true },
    url: { type: String, required: true },
    icon: String,
    username: String,
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 }
  }],
  contactForm: {
    enabled: { type: Boolean, default: true },
    emailSubject: { type: String, default: 'New Contact Form Submission' },
    successMessage: { type: String, default: 'Thank you for your message. We will get back to you soon!' },
    errorMessage: { type: String, default: 'There was an error sending your message. Please try again.' },
    notificationEmails: [String],
    recaptchaEnabled: { type: Boolean, default: false },
    recaptchaSiteKey: String,
    recaptchaSecretKey: String
  },
  emergencyContact: {
    name: String,
    phone: String,
    email: String,
    relationship: String
  },
  isActive: { type: Boolean, default: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

contactSchema.pre('save', function(next) {
  const parts = [this.address.street, this.address.city, this.address.state, this.address.zipCode, this.address.country].filter(Boolean);
  this.address.fullAddress = parts.join(', ');
  next();
});

module.exports = mongoose.model('Contact', contactSchema);
