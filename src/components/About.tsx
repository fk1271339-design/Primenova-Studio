import React from 'react';
import { motion } from 'framer-motion';

const processSteps = [
  { num: '01', title: 'Discover', desc: 'Understanding your business goals, target audience, and engineering requirements.' },
  { num: '02', title: 'Research', desc: 'Analyzing competitors, technical constraints, and user experience patterns.' },
  { num: '03', title: 'Strategy', desc: 'Defining system architecture, database models, design tokens, and project milestones.' },
  { num: '04', title: 'Design', desc: 'Crafting responsive wireframes, dark luxury UI themes, and clickable prototypes.' },
  { num: '05', title: 'Development', desc: 'Building full-stack React frontend and secure Spring Boot REST APIs with clean code.' },
  { num: '06', title: 'Testing', desc: 'Automated unit tests, security authorization audits, and cross-device QA.' },
  { num: '07', title: 'Launch', desc: 'Configuring cloud hosting, SSL, domain DNS, and smooth production deployment.' },
  { num: '08', title: 'Support', desc: 'Continuous SLA maintenance, uptime monitoring, and ongoing feature updates.' },
];

const techStack = [
  { category: 'Frontend', items: ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion'] },
  { category: 'Backend', items: ['Java 21', 'Spring Boot 3', 'Spring Security', 'JWT Auth', 'REST APIs'] },
  { category: 'Database', items: ['MongoDB', 'Spring Data Mongo', 'Vector Indexes', 'Mongoose'] },
  { category: 'Cloud & Hosting', items: ['Docker', 'Nginx', 'Vercel', 'AWS / Cloudflare'] },
  { category: 'AI & Machine Learning', items: ['OpenAI API', 'LangChain', 'Python', 'Vector DB RAG'] },
  { category: 'Design & Craft', items: ['Figma', 'Editorial Systems', 'Design Tokens', 'Storybook'] },
];

const About: React.FC = () => {
  return (
    <section id="about" className="relative w-full max-w-6xl py-24 px-4 md:px-8 border-b border-foreground/5">
      {/* Story & Mission Statement */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="text-[11px] font-mono tracking-[0.3em] text-amber-400 uppercase font-medium">
            ABOUT PRIMENOVA STUDIO
          </div>
          <h2
            className="leading-tight text-foreground font-bold"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            A digital engineering &amp; applied <em style={{ color: '#D4A853' }}>AI studio</em> forging what comes next.
          </h2>
          <p className="text-lg text-muted-foreground font-light leading-relaxed">
            PrimeNova Studio operates at the convergence of high-end editorial design, resilient backend architecture, and cognitive AI integration.
          </p>
          <p className="text-base text-muted-foreground/80 font-light leading-relaxed">
            We build platforms that move fast, scale securely, and leave a lasting impression on paying clients.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="p-8 rounded-3xl liquid-glass border border-amber-400/25 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-amber-400/50 to-transparent" />
            <span className="text-[11px] font-mono tracking-[0.3em] text-amber-400 uppercase font-medium block mb-3">OUR MISSION</span>
            <h3
              className="text-xl font-bold text-foreground mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >Architecting Digital Momentum</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              To empower modern businesses with state-of-the-art web platforms, scalable e-commerce infrastructure, and intelligent AI models that accelerate growth.
            </p>
          </div>

          <div className="p-8 rounded-3xl liquid-glass border border-amber-400/15 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-amber-400/30 to-transparent" />
            <span className="text-[11px] font-mono tracking-[0.3em] text-amber-400 uppercase font-medium block mb-3">OUR VISION</span>
            <h3
              className="text-xl font-bold text-foreground mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >Craft Meets Intelligence</h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              A future where digital products are not just functional software, but cinematic experiences powered by invisible cognitive intelligence.
            </p>
          </div>
        </div>
      </div>

      {/* 8-Step Engineering Lifecycle Timeline */}
      <div id="process" className="mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[11px] font-mono tracking-[0.3em] text-amber-400 uppercase font-medium">HOW WE WORK</span>
          <h3
            className="font-bold text-foreground mt-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)' }}
          >Our 8-Step <em style={{ color: '#D4A853' }}>Engineering Process</em></h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {processSteps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              className="p-6 rounded-2xl liquid-glass border border-foreground/10 flex flex-col gap-3 group hover:border-amber-400/30 transition-all"
            >
              <span className="text-xl font-mono font-bold text-amber-400 group-hover:scale-110 transition-transform">
                {step.num}
              </span>
              <h4 className="text-lg font-bold text-foreground font-display">{step.title}</h4>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Supported Technology Stack Matrix */}
      <div id="tech-stack" className="p-8 sm:p-12 rounded-3xl liquid-glass border border-amber-400/[0.1]">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-mono tracking-[0.3em] text-amber-400 uppercase font-medium">TECHNOLOGY STACK</span>
          <h3
            className="font-bold text-foreground mt-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}
          ><em style={{ color: '#D4A853', fontStyle: 'italic' }}>Engineering</em> Ecosystem</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((col) => (
            <div key={col.category} className="p-5 rounded-2xl bg-foreground/5 dark:bg-white/5 border border-foreground/10">
              <h4 className="text-sm font-mono font-bold text-amber-400 uppercase tracking-wider mb-3">
                {col.category}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {col.items.map((item) => (
                  <span key={item} className="text-xs font-mono text-foreground/90 bg-foreground/10 dark:bg-white/10 px-2.5 py-1 rounded-md">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
