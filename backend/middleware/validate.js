const { z } = require('zod');

const appSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(2000),
  shortDescription: z.string().max(120).optional(),
  features: z.array(z.string()).optional(),
  stacks: z.array(z.object({
    name: z.string(),
    icon: z.string().optional(),
    color: z.string().optional()
  })).optional(),
  demoUrl: z.string().url().optional().or(z.literal('')),
  githubUrl: z.string().url().optional().or(z.literal('')),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive', 'draft', 'archived']).optional(),
  featured: z.boolean().optional(),
  displayOrder: z.number().optional()
});

const heroSchema = z.object({
  title: z.string().min(1).max(200),
  subtitle: z.string().max(500).optional(),
  tagline: z.string().max(200).optional(),
  ctaText: z.string().max(50).optional(),
  ctaLink: z.string().optional(),
  isActive: z.boolean().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const validate = (schema) => (req, res, next) => {
  try {
    req.validated = schema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ error: 'Validation failed', details: err.errors });
  }
};

module.exports = { validate, appSchema, heroSchema, loginSchema };
