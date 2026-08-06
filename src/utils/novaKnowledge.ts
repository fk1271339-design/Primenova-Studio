// ═══════════════════════════════════════════════════════════════
// novaKnowledge.ts — PrimeNova Studio Knowledge Base for Nova AI
// ═══════════════════════════════════════════════════════════════

export interface ServiceInfo {
  name: string;
  description: string;
  features: string[];
  technologies: string[];
  timeline: string;
  startingPrice: string;
}

export interface ProjectRecommendation {
  business: string;
  keywords: string[];
  features: string[];
  technologies: string[];
  designStyle: string;
  estimatedTimeline: string;
  suggestedPages: string[];
  integrations: string[];
}

export interface PricingTier {
  name: string;
  price: string;
  features: string[];
  bestFor: string;
}

// ─── SERVICES ────────────────────────────────────────────────

export const SERVICES: ServiceInfo[] = [
  {
    name: 'Web Development',
    description: 'We build fast, modern, and scalable websites using cutting-edge technologies. From simple landing pages to complex SaaS platforms, we deliver pixel-perfect solutions that perform flawlessly.',
    features: ['Responsive Design', 'SEO Optimized', 'CMS Integration', 'API Development', 'Performance Optimization', 'Progressive Web Apps'],
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
    timeline: '4–8 weeks',
    startingPrice: '₹25,000',
  },
  {
    name: 'Mobile App Development',
    description: 'Native and cross-platform mobile apps that deliver seamless experiences. We build for iOS and Android with a focus on performance, beautiful UI, and user engagement.',
    features: ['Cross-Platform', 'Push Notifications', 'Offline Mode', 'Biometric Auth', 'In-App Payments', 'Real-time Updates'],
    technologies: ['React Native', 'Flutter', 'Firebase', 'Expo', 'Swift', 'Kotlin'],
    timeline: '6–12 weeks',
    startingPrice: '₹50,000',
  },
  {
    name: 'AI Integration',
    description: 'We analyze your workflows and user touchpoints to build custom AI models, automate processes, and deploy intelligent agents. Real business utility, not speculative hype.',
    features: ['Custom AI Models', 'Chatbots & Assistants', 'Workflow Automation', 'Data Analytics', 'NLP Solutions', 'Computer Vision'],
    technologies: ['OpenAI', 'Google Gemini', 'TensorFlow', 'LangChain', 'Python', 'Hugging Face'],
    timeline: '4–10 weeks',
    startingPrice: '₹40,000',
  },
  {
    name: 'UI/UX Design',
    description: 'We create stunning, intuitive interfaces that users love. Our design process combines user research, wireframing, prototyping, and pixel-perfect visual design.',
    features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Usability Testing', 'Interaction Design'],
    technologies: ['Figma', 'Framer', 'Adobe XD', 'Principle', 'ProtoPie'],
    timeline: '2–4 weeks',
    startingPrice: '₹15,000',
  },
  {
    name: 'Branding & Identity',
    description: 'Complete brand identity systems including logo design, typography, color palettes, brand guidelines, and visual language that makes your business unforgettable.',
    features: ['Logo Design', 'Brand Guidelines', 'Typography System', 'Color Palette', 'Brand Voice', 'Stationery Design'],
    technologies: ['Illustrator', 'Photoshop', 'Figma', 'After Effects'],
    timeline: '2–3 weeks',
    startingPrice: '₹10,000',
  },
  {
    name: 'Graphic Design',
    description: 'Eye-catching graphics for social media, marketing materials, presentations, and print. We make your brand visually consistent across all touchpoints.',
    features: ['Social Media Graphics', 'Marketing Materials', 'Presentations', 'Print Design', 'Infographics', 'Packaging'],
    technologies: ['Photoshop', 'Illustrator', 'Canva Pro', 'InDesign'],
    timeline: '1–2 weeks',
    startingPrice: '₹5,000',
  },
  {
    name: 'E-commerce Development',
    description: 'Full-featured online stores with secure payments, inventory management, and conversion-optimized checkout flows. We build stores that sell.',
    features: ['Product Catalog', 'Payment Gateway', 'Inventory Management', 'Order Tracking', 'Coupon System', 'Analytics Dashboard'],
    technologies: ['Shopify', 'WooCommerce', 'Stripe', 'Razorpay', 'Next.js', 'MongoDB'],
    timeline: '6–10 weeks',
    startingPrice: '₹40,000',
  },
  {
    name: 'SaaS Platform Development',
    description: 'End-to-end SaaS product development — from architecture to deployment. Multi-tenant, scalable, and built to grow with your business.',
    features: ['Multi-tenancy', 'Subscription Billing', 'User Management', 'Analytics', 'API Layer', 'Admin Dashboard'],
    technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe', 'AWS'],
    timeline: '10–16 weeks',
    startingPrice: '₹1,00,000',
  },
  {
    name: 'Dashboard Development',
    description: 'Beautiful, data-driven dashboards for business intelligence, analytics, and internal tools. Real-time data visualization that drives decisions.',
    features: ['Real-time Data', 'Charts & Graphs', 'Filtering & Search', 'Export Reports', 'Role-based Access', 'Notifications'],
    technologies: ['React', 'D3.js', 'Chart.js', 'Recharts', 'PostgreSQL', 'GraphQL'],
    timeline: '4–8 weeks',
    startingPrice: '₹30,000',
  },
  {
    name: 'SEO Services',
    description: 'Data-driven SEO strategies that improve your search rankings, drive organic traffic, and increase conversions. Technical SEO, content strategy, and link building.',
    features: ['Technical SEO Audit', 'Keyword Research', 'On-Page Optimization', 'Content Strategy', 'Link Building', 'Performance Reports'],
    technologies: ['Google Analytics', 'Search Console', 'Ahrefs', 'SEMrush', 'Screaming Frog'],
    timeline: 'Ongoing (monthly)',
    startingPrice: '₹10,000/month',
  },
  {
    name: 'Landing Page Design',
    description: 'High-converting landing pages designed to capture leads and drive action. A/B tested, mobile-optimized, and blazing fast.',
    features: ['Conversion Optimized', 'A/B Testing', 'Lead Capture Forms', 'Speed Optimized', 'Mobile First', 'Analytics Integration'],
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
    timeline: '1–2 weeks',
    startingPrice: '₹8,000',
  },
  {
    name: 'API Development',
    description: 'Robust, scalable REST and GraphQL APIs. We build backend services that power your applications with security, performance, and reliability.',
    features: ['REST APIs', 'GraphQL', 'Authentication', 'Rate Limiting', 'Documentation', 'Webhooks'],
    technologies: ['Node.js', 'Express', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
    timeline: '3–6 weeks',
    startingPrice: '₹20,000',
  },
  {
    name: 'Website Maintenance',
    description: 'Keep your website secure, updated, and performing at its best. Regular updates, backups, monitoring, and priority support.',
    features: ['Security Updates', 'Performance Monitoring', 'Content Updates', 'Backups', 'Bug Fixes', 'Priority Support'],
    technologies: ['WordPress', 'React', 'Node.js', 'Vercel', 'Cloudflare'],
    timeline: 'Ongoing (monthly)',
    startingPrice: '₹5,000/month',
  },
  {
    name: 'CRM Systems',
    description: 'Custom CRM solutions tailored to your business workflow. Manage leads, customers, sales pipelines, and communications all in one place.',
    features: ['Lead Management', 'Sales Pipeline', 'Email Integration', 'Task Management', 'Reports', 'Team Collaboration'],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'SendGrid', 'Twilio'],
    timeline: '8–12 weeks',
    startingPrice: '₹60,000',
  },
  {
    name: 'Automation Solutions',
    description: 'Automate repetitive tasks and streamline your business processes. From email workflows to data processing, we build systems that save time and money.',
    features: ['Email Automation', 'Data Processing', 'Workflow Automation', 'Integrations', 'Scheduled Tasks', 'Monitoring'],
    technologies: ['Zapier', 'n8n', 'Python', 'Node.js', 'Cron Jobs', 'Webhooks'],
    timeline: '2–4 weeks',
    startingPrice: '₹15,000',
  },
];

// ─── PROJECT RECOMMENDATIONS ─────────────────────────────────

export const PROJECT_RECOMMENDATIONS: ProjectRecommendation[] = [
  {
    business: 'Restaurant',
    keywords: ['restaurant', 'food', 'cafe', 'dining', 'hotel', 'kitchen', 'catering', 'bakery'],
    features: ['Online Ordering', 'QR Menu', 'Table Booking', 'Payment Gateway', 'Delivery Tracking', 'Reviews & Ratings'],
    technologies: ['React', 'Node.js', 'Stripe/Razorpay', 'Google Maps API', 'Firebase'],
    designStyle: 'Warm, inviting colors with food photography. Clean layouts with easy navigation.',
    estimatedTimeline: '6–8 weeks',
    suggestedPages: ['Home', 'Menu', 'Order Online', 'Reservations', 'About', 'Contact', 'Gallery'],
    integrations: ['WhatsApp Business', 'Google Maps', 'Payment Gateway', 'SMS Notifications', 'Google Analytics'],
  },
  {
    business: 'E-commerce Store',
    keywords: ['ecommerce', 'e-commerce', 'online store', 'shop', 'sell', 'products', 'marketplace'],
    features: ['Product Catalog', 'Shopping Cart', 'Secure Checkout', 'Inventory Management', 'Coupon System', 'Order Tracking'],
    technologies: ['Next.js', 'Shopify', 'Stripe', 'Razorpay', 'MongoDB', 'Cloudinary'],
    designStyle: 'Clean, modern grid layouts. High-quality product images with smooth transitions.',
    estimatedTimeline: '8–12 weeks',
    suggestedPages: ['Home', 'Shop', 'Product Details', 'Cart', 'Checkout', 'Account', 'Orders', 'Wishlist', 'Contact'],
    integrations: ['Payment Gateway', 'Shipping API', 'Email Marketing', 'SMS', 'WhatsApp', 'Analytics'],
  },
  {
    business: 'Healthcare',
    keywords: ['healthcare', 'hospital', 'clinic', 'doctor', 'medical', 'health', 'pharmacy', 'wellness'],
    features: ['Appointment Booking', 'Patient Portal', 'Telemedicine', 'Prescription Management', 'Lab Reports', 'Doctor Profiles'],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'WebRTC', 'Twilio', 'HIPAA Compliant'],
    designStyle: 'Clean, trustworthy design with calming blues and whites. Accessible and easy to navigate.',
    estimatedTimeline: '10–14 weeks',
    suggestedPages: ['Home', 'Services', 'Doctors', 'Appointments', 'Patient Portal', 'About', 'Contact', 'Blog'],
    integrations: ['Video Calling', 'SMS Reminders', 'Email', 'Payment Gateway', 'Calendar'],
  },
  {
    business: 'Real Estate',
    keywords: ['real estate', 'property', 'housing', 'apartment', 'construction', 'builder', 'realty'],
    features: ['Property Listings', 'Advanced Search', 'Virtual Tours', 'Map Integration', 'EMI Calculator', 'Inquiry Forms'],
    technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Google Maps', 'Cloudinary', 'Three.js'],
    designStyle: 'Luxurious, premium feel with large property images. Map-centric with filters.',
    estimatedTimeline: '8–12 weeks',
    suggestedPages: ['Home', 'Properties', 'Property Details', 'About', 'Agents', 'Blog', 'Contact', 'Calculator'],
    integrations: ['Google Maps', 'WhatsApp', 'Virtual Tour', 'CRM', 'Email Alerts'],
  },
  {
    business: 'Education',
    keywords: ['education', 'school', 'college', 'university', 'coaching', 'lms', 'course', 'learning', 'tuition'],
    features: ['Course Catalog', 'Video Lessons', 'Quiz System', 'Progress Tracking', 'Certificate Generation', 'Discussion Forum'],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS S3', 'Stripe', 'WebSocket'],
    designStyle: 'Bright, engaging colors. Gamified elements. Clear progress indicators.',
    estimatedTimeline: '10–14 weeks',
    suggestedPages: ['Home', 'Courses', 'Course Details', 'Dashboard', 'Profile', 'Certificates', 'Blog', 'Contact'],
    integrations: ['Video Streaming', 'Payment Gateway', 'Email', 'Push Notifications', 'Google Meet'],
  },
  {
    business: 'Fitness',
    keywords: ['fitness', 'gym', 'yoga', 'workout', 'trainer', 'health club', 'sports'],
    features: ['Class Booking', 'Trainer Profiles', 'Workout Plans', 'Progress Tracking', 'Membership Management', 'Diet Plans'],
    technologies: ['React Native', 'Node.js', 'MongoDB', 'Stripe', 'Firebase'],
    designStyle: 'Bold, energetic design with dark backgrounds and vibrant accents.',
    estimatedTimeline: '6–10 weeks',
    suggestedPages: ['Home', 'Classes', 'Trainers', 'Plans', 'Schedule', 'Gallery', 'Blog', 'Contact'],
    integrations: ['Payment Gateway', 'Calendar', 'Push Notifications', 'WhatsApp', 'Wearable APIs'],
  },
  {
    business: 'Portfolio',
    keywords: ['portfolio', 'personal', 'freelancer', 'designer', 'developer', 'creative', 'agency'],
    features: ['Project Showcase', 'Case Studies', 'Blog', 'Contact Form', 'Resume Download', 'Testimonials'],
    technologies: ['Next.js', 'Tailwind CSS', 'Framer Motion', 'MDX', 'Vercel'],
    designStyle: 'Minimal, elegant with beautiful typography and smooth animations.',
    estimatedTimeline: '2–4 weeks',
    suggestedPages: ['Home', 'Projects', 'About', 'Blog', 'Contact'],
    integrations: ['Email', 'Analytics', 'Social Media', 'Calendar Booking'],
  },
];

// ─── PRICING TIERS ───────────────────────────────────────────

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Starter',
    price: '₹15,000 – ₹30,000',
    features: ['Landing Page / Simple Website', 'Responsive Design', 'Basic SEO', 'Contact Form', '1 Week Delivery', '1 Round Revisions'],
    bestFor: 'Small businesses, freelancers, or personal projects that need a quick online presence.',
  },
  {
    name: 'Professional',
    price: '₹40,000 – ₹80,000',
    features: ['Multi-page Website', 'Custom Design', 'CMS Integration', 'Advanced SEO', 'Animations', 'Admin Panel', '3 Rounds Revisions'],
    bestFor: 'Growing businesses that need a polished, feature-rich website with management capabilities.',
  },
  {
    name: 'Enterprise',
    price: '₹1,00,000+',
    features: ['Custom Web Application', 'AI Integration', 'Dashboard', 'API Development', 'Database Design', 'Scalable Architecture', 'Ongoing Support'],
    bestFor: 'Established businesses building SaaS platforms, complex dashboards, or AI-powered applications.',
  },
];

// ─── COST ESTIMATION COMPONENTS ──────────────────────────────

export interface CostComponent {
  name: string;
  price: number;
  description: string;
}

export const COST_COMPONENTS: CostComponent[] = [
  { name: 'Basic Pages (1–5)', price: 10000, description: 'Static pages with responsive design' },
  { name: 'Additional Pages (6–10)', price: 15000, description: 'Extra pages beyond the base' },
  { name: 'Admin Panel', price: 20000, description: 'Content management dashboard' },
  { name: 'User Authentication', price: 10000, description: 'Login, register, forgot password' },
  { name: 'Payment Gateway', price: 12000, description: 'Stripe/Razorpay integration' },
  { name: 'Database & API', price: 15000, description: 'Backend with database design' },
  { name: 'Dashboard / Analytics', price: 25000, description: 'Data visualization and reports' },
  { name: 'CMS Integration', price: 8000, description: 'Blog, content management' },
  { name: 'Animations & Interactions', price: 8000, description: 'Framer Motion, GSAP effects' },
  { name: 'AI / Chatbot Integration', price: 20000, description: 'AI-powered features' },
  { name: 'E-commerce Features', price: 25000, description: 'Cart, checkout, inventory' },
  { name: 'Mobile App (Cross-platform)', price: 50000, description: 'React Native / Flutter app' },
  { name: 'SEO Optimization', price: 5000, description: 'On-page SEO, meta tags, sitemap' },
  { name: 'Email Integration', price: 5000, description: 'Transactional and marketing emails' },
];

// ─── ABOUT PRIMENOVA ─────────────────────────────────────────

export const ABOUT_PRIMENOVA = {
  name: 'PrimeNova Studio',
  tagline: 'Design. Intelligence. Momentum.',
  description: 'PrimeNova Studio blends human craft with applied AI to build brands, products, and experiences that move fast and feel inevitable. We are a premium design and development agency specializing in web applications, mobile apps, AI integrations, and brand identity.',
  founder: 'Faiz',
  stats: {
    brandsBuilt: '100+',
    satisfactionRate: '98%',
    aiIntegrations: '25+',
  },
  contact: {
    email: 'hello@primenova.studio',
    website: 'primenova.studio',
  },
  values: [
    'Premium quality over quantity',
    'AI-powered efficiency',
    'Human-centered design',
    'Transparent communication',
    'Long-term partnerships',
  ],
};

// ─── CONTEXTUAL SUGGESTION CHIPS ─────────────────────────────

export const SUGGESTION_CHIPS: Record<string, string[]> = {
  default: ['What services do you offer?', 'Show pricing', 'View portfolio', 'Book consultation', 'I need a website'],
  services: ['Web Development', 'Mobile App', 'AI Integration', 'UI/UX Design', 'Branding', 'SEO Services'],
  pricing: ['Starter package details', 'Professional package', 'Enterprise solutions', 'Custom quote', 'Compare packages'],
  project: ['Estimate my project cost', 'Recommended features', 'Technology suggestions', 'Timeline estimate', 'Book consultation'],
  portfolio: ['Show modern websites', 'E-commerce projects', 'AI-powered apps', 'Mobile apps', 'Dashboard designs'],
  booking: ['Schedule a call', 'WhatsApp chat', 'Send email', 'View availability'],
  ecommerce: ['Online store features', 'Payment gateway options', 'Inventory management', 'Shipping integration', 'Pricing for e-commerce'],
  mobile: ['iOS & Android', 'React Native vs Flutter', 'App features', 'App pricing', 'Timeline for app'],
  ai: ['Chatbot development', 'Workflow automation', 'Data analytics', 'Custom AI models', 'AI pricing'],
};

// ─── FOLLOW-UP QUESTIONS ─────────────────────────────────────

export const FOLLOW_UP_QUESTIONS: Record<string, string[]> = {
  general: [
    'What type of business do you run?',
    'Do you already have a website?',
    'What is your primary goal for this project?',
  ],
  project_start: [
    'What features do you need?',
    'Do you have any design references or inspiration?',
    'What is your estimated budget range?',
    'When do you want the project completed?',
  ],
  budget: [
    'Would you like to see our pricing packages?',
    'Do you need ongoing maintenance as well?',
    'Are there any must-have features within this budget?',
  ],
  branding: [
    'Do you already have a logo and brand colors?',
    'What feeling should your brand evoke?',
    'Who is your target audience?',
  ],
  technical: [
    'Do you have a preference for any technology?',
    'Do you need a mobile app as well?',
    'Will you need an admin panel to manage content?',
  ],
};
