export interface Skill {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps & Tools';
  icon: string;
  level?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  role: string;
  description: string;
  longDescription: string;
  technologies: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export interface ExperienceItem {
  id: string;
  period: string;
  role: string;
  company: string;
  description: string;
  skills: string[];
}

export interface PortfolioData {
  name: string;
  title: string;
  brand: string;
  tagline: string;
  aboutHeader: string;
  bio: string[];
  stats: { label: string; value: string; num: number; suffix: string }[];
  traits: string[];
  skills: Skill[];
  projects: ProjectItem[];
  experiences: ExperienceItem[];
  contact: {
    email: string;
    phone: string;
    location: string;
    availability: string;
    socials: { name: string; url: string; icon: string }[];
  };
  cvPath: string;
}

export const portfolioData: PortfolioData = {
  name: 'FAIZ',
  title: 'SOFTWARE ENGINEER',
  brand: 'FAIZ // SE',
  tagline:
    'Building high-performance digital architectures where clean engineering meets cinematic experience. Specialized in scalable systems and interactive engineering.',
  aboutHeader: 'GET TO KNOW ME',
  bio: [
    'I am Faiz, a passionate Software Engineer who thrives at the intersection of modern frontend craft and robust backend architecture.',
    'My focus is on developing resilient, user-centric web applications and scalable enterprise solutions using Java, Spring Boot, React, and modern web tooling.',
    'I believe that great software isn’t just functional—it should be intuitive, visually striking, and engineered for long-term maintainability.',
  ],
  stats: [
    { label: 'Years Experience', value: '2+', num: 2, suffix: '+' },
    { label: 'Projects Completed', value: '20+', num: 20, suffix: '+' },
    { label: 'Happy Clients', value: '10+', num: 10, suffix: '+' },
    { label: 'Dedication Rate', value: '100%', num: 100, suffix: '%' },
  ],
  traits: [
    'Problem solver & architectural thinker',
    'Clean, maintainable & scalable code',
    'Fast learner with adaptable mindset',
    'Collaborative cross-functional team player',
  ],
  cvPath: '/assets/cv/Faiz_Resume.pdf',
  skills: [
    { name: 'Java', category: 'Backend', icon: 'java' },
    { name: 'Spring Boot', category: 'Backend', icon: 'springboot' },
    { name: 'React', category: 'Frontend', icon: 'react' },
    { name: 'TypeScript', category: 'Frontend', icon: 'typescript' },
    { name: 'JavaScript', category: 'Frontend', icon: 'javascript' },
    { name: 'HTML5', category: 'Frontend', icon: 'html' },
    { name: 'CSS3', category: 'Frontend', icon: 'css' },
    { name: 'Tailwind CSS', category: 'Frontend', icon: 'tailwind' },
    { name: 'Node.js', category: 'Backend', icon: 'nodejs' },
    { name: 'REST APIs', category: 'Backend', icon: 'api' },
    { name: 'MongoDB', category: 'Database', icon: 'mongodb' },
    { name: 'PostgreSQL', category: 'Database', icon: 'postgresql' },
    { name: 'MySQL', category: 'Database', icon: 'mysql' },
    { name: 'Git', category: 'DevOps & Tools', icon: 'git' },
    { name: 'GitHub', category: 'DevOps & Tools', icon: 'github' },
    { name: 'Docker', category: 'DevOps & Tools', icon: 'docker' },
  ],
  projects: [
    {
      id: 'healthcare-platform',
      title: 'HealthCare Platform',
      category: 'Healthcare Web App',
      role: 'Full Stack Developer',
      description: 'A comprehensive healthcare platform with doctor listings, appointment booking, and patient management for modern clinics.',
      longDescription: 'Built a full-featured healthcare web application with doctor search, specialty filtering, appointment scheduling, and patient portal. Designed for seamless UX across all devices with a clean, trustworthy interface.',
      technologies: ['React', 'JavaScript', 'CSS3', 'REST APIs', 'Node.js'],
      image: '/assets/project-healthcare.png',
      liveUrl: 'https://health-care-delta-sand.vercel.app/',
      featured: true,
    },
    {
      id: 'beauty-studio',
      title: 'Beauty Studio',
      category: 'Beauty & Wellness',
      role: 'Frontend Developer',
      description: 'An elegant beauty salon website featuring service showcases, booking forms, and a premium visual experience.',
      longDescription: 'Crafted a luxurious online presence for a beauty studio brand with showcase galleries, service listings, pricing tables, and an integrated appointment booking system.',
      technologies: ['React', 'CSS3', 'JavaScript', 'Framer Motion', 'Vercel'],
      image: '/assets/project-beauty.png',
      liveUrl: 'https://beauty-studio-tau.vercel.app/',
      featured: true,
    },
    {
      id: 'fitness-app',
      title: 'Fitness Zone',
      category: 'Fitness & Health',
      role: 'Frontend Developer',
      description: 'A high-energy fitness website with workout plans, trainer profiles, membership plans, and gym class schedules.',
      longDescription: 'Designed and developed a dynamic fitness platform featuring animated hero sections, workout plan displays, trainer profiles, membership tiers, and gym schedule management with a bold, energetic design language.',
      technologies: ['React', 'JavaScript', 'Tailwind CSS', 'CSS3', 'Vercel'],
      image: '/assets/project-fitness.png',
      liveUrl: 'https://fitness-zeta-ten-95.vercel.app/',
      featured: true,
    },
    {
      id: 'restaurant-zayka',
      title: 'Restaurant Zayka',
      category: 'Food & Restaurant',
      role: 'Full Stack Developer',
      description: 'A feature-rich restaurant website with menu showcases, online ordering, table reservations, and chef profiles.',
      longDescription: 'Built a complete restaurant digital platform with interactive menu categories, online food ordering, table reservation system, and chef showcase. Designed with warm, appetizing color palettes and smooth animations to enhance the dining experience.',
      technologies: ['React', 'JavaScript', 'CSS3', 'Node.js', 'REST APIs'],
      image: '/assets/project-restaurant.png',
      liveUrl: 'https://restaurent-zayka.vercel.app/',
      featured: true,
    },
    {
      id: 'institute-platform',
      title: 'Institute Portal',
      category: 'Education Platform',
      role: 'Full Stack Developer',
      description: 'A professional educational institute website with course listings, faculty profiles, admissions portal, and student resources.',
      longDescription: 'Developed a comprehensive educational institution platform featuring course catalog, faculty directory, admission workflows, student testimonials, and campus information. Built for credibility and easy navigation for prospective students.',
      technologies: ['React', 'JavaScript', 'Tailwind CSS', 'REST APIs', 'Vercel'],
      image: '/assets/project-institute.png',
      liveUrl: 'https://institute-dusky.vercel.app/',
      featured: true,
    },
    {
      id: 'crm-system',
      title: 'CRM System',
      category: 'SaaS / CRM',
      role: 'Full Stack Developer',
      description: 'A modern Customer Relationship Management system with lead tracking, client management, sales pipeline, and analytics dashboard.',
      longDescription: 'Built a full-featured CRM application with secure authentication, lead management pipeline, client profiles, deal tracking, activity logs, and a comprehensive analytics dashboard. Engineered with role-based access control and clean data architecture.',
      technologies: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'JWT Auth'],
      image: '/assets/project-crm.png',
      liveUrl: 'https://crm-alpha-nine-35.vercel.app/login',
      featured: true,
    },
  ],
  experiences: [
    {
      id: 'exp-1',
      period: '2023 - Present',
      role: 'Software Engineer',
      company: 'PrimeNova Studio / Tech Solutions',
      description:
        'Architecting enterprise web solutions, developing RESTful microservices in Spring Boot, and constructing modern frontend user interfaces in React.',
      skills: ['Java', 'Spring Boot', 'React', 'TypeScript', 'MongoDB'],
    },
    {
      id: 'exp-2',
      period: '2022 - 2023',
      role: 'Frontend Developer',
      company: 'Digital Creators Lab',
      description:
        'Crafted responsive, high-converting digital products, design systems, and web applications using React, Tailwind CSS, and Framer Motion.',
      skills: ['React', 'JavaScript', 'Tailwind CSS', 'Framer Motion', 'REST APIs'],
    },
    {
      id: 'exp-3',
      period: '2021 - 2022',
      role: 'Web Developer Intern',
      company: 'Code Innovations',
      description:
        'Developed full-stack web features, refactored backend database queries, and optimized Core Web Vitals performance across key client sites.',
      skills: ['HTML/CSS', 'JavaScript', 'Node.js', 'MySQL', 'Git'],
    },
  ],
  contact: {
    email: 'faiz@primenova.studio',
    phone: '+91 9310701475',
    location: 'Delhi, India',
    availability: 'Available for Select Engineering Projects',
    socials: [
      { name: 'GitHub', url: 'https://github.com', icon: 'github' },
      { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' },
      { name: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
      { name: 'Instagram', url: 'https://www.instagram.com/primenova.studio', icon: 'instagram' },
      { name: 'Email', url: 'mailto:faiz@primenova.studio', icon: 'email' },
    ],
  },
};
