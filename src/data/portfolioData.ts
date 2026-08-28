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
      id: 'task-management-app',
      title: 'Task Management App',
      category: 'Productivity Tool',
      role: 'Lead Developer',
      description: 'Organize. Track. Achieve. Real-time collaborative workspace with intuitive board management and activity metrics.',
      longDescription: 'Engineered a real-time task architecture with high throughput, automated role permissions, drag-and-drop workflow updates, and dynamic activity timelines.',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Spring Boot', 'MongoDB'],
      image: '/assets/portfolio-1.png',
      liveUrl: 'https://primenova.studio',
      githubUrl: 'https://github.com',
      featured: true,
    },
    {
      id: 'e-commerce-store',
      title: 'E-Commerce Platform',
      category: 'Full Stack Web App',
      role: 'Full Stack Engineer',
      description: 'Bespoke digital store featuring lightning-fast catalog search, dynamic cart state management, and secure checkout workflows.',
      longDescription: 'Built with microservices architecture, localized currency conversion, sub-100ms API response rates, and robust user session management.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Spring Security', 'Tailwind CSS'],
      image: '/assets/portfolio-2.png',
      liveUrl: 'https://primenova.studio',
      githubUrl: 'https://github.com',
      featured: true,
    },
    {
      id: 'portfolio-website',
      title: 'Cinematic Developer Portfolio',
      category: 'Personal Portfolio',
      role: 'Creative Developer',
      description: 'High-performance motion site combining editorial typography, 3D interactive tilt cards, and atmospheric dark mode visual aesthetics.',
      longDescription: 'Created as an immersive experience showcasing projects, technical stack, and interactive engineering capabilities.',
      technologies: ['React', 'Framer Motion', 'Vite', 'TypeScript', 'Tailwind CSS'],
      image: '/assets/portfolio-3.png',
      liveUrl: 'https://primenova.studio',
      githubUrl: 'https://github.com',
      featured: true,
    },
    {
      id: 'nova-os-assistant',
      title: 'AI Multi-Agent Workspace',
      category: 'Applied AI Solution',
      role: 'Backend & AI Engineer',
      description: 'Enterprise workflow platform integrating LLMs and vector search for automated document parsing and team insights.',
      longDescription: 'Leverages custom prompt pipelines, Spring Boot backend microservices, and React dashboard visualizations for enterprise productivity.',
      technologies: ['Java', 'Spring Boot', 'Python', 'React', 'MongoDB'],
      image: '/assets/portfolio-4.png',
      liveUrl: 'https://primenova.studio',
      githubUrl: 'https://github.com',
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
