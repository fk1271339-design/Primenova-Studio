// ═══════════════════════════════════════════════════════════════
// novaEngine.ts — Core AI Logic Engine for Nova Consultant
// ═══════════════════════════════════════════════════════════════


// ─── TYPES ───────────────────────────────────────────────────

export interface NovaMemory {
  userName: string | null;
  projectType: string | null;
  budget: string | null;
  timeline: string | null;
  preferredTech: string | null;
  businessType: string | null;
  conversationContext: string;
  askedForName: boolean;
  messageCount: number;
}

export interface NovaResponse {
  text: string;
  followUpQuestions: string[];
  suggestionChips: string[];
  intent: string;
}

// ─── MEMORY MANAGEMENT ──────────────────────────────────────

const MEMORY_KEY = 'nova_memory';

export function getMemory(): NovaMemory {
  try {
    const stored = localStorage.getItem(MEMORY_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return {
    userName: null,
    projectType: null,
    budget: null,
    timeline: null,
    preferredTech: null,
    businessType: null,
    conversationContext: 'default',
    askedForName: false,
    messageCount: 0,
  };
}

export function setMemory(memory: NovaMemory): void {
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  } catch {
    // ignore
  }
}

export function clearMemory(): void {
  localStorage.removeItem(MEMORY_KEY);
}

// ─── GREETINGS & MEMORY INTEGRATION ─────────────────────────

export function getInitialGreeting(memory: NovaMemory, loggedInName?: string): string {
  const nameToUse = loggedInName || memory.userName;
  if (nameToUse) {
    if (memory.projectType) {
      return `Welcome back, **${nameToUse}**! 👋 Last time we discussed your **${memory.projectType}** project. Would you like to continue from where we left off?
      
I'm here as your AI Business Consultant, UI Reviewer, and Cost Estimator. Let's finalize your launch plan!`;
    }
    return `Hello, **${nameToUse}**! 👋 Welcome back to PrimeNova Studio.
 
I'm **Nova**, your AI Design & Development Consultant. How is your project planning coming along today? Let's discuss your next launch.`;
  }

  const hour = new Date().getHours();
  let timeGreeting = "Hello! Welcome to PrimeNova Studio.";
  if (hour < 12) timeGreeting = "Good Morning! Hope you're having a wonderful day.";
  else if (hour < 17) timeGreeting = "Good Afternoon! Welcome to PrimeNova Studio.";
  else timeGreeting = "Good Evening! Welcome to PrimeNova Studio.";

  return `${timeGreeting}
 
I'm **Nova**, your AI Design & Development Consultant. I'm here to guide you through our services, outline project estimates, or recommend features for your next product launch.
 
Before we start, may I know your name? It helps me personalize our discussion! 😊`;
}

export function getInitialChips(_memory: NovaMemory): string[] {
  return [
    'UI Reviewer',
    'Cost Estimator',
    'Proposal Generator',
    'Naming Expert',
    'SEO Expert',
    'Business Consultant'
  ];
}

// ─── INTENT PATTERNS ─────────────────────────────────────────

const INTENT_PATTERNS: Record<string, string[]> = {
  greeting: ['hello', 'hi', 'hey', 'greetings', 'howdy', 'namaste', 'hola', 'sup', 'good morning', 'good afternoon', 'good evening'],
  services: ['services', 'what do you offer', 'what can you do', 'capabilities', 'what you do', 'help me with', 'specialty'],
  pricing: ['pricing', 'price', 'cost', 'how much', 'budget', 'rate', 'charges', 'expensive', 'affordable', 'quote', 'packages', 'kitna', 'paisa'],
  web_dev: ['website', 'web development', 'web app', 'webpage', 'landing page', 'frontend', 'backend', 'react', 'next.js'],
  mobile_dev: ['mobile app', 'android', 'ios', 'react native', 'flutter', 'app development', 'phone app'],
  ai_integration: ['ai', 'artificial intelligence', 'machine learning', 'chatbot', 'automation', 'gpt', 'gemini', 'nlp'],
  uiux: ['ui', 'ux', 'design', 'figma', 'wireframe', 'prototype', 'user interface', 'user experience'],
  branding: ['branding', 'brand', 'logo', 'identity', 'brand guidelines', 'visual identity'],
  ecommerce: ['ecommerce', 'e-commerce', 'online store', 'shop', 'sell online', 'products', 'shopping cart'],
  seo: ['seo', 'search engine', 'google ranking', 'organic traffic', 'keywords'],
  portfolio: ['portfolio', 'projects', 'work', 'case studies', 'examples', 'previous work', 'show me'],
  timeline: ['timeline', 'how long', 'duration', 'delivery', 'when', 'deadline', 'time frame', 'kitna time'],
  about: ['about', 'who are you', 'tell me about', 'primenova', 'your team', 'company', 'studio'],
  contact: ['contact', 'reach', 'email', 'phone', 'call', 'message', 'connect', 'talk'],
  booking: ['book', 'consultation', 'meeting', 'schedule', 'appointment', 'call', 'discuss'],
  estimate: ['estimate', 'calculator', 'quote', 'project cost', 'how much will', 'price for'],
  thanks: ['thank', 'thanks', 'appreciate', 'helpful', 'great', 'awesome', 'perfect', 'shukriya', 'dhanyavaad'],
  smalltalk: ['how are you', 'whats up', 'nice to meet you', 'good night', 'bye', 'see you', 'goodnight'],
  confused: ['not sure', 'confused', 'dont know', 'difficult', 'overwhelming', 'lost', 'help me choose'],
  
  // Custom Consultation Expert intents
  ui_reviewer: ['ui reviewer', 'review my ui', 'design audit', 'spacing', 'alignment', 'fonts color', 'ui reviewer mode', 'review ui'],
  cost_estimator: ['cost estimator', 'calculate price', 'budget calc', 'price estimator', 'estimate calculator', 'cost details', 'project cost estimator'],
  proposal_generator: ['proposal generator', 'make proposal', 'write brief', 'proposal creator', 'client proposal brief', 'generate proposal'],
  naming_expert: ['naming expert', 'suggest brand names', 'startup name ideas', 'name my app', 'naming consultant'],
  seo_expert: ['seo expert', 'seo recommendations', 'keywords advice', 'meta tags checklist', 'rank website higher', 'seo advice']
};

export function matchIntent(input: string): { intent: string; confidence: number; keywords: string[] } {
  const normalized = input.toLowerCase().trim();
  let bestMatch = { intent: 'unknown', confidence: 0, keywords: [] as string[] };

  for (const [intent, keywords] of Object.entries(INTENT_PATTERNS)) {
    const matchedKeywords: string[] = [];
    for (const keyword of keywords) {
      if (normalized.includes(keyword)) {
        matchedKeywords.push(keyword);
      }
    }
    const confidence = matchedKeywords.length / Math.max(keywords.length, 1);
    if (matchedKeywords.length > bestMatch.keywords.length) {
      bestMatch = { intent, confidence, keywords: matchedKeywords };
    }
  }

  return bestMatch;
}

// ─── MAIN RESPONSE GENERATOR ─────────────────────────────────

export function generateResponse(input: string, memory: NovaMemory): NovaResponse {
  const intent = matchIntent(input);
  const normalized = input.toLowerCase().trim();
  let text = '';
  let followUpQuestions: string[] = [];
  let suggestionChips: string[] = getInitialChips(memory);
  let contextUpdate = memory.conversationContext;

  // ── Handle User Name Input ──
  if (memory.askedForName && !memory.userName) {
    // Basic clean name extraction
    const match = normalized.match(/(?:my name is|i'm|i am|call me|this is|naam)\s+(\w+)/i);
    const name = match ? match[1] : input.trim().split(' ')[0];
    if (name && name.length > 1) {
      const finalName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      memory.userName = finalName;
      memory.askedForName = false;
      setMemory(memory);
      text = `Pleasure meeting you, **${finalName}**! 🎉\n\nI'm Nova, your AI design and business development consultant. Tell me, what kind of startup or software system are we brainstorming today?`;
      return { text, followUpQuestions: ['SaaS platform?', 'E-commerce storefront?', 'Business landing page?'], suggestionChips: ['Cost Estimator', 'UI Reviewer', 'Business Consultant'], intent: 'name_response' };
    }
  }

  // ── Smart Multi-lingual detection (Basic Hindi/Hinglish detection) ──
  const isHinglish = normalized.includes('kaise') || normalized.includes('kya') || normalized.includes('batao') || normalized.includes('naam') || normalized.includes('kitna') || normalized.includes('karo') || normalized.includes('chalega');

  // ── Custom Expert Consultation Responses ──
  if (intent.intent === 'ui_reviewer' || normalized.includes('ui reviewer') || normalized.includes('review ui')) {
    text = `🎨 **Nova UI Reviewer Mode Enabled**
    
At PrimeNova Studio, we believe UI/UX isn't just about how it looks, but how it works. Here is my core design guidelines audit for your project:

1️⃣ **Visual Contrast & Hierarchy:**
   Ensure your primary content has at least a **4.5:1** contrast ratio. Use distinct font weights (e.g., Bold Outfit for headings, Regular Inter for body text) instead of varying colors.
2️⃣ **Spacing & Alignment (The 8px Grid Rule):**
   Align elements in multiples of **8px** (e.g., margins, paddings, gaps). This establishes visual rhythm and predictable responsive behavior.
3️⃣ **Interactive States & Micro-interactions:**
   Every button or hoverable card should respond with micro-animations (e.g., 2% scale-up, smooth border glows) to indicate interactive fields.

*Would you like me to audit a specific section layout, or plan your design guidelines?*`;
    followUpQuestions = ['Audit my navigation bar layout?', 'What is the color scheme of your brand?'];
    suggestionChips = ['Audit home layout', 'Design systems tips', 'Business Consultant'];
    return { text, followUpQuestions, suggestionChips, intent: 'ui_reviewer' };
  }

  if (intent.intent === 'cost_estimator' || normalized.includes('cost estimator') || normalized.includes('estimate cost')) {
    text = `💰 **Nova Project Cost Estimator**
    
I can outline a step-by-step budgetary estimate. To calculate, please tell me which package fits your business model:

🔹 **Bronze (Starter): ₹15,000 - ₹30,000**
   *Best for landing pages & marketing sites.* Custom UI/UX, fully responsive static layout, integrated contact forms.
🔹 **Silver (Professional): ₹40,000 - ₹80,000**
   *Best for dynamic web platforms.* Dynamic dashboards, MongoDB databases, user authentication, CMS setup.
🔹 **Gold (Enterprise): ₹1,00,000+**
   *Best for SaaS applications.* Complete payment flows (Stripe/Razorpay), real-time alerts, admin panel analytics, AI model integration.

*Which of these models matches your budget limits?*`;
    followUpQuestions = ['Estimate timeline for Silver tier?', 'What features do you want to include?'];
    suggestionChips = ['Silver Tier estimate', 'Gold Tier estimate', 'Proposal Generator'];
    return { text, followUpQuestions, suggestionChips, intent: 'cost_estimator' };
  }

  if (intent.intent === 'proposal_generator' || normalized.includes('proposal generator') || normalized.includes('make proposal')) {
    text = `📄 **Nova Startup Proposal Generator**
    
Let's draft a premium, client-ready project brief. Based on standard PrimeNova agreements, here is a template we can customize:

---
### 📋 PRIMENOVA STUDIO PROJECT BRIEF
* **Client Name:** ${memory.userName || '[Client Name]'}
* **Project Type:** ${memory.projectType || 'Custom Software Solution'}
* **Core Goal:** Drive user conversions and deploy clean, fluid user experiences.
* **Suggested Technology Stack:** Next.js, Tailwind CSS, Spring Boot, MongoDB.
* **Timeline Estimate:** 6–10 weeks.
* **Proposed Phases:**
  1. High-fidelity UI/UX prototype mapping (Figma).
  2. Frontend build & API integration (Vite/Next.js).
  3. Security configuration & cloud deployment (AWS/Docker).
---

*Should we add specific databases, third-party APIs, or user authentication details to this template?*`;
    followUpQuestions = ['Add email verification to scope?', 'What payment gateways do you need?'];
    suggestionChips = ['Add email auth', 'Add Stripe payment', 'SEO Expert'];
    return { text, followUpQuestions, suggestionChips, intent: 'proposal_generator' };
  }

  if (intent.intent === 'naming_expert' || normalized.includes('naming expert') || normalized.includes('name my')) {
    text = `💡 **Nova Naming Expert Mode**
    
Naming a brand requires a blend of visual balance, phonetics, and domain availability. Here are 5 modern startup names based on premium SaaS styles:

1. **NovaFlow** — *Sleek, fluid, action-oriented.* Ideal for SaaS workflow tools.
2. **PrismWeb** — *Colorful, clean, design-focused.* Perfect for agency frontends.
3. **AuraForge** — *Atmospheric, strong, high-performance.* Great for hosting or AI frameworks.
4. **VeloceKit** — *Fast, developer-centric, premium.* Best for engineering code kits.
5. **IntegraNova** — *Intelligent, unified, scalable.* Best for business consultants.

*Which name resonates with your product? Tell me your industry to get tailored suggestions.*`;
    followUpQuestions = ['Generate fintech names?', 'Check domain availability guidelines?'];
    suggestionChips = ['Fintech names', 'AI tool names', 'UI Reviewer'];
    return { text, followUpQuestions, suggestionChips, intent: 'naming_expert' };
  }

  if (intent.intent === 'seo_expert' || normalized.includes('seo expert') || normalized.includes('seo checklist')) {
    text = `📈 **Nova SEO Expert Checklist**
    
To rank on Google search pages, keep your metadata clean and speeds sub-second. Here is our checklist:

✅ **Page Title Tags:** Keep titles under **60 characters**, including primary keyword + brand name (e.g., *PrimeNova Studio | Premium Software Design*).
✅ **Meta Descriptions:** Keep descriptions under **155 characters** with an actionable call-to-action.
✅ **Heading Structure:** Ensure there is precisely **one** \`<h1>\` tag per page, followed by logical \`<h2>\` & \`<h3>\` tags.
✅ **Performance Metrics:** Optimize image sizes and use Next.js routing to maintain Google Lighthouse performance scores above **90**.

*Would you like me to draft high-ranking meta titles for your project?*`;
    followUpQuestions = ['Draft my meta descriptions?', 'Suggest keywords for e-commerce?'];
    suggestionChips = ['Draft meta tags', 'E-commerce keywords', 'UI Reviewer'];
    return { text, followUpQuestions, suggestionChips, intent: 'seo_expert' };
  }

  // ── Fallback intent matching ──
  switch (intent.intent) {
    case 'greeting': {
      const name = memory.userName || '';
      text = `Hello ${name ? `**${name}** ` : ''}👋 Welcome to **PrimeNova Studio** — where premium design meets intelligence.

I'm **Nova**, your AI consultant. I can assist you as a:
🎨 **UI Reviewer** • 💰 **Cost Estimator** • 📄 **Proposal Generator** • 💡 **Naming Expert** • 📈 **SEO Expert**

What are we planning or review today?`;
      if (!memory.userName && !memory.askedForName) {
        text += `\n\nBefore we proceed, what is your name?`;
        memory.askedForName = true;
      }
      break;
    }

    case 'services':
      text = `Certainly! At PrimeNova Studio, we deliver:
- **Web Development** (Next.js, Spring Boot, React)
- **UI/UX Design** (Figma wireframes & design systems)
- **AI Integrations** (Custom assistants & data pipelines)
- **Mobile Development** (React Native & Flutter)
- **SEO & Branding** (Meta mapping & visual design)

Would you like me to launch the **Cost Estimator** for one of these?`;
      suggestionChips = ['Cost Estimator', 'Proposal Generator'];
      break;

    case 'pricing':
      text = `Our packages cover starter landing pages (Bronze), dynamic databases/dashboards (Silver), and enterprise custom platforms (Gold). 
      
Use my **Cost Estimator** chip to calculate custom pricing.`;
      suggestionChips = ['Cost Estimator', 'View Tiers'];
      break;

    default:
      if (isHinglish) {
        text = `Main samajh gaya! Aapko ek software solution chahiye. 
        
Main aapki help **Cost Estimator**, **UI Reviewer**, ya **SEO Expert** ki tarah kar sakta hoon. Aap kis business ke liye plan kar rahe hain?`;
        suggestionChips = ['Cost Estimator', 'UI Reviewer', 'Naming Expert'];
      } else {
        text = `I can help you review layouts, calculate project prices, draft a brief, or generate startup names. 
        
Which role would you like me to assume right now?`;
        suggestionChips = getInitialChips(memory);
      }
      break;
  }

  // Save updated context
  memory.conversationContext = contextUpdate;
  memory.messageCount += 1;
  setMemory(memory);

  return { text, followUpQuestions, suggestionChips, intent: intent.intent };
}
