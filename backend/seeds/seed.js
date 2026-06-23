require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const App = require('../models/App');
const Hero = require('../models/Hero');
const Social = require('../models/Social');
const Contact = require('../models/Contact');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27018/nexustech');
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await App.deleteMany({});
    await Hero.deleteMany({});
    await Social.deleteMany({});
    await Contact.deleteMany({});

    await User.create({
      username: 'nexus_admin',
      email: 'alsaleha@alsaleha.xyz',
      password: 'Ams0569887002*',
      fullName: 'Ahmed Alsaleh',
      role: 'admin'
    });
    console.log('Admin user created');

    await Hero.create({
      title: 'Ahmed Alsaleh',
      subtitle: 'Building Digital Realities',
      tagline: 'Full-Stack Developer & Creative Technologist',
      ctaText: 'Explore My Work',
      ctaLink: '#apps',
      isActive: true,
      stats: [
        { label: 'Years Experience', value: '5+', icon: 'clock' },
        { label: 'Projects Completed', value: '50+', icon: 'code' },
        { label: 'Technologies', value: '30+', icon: 'layers' }
      ]
    });
    console.log('Hero section created');

    const apps = [
      {
        name: 'Quantum Task Manager',
        slug: 'quantum-task-manager',
        description: 'A next-generation task management application with AI-powered prioritization, real-time collaboration, and beautiful data visualizations. Built with modern web technologies for maximum productivity.',
        shortDescription: 'AI-powered task management with real-time collaboration',
        features: ['AI Task Prioritization', 'Real-time Collaboration', 'Smart Scheduling', 'Analytics Dashboard', 'Dark Mode', 'Offline Support'],
        stacks: [{ name: 'React', icon: 'react', color: '#61dafb' }, { name: 'Node.js', icon: 'nodejs', color: '#339933' }, { name: 'MongoDB', icon: 'mongodb', color: '#47a248' }, { name: 'Socket.io', icon: 'socketio', color: '#010101' }],
        demoUrl: 'https://demo.nexustech.dev/quantum',
        githubUrl: 'https://github.com/nexustech/quantum-tasks',
        category: 'Productivity',
        tags: ['react', 'node', 'realtime', 'ai'],
        status: 'active',
        featured: true,
        displayOrder: 1
      },
      {
        name: 'Nexus Chat Platform',
        slug: 'nexus-chat',
        description: 'Enterprise-grade real-time chat platform with end-to-end encryption, file sharing, video calls, and bot integration. Designed for teams that value security and performance.',
        shortDescription: 'Enterprise real-time chat with E2E encryption',
        features: ['End-to-End Encryption', 'Video Conferencing', 'File Sharing', 'Bot API', 'Message Search', 'Custom Emojis'],
        stacks: [{ name: 'Next.js', icon: 'nextjs', color: '#000000' }, { name: 'TypeScript', icon: 'typescript', color: '#3178c6' }, { name: 'PostgreSQL', icon: 'postgresql', color: '#4169e1' }, { name: 'Redis', icon: 'redis', color: '#dc382d' }],
        demoUrl: 'https://demo.nexustech.dev/chat',
        githubUrl: 'https://github.com/nexustech/nexus-chat',
        category: 'Communication',
        tags: ['nextjs', 'typescript', 'realtime', 'encryption'],
        status: 'active',
        featured: true,
        displayOrder: 2
      },
      {
        name: 'CryptoVault Wallet',
        slug: 'cryptovault-wallet',
        description: 'Secure cryptocurrency wallet with multi-chain support, DeFi integration, and an intuitive dashboard. Features hardware wallet support and advanced portfolio tracking.',
        shortDescription: 'Multi-chain crypto wallet with DeFi integration',
        features: ['Multi-chain Support', 'DeFi Dashboard', 'Hardware Wallet', 'Portfolio Analytics', 'Price Alerts', 'NFT Gallery'],
        stacks: [{ name: 'Vue.js', icon: 'vuejs', color: '#4fc08d' }, { name: 'Solidity', icon: 'solidity', color: '#363636' }, { name: 'Ethers.js', icon: 'ethers', color: '#3C3C3D' }, { name: 'Web3', icon: 'web3', color: '#F6851B' }],
        demoUrl: 'https://demo.nexustech.dev/crypto',
        githubUrl: 'https://github.com/nexustech/cryptovault',
        category: 'Finance',
        tags: ['vue', 'blockchain', 'defi', 'web3'],
        status: 'active',
        featured: true,
        displayOrder: 3
      },
      {
        name: 'PixelForge Studio',
        slug: 'pixelforge-studio',
        description: 'Browser-based design tool with vector editing, layer management, and real-time collaboration. Features AI-powered design suggestions and extensive plugin ecosystem.',
        shortDescription: 'Browser-based design tool with AI assistance',
        features: ['Vector Editor', 'AI Design Assistant', 'Real-time Collaboration', 'Plugin System', 'Asset Library', 'Version History'],
        stacks: [{ name: 'React', icon: 'react', color: '#61dafb' }, { name: 'Canvas API', icon: 'canvas', color: '#E34F26' }, { name: 'WebAssembly', icon: 'wasm', color: '#654FF0' }, { name: 'Firebase', icon: 'firebase', color: '#FFCA28' }],
        demoUrl: 'https://demo.nexustech.dev/pixelforge',
        githubUrl: 'https://github.com/nexustech/pixelforge',
        category: 'Design',
        tags: ['react', 'canvas', 'wasm', 'design'],
        status: 'active',
        featured: false,
        displayOrder: 4
      },
      {
        name: 'DataStream Analytics',
        slug: 'datastream-analytics',
        description: 'Real-time data analytics platform with customizable dashboards, drag-and-drop visualization builder, and automated reporting. Handles millions of data points with sub-second query times.',
        shortDescription: 'Real-time analytics with visual dashboards',
        features: ['Real-time Streaming', 'Drag & Drop Viz', 'Custom Dashboards', 'Automated Reports', 'Data Export', 'Team Workspaces'],
        stacks: [{ name: 'D3.js', icon: 'd3js', color: '#F9A03C' }, { name: 'Python', icon: 'python', color: '#3776AB' }, { name: 'ClickHouse', icon: 'clickhouse', color: '#FCC624' }, { name: 'Kafka', icon: 'kafka', color: '#231F20' }],
        demoUrl: 'https://demo.nexustech.dev/datastream',
        githubUrl: 'https://github.com/nexustech/datastream',
        category: 'Analytics',
        tags: ['d3js', 'python', 'bigdata', 'streaming'],
        status: 'active',
        featured: false,
        displayOrder: 5
      }
    ];

    await App.insertMany(apps);
    console.log('Apps created');

    const socials = [
      { platform: 'GitHub', url: 'https://github.com/nexustech', icon: 'github', color: '#ffffff', order: 1 },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/nexustech', icon: 'linkedin', color: '#0A66C2', order: 2 },
      { platform: 'Twitter', url: 'https://twitter.com/nexustech', icon: 'twitter', color: '#1DA1F2', order: 3 },
      { platform: 'Dribbble', url: 'https://dribbble.com/nexustech', icon: 'dribbble', color: '#EA4C89', order: 4 },
      { platform: 'YouTube', url: 'https://youtube.com/@nexustech', icon: 'youtube', color: '#FF0000', order: 5 }
    ];

    await Social.insertMany(socials);
    console.log('Social links created');

    await Contact.create({
      email: 'contact@nexustech.dev',
      phone: '+1 (415) 867-5309',
      phoneSecondary: '+1 (800) 555-0199',
      address: { street: '742 Innovation Drive', city: 'San Francisco', state: 'CA', zipCode: '94105', country: 'USA' },
      location: { latitude: 37.7749, longitude: -122.4194, mapUrl: 'https://maps.google.com/?q=San+Francisco', mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.2!2d-122.4194!3d37.7749' },
      businessHours: { days: 'Monday - Friday', hours: '9:00 AM - 6:00 PM', is24Hours: false, timezone: 'America/Los_Angeles', schedule: { monday: { open: '09:00', close: '18:00' }, tuesday: { open: '09:00', close: '18:00' }, wednesday: { open: '09:00', close: '18:00' }, thursday: { open: '09:00', close: '18:00' }, friday: { open: '09:00', close: '17:00' }, saturday: { open: '10:00', close: '14:00' }, sunday: { isClosed: true } } },
      socialMedia: [
        { platform: 'github', url: 'https://github.com/nexustech', username: 'nexustech', isActive: true, displayOrder: 0 },
        { platform: 'linkedin', url: 'https://linkedin.com/in/nexustech', username: 'nexustech', isActive: true, displayOrder: 1 },
        { platform: 'twitter', url: 'https://twitter.com/nexustech', username: 'nexustech', isActive: true, displayOrder: 2 }
      ],
      contactForm: { enabled: true, emailSubject: 'New Contact Message', successMessage: 'Thanks for reaching out! We will respond within 24 hours.', errorMessage: 'Something went wrong. Please try again.', notificationEmails: ['admin@nexustech.dev'] },
      emergencyContact: { name: 'Jane Doe', phone: '+1 (415) 555-0000', email: 'jane@nexustech.dev', relationship: 'COO' },
      isActive: true
    });
    console.log('Contact info created');

    console.log('Seed data created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedData();
