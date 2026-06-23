const Contact = require('../models/Contact');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const logActivity = async (userId, action, details = {}) => {
  const user = await User.findById(userId);
  if (user) {
    user.activityLog.push({ action, details, timestamp: new Date() });
    if (user.activityLog.length > 200) user.activityLog = user.activityLog.slice(-200);
    await user.save({ validateBeforeSave: false });
  }
};

exports.getContact = catchAsync(async (req, res) => {
  let contact = await Contact.findOne().populate('updatedBy', 'fullName email');
  if (!contact) {
    contact = await Contact.create({
      email: 'admin@nexustech.dev',
      phone: '+1 (555) 123-4567',
      address: { street: '123 Tech Street', city: 'Silicon Valley', state: 'CA', zipCode: '94025', country: 'USA' },
      socialMedia: [
        { platform: 'github', url: 'https://github.com/nexustech', username: 'nexustech', isActive: true, displayOrder: 0 },
        { platform: 'linkedin', url: 'https://linkedin.com/in/nexustech', username: 'nexustech', isActive: true, displayOrder: 1 },
        { platform: 'twitter', url: 'https://twitter.com/nexustech', username: 'nexustech', isActive: true, displayOrder: 2 }
      ],
      businessHours: { days: 'Monday - Friday', hours: '9:00 AM - 6:00 PM', is24Hours: false }
    });
  }
  res.json({ status: 'success', data: { contact } });
});

exports.getPublicContact = catchAsync(async (req, res) => {
  let contact = await Contact.findOne();
  if (!contact) {
    contact = await Contact.create({ email: 'contact@nexustech.dev', phone: '+1 (555) 000-0000', address: { street: '123 Main St', city: 'Tech City', country: 'USA' }, socialMedia: [] });
  }
  res.json({
    status: 'success', data: {
      contact: {
        email: contact.email, phone: contact.phone, phoneSecondary: contact.phoneSecondary,
        address: contact.address, socialMedia: contact.socialMedia.filter(s => s.isActive),
        businessHours: contact.businessHours,
        contactForm: { enabled: contact.contactForm.enabled, successMessage: contact.contactForm.successMessage },
        location: contact.location, isActive: contact.isActive
      }
    }
  });
});

exports.updateContact = catchAsync(async (req, res) => {
  const contact = await Contact.findOne();
  if (!contact) throw new AppError('Contact not found', 404);
  const { email, phone, phoneSecondary, address, businessHours, contactForm, isActive } = req.body;
  if (email) contact.email = email;
  if (phone) contact.phone = phone;
  if (phoneSecondary !== undefined) contact.phoneSecondary = phoneSecondary;
  if (address) Object.assign(contact.address, address);
  if (businessHours) Object.assign(contact.businessHours, businessHours);
  if (contactForm) Object.assign(contact.contactForm, contactForm);
  if (isActive !== undefined) contact.isActive = isActive;
  contact.updatedBy = req.user.id;
  await contact.save();
  await logActivity(req.user.id, 'CONTACT_UPDATED', { updatedFields: Object.keys(req.body) });
  res.json({ status: 'success', message: 'Contact updated successfully', data: { contact } });
});

exports.replaceContact = catchAsync(async (req, res) => {
  const contact = await Contact.findOneAndReplace({}, { ...req.body, updatedBy: req.user.id }, { new: true, upsert: true, runValidators: true });
  res.json({ status: 'success', message: 'Contact replaced successfully', data: { contact } });
});

exports.getSocialMedia = catchAsync(async (req, res) => {
  const contact = await Contact.findOne();
  if (!contact) throw new AppError('Contact not found', 404);
  res.json({ status: 'success', data: { socialMedia: contact.socialMedia } });
});

exports.addSocialMedia = catchAsync(async (req, res) => {
  const contact = await Contact.findOne();
  if (!contact) throw new AppError('Contact not found', 404);
  const { platform, url, icon, username } = req.body;
  if (contact.socialMedia.some(s => s.platform === platform)) throw new AppError(`Platform "${platform}" already exists`, 400);
  contact.socialMedia.push({ platform, url, icon: icon || '', username: username || platform, isActive: true, displayOrder: contact.socialMedia.length });
  await contact.save();
  await logActivity(req.user.id, 'SOCIAL_ADDED', { platform });
  res.status(201).json({ status: 'success', message: 'Social media added', data: { socialMedia: contact.socialMedia } });
});

exports.updateSocialMedia = catchAsync(async (req, res) => {
  const contact = await Contact.findOne();
  if (!contact) throw new AppError('Contact not found', 404);
  const { platform } = req.params;
  const idx = contact.socialMedia.findIndex(s => s.platform === platform);
  if (idx === -1) throw new AppError(`Platform "${platform}" not found`, 404);
  Object.assign(contact.socialMedia[idx], req.body);
  await contact.save();
  await logActivity(req.user.id, 'SOCIAL_UPDATED', { platform });
  res.json({ status: 'success', message: 'Social media updated', data: { socialMedia: contact.socialMedia } });
});

exports.deleteSocialMedia = catchAsync(async (req, res) => {
  const contact = await Contact.findOne();
  if (!contact) throw new AppError('Contact not found', 404);
  const { platform } = req.params;
  const idx = contact.socialMedia.findIndex(s => s.platform === platform);
  if (idx === -1) throw new AppError(`Platform "${platform}" not found`, 404);
  contact.socialMedia.splice(idx, 1);
  await contact.save();
  await logActivity(req.user.id, 'SOCIAL_DELETED', { platform });
  res.json({ status: 'success', message: 'Social media deleted', data: { socialMedia: contact.socialMedia } });
});

exports.reorderSocialMedia = catchAsync(async (req, res) => {
  const contact = await Contact.findOne();
  if (!contact) throw new AppError('Contact not found', 404);
  const { order } = req.body;
  order.forEach((platform, i) => {
    const item = contact.socialMedia.find(s => s.platform === platform);
    if (item) item.displayOrder = i;
  });
  contact.socialMedia.sort((a, b) => a.displayOrder - b.displayOrder);
  await contact.save();
  await logActivity(req.user.id, 'SOCIAL_REORDERED', { order });
  res.json({ status: 'success', message: 'Social media reordered', data: { socialMedia: contact.socialMedia } });
});

exports.updateBusinessHours = catchAsync(async (req, res) => {
  const contact = await Contact.findOne();
  if (!contact) throw new AppError('Contact not found', 404);
  const { schedule, days, hours, is24Hours, timezone } = req.body;
  if (schedule) Object.assign(contact.businessHours.schedule, schedule);
  if (days) contact.businessHours.days = days;
  if (hours) contact.businessHours.hours = hours;
  if (is24Hours !== undefined) contact.businessHours.is24Hours = is24Hours;
  if (timezone) contact.businessHours.timezone = timezone;
  await contact.save();
  res.json({ status: 'success', message: 'Business hours updated', data: { businessHours: contact.businessHours } });
});

exports.updateFormSettings = catchAsync(async (req, res) => {
  const contact = await Contact.findOne();
  if (!contact) throw new AppError('Contact not found', 404);
  const { enabled, emailSubject, successMessage, errorMessage, notificationEmails, recaptcha } = req.body;
  if (enabled !== undefined) contact.contactForm.enabled = enabled;
  if (emailSubject) contact.contactForm.emailSubject = emailSubject;
  if (successMessage) contact.contactForm.successMessage = successMessage;
  if (errorMessage) contact.contactForm.errorMessage = errorMessage;
  if (notificationEmails) contact.contactForm.notificationEmails = notificationEmails;
  if (recaptcha) {
    contact.contactForm.recaptchaEnabled = recaptcha.enabled;
    contact.contactForm.recaptchaSiteKey = recaptcha.siteKey;
    contact.contactForm.recaptchaSecretKey = recaptcha.secretKey;
  }
  await contact.save();
  res.json({ status: 'success', message: 'Form settings updated', data: { contactForm: contact.contactForm } });
});

exports.updateLocation = catchAsync(async (req, res) => {
  const contact = await Contact.findOne();
  if (!contact) throw new AppError('Contact not found', 404);
  const { latitude, longitude, mapUrl, mapEmbedUrl } = req.body;
  if (latitude !== undefined) contact.location.latitude = latitude;
  if (longitude !== undefined) contact.location.longitude = longitude;
  if (mapUrl) contact.location.mapUrl = mapUrl;
  if (mapEmbedUrl) contact.location.mapEmbedUrl = mapEmbedUrl;
  await contact.save();
  res.json({ status: 'success', message: 'Location updated', data: { location: contact.location } });
});

exports.updateEmergencyContact = catchAsync(async (req, res) => {
  const contact = await Contact.findOne();
  if (!contact) throw new AppError('Contact not found', 404);
  Object.assign(contact.emergencyContact, req.body);
  await contact.save();
  res.json({ status: 'success', message: 'Emergency contact updated', data: { emergencyContact: contact.emergencyContact } });
});
