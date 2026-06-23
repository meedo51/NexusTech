export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:7788/api',
  adminURL: process.env.REACT_APP_ADMIN_URL || 'http://localhost:7788/admin',
  websiteURL: process.env.REACT_APP_WEBSITE_URL || 'http://localhost:7788',
  port: 7788,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export const API_ENDPOINTS = {
  auth: `${API_CONFIG.baseURL}/auth`,
  apps: `${API_CONFIG.baseURL}/apps`,
  hero: `${API_CONFIG.baseURL}/hero`,
  social: `${API_CONFIG.baseURL}/social`,
  upload: `${API_CONFIG.baseURL}/upload`
};
