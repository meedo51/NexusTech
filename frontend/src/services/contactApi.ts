import api from './api';

export const contactApi = {
  get: () => api.get('/contact'),
  getPublic: () => api.get('/contact/public'),
  update: (data: any) => api.patch('/contact', data),
  replace: (data: any) => api.put('/contact', data),
  getSocialMedia: () => api.get('/contact/social'),
  addSocialMedia: (data: any) => api.post('/contact/social', data),
  updateSocialMedia: (platform: string, data: any) => api.patch(`/contact/social/${platform}`, data),
  deleteSocialMedia: (platform: string) => api.delete(`/contact/social/${platform}`),
  reorderSocialMedia: (order: string[]) => api.patch('/contact/social/reorder', { order }),
  updateBusinessHours: (data: any) => api.patch('/contact/hours', data),
  updateFormSettings: (data: any) => api.patch('/contact/form', data),
  updateLocation: (data: any) => api.patch('/contact/location', data),
  updateEmergencyContact: (data: any) => api.patch('/contact/emergency', data),
};
