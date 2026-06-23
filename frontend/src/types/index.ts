export interface App {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  features: string[];
  screenshots: Screenshot[];
  icon?: ImageResource;
  builtDate?: string;
  latestVersion?: string;
  stacks: Stack[];
  demoUrl?: string;
  githubUrl?: string;
  category?: string;
  tags: string[];
  status: 'active' | 'inactive' | 'draft' | 'archived';
  views: number;
  rating?: number;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Screenshot {
  url: string;
  alt?: string;
  caption?: string;
  order?: number;
}

export interface ImageResource {
  url: string;
  alt?: string;
}

export interface Stack {
  name: string;
  icon?: string;
  color?: string;
}

export interface Hero {
  _id: string;
  title: string;
  subtitle?: string;
  tagline?: string;
  ctaText?: string;
  ctaLink?: string;
  profileImage?: ImageResource;
  backgroundImage?: ImageResource;
  videoBackground?: string;
  socialLinks: SocialLink[];
  stats: Stat[];
  isActive: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface Stat {
  label: string;
  value: string;
  icon?: string;
}

export interface Social {
  _id: string;
  platform: string;
  url: string;
  icon?: string;
  color?: string;
  order: number;
  isActive: boolean;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'super_admin';
  avatar?: string;
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  lastLogin?: string;
  preferences: {
    theme: 'dark' | 'light';
    notifications: boolean;
    language: string;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
  details?: Array<{ message: string }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
}

export interface AdminSession {
  _id: string;
  token: string;
  device: string;
  ip: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
}

export interface ActivityEntry {
  action: string;
  details: Record<string, unknown>;
  ip: string;
  userAgent: string;
  timestamp: string;
}
