// ═══════════════════════════════════════════════════════════════
// novaEngine.ts — Advanced Conversational AI Engine for Novee
// ChatGPT-inspired multi-turn conversation + PrimeNova consultant
// ═══════════════════════════════════════════════════════════════
import { portfolioData } from '../data/portfolioData';
import {
  SERVICES,
  PRICING_TIERS,
  COST_COMPONENTS,
  ABOUT_PRIMENOVA,
  type ServiceInfo,
} from './novaKnowledge';

// ─── TYPES ────────────────────────────────────────────────────

export type Language = 'hinglish' | 'hindi' | 'english';

export type ConversationStage =
  | 'initial'
  | 'discovery'
  | 'requirements'
  | 'recommendation'
  | 'pricing'
  | 'closing';

export type Intent =
  | 'greeting'
  | 'farewell'
  | 'thanks'
  | 'website_request'
  | 'ecommerce_request'
  | 'mobile_app_request'
  | 'pricing_inquiry'
  | 'service_inquiry'
  | 'feature_request'
  | 'add_feature'
  | 'portfolio_inquiry'
  | 'about_primenova'
  | 'timeline_inquiry'
  | 'technology_inquiry'
  | 'budget_declaration'
  | 'name_declaration'
  | 'product_type_declaration'
  | 'industry_declaration'
  | 'contact_request'
  | 'quotation_request'
  | 'affirmative'
  | 'negative'
  | 'general_question'
  | 'followup_answer'
  | 'who_are_you'
  | 'unclear';

export interface NovaMemory {
  userName: string | null;
  projectType: string | null;
  industry: string | null;
  budget: string | null;
  preferredLanguage: Language | null;
  extractedFeatures: string[];
  pageTypePreference: 'single-page' | 'multi-page' | 'flexible' | null;
  conversationContext: string;
  askedForName: boolean;
  messageCount: number;
  // ─── NEW FIELDS ───
  productType: string | null;
  preferredTech: string | null;
  timeline: string | null;
  discussedServices: string[];
  lastIntent: string;
  conversationStage: ConversationStage;
  decisions: Record<string, string>;
  lastTopic: string | null;
  lastQuestion: string | null;
  pendingField: string | null;
}

export interface NovaResponse {
  text: string;
  followUpQuestions: string[];
  suggestionChips: string[];
  intent: string;
}

export interface SimpleMessage {
  sender: 'user' | 'ai';
  text: string;
}

// ─── MEMORY MANAGEMENT ───────────────────────────────────────

const MEMORY_KEY = 'nova_memory';

function defaultMemory(): NovaMemory {
  return {
    userName: null,
    projectType: null,
    industry: null,
    budget: null,
    preferredLanguage: null,
    extractedFeatures: [],
    pageTypePreference: null,
    conversationContext: 'default',
    askedForName: false,
    messageCount: 0,
    productType: null,
    preferredTech: null,
    timeline: null,
    discussedServices: [],
    lastIntent: '',
    conversationStage: 'initial',
    decisions: {},
    lastTopic: null,
    lastQuestion: null,
    pendingField: null,
  };
}

export function getMemory(): NovaMemory {
  try {
    const stored = localStorage.getItem(MEMORY_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultMemory(), ...parsed };
    }
  } catch {
    // ignore
  }
  return defaultMemory();
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

// ─── LANGUAGE DETECTION ──────────────────────────────────────

export function detectLanguage(text: string): Language {
  if (/[\u0900-\u097F]/.test(text)) return 'hindi';

  const lower = text.toLowerCase();
  const hinglishWords = [
    'chahiye', 'mujhe', 'mera', 'meri', 'mere', 'bhi', 'hai', 'hain',
    'karni', 'karna', 'karo', 'kar', 'aur', 'batao', 'nahi', 'kya',
    'kaise', 'accha', 'sakte', 'hoon', 'kuch', 'dena', 'rakhna',
    'bana', 'bata', 'wale', 'wali', 'wala', 'samajh', 'kitna',
    'paisa', 'dijiye', 'dikhao', 'kare', 'rahe', 'hona', 'honi',
    'milega', 'lagega', 'banwani', 'banwana', 'banani', 'bnani',
    'krdo', 'krna', 'btao', 'bhai', 'yaar', 'isme', 'iska',
    'bilkul', 'theek', 'thik', 'sahi', 'pehle', 'baad', 'abhi',
    'lagao', 'chalo', 'dekho', 'sunno', 'jaisa', 'jaise', 'toh',
    'pe', 'se', 'ko', 'ka', 'ki', 'ke', 'ho', 'wo', 'ye',
  ];

  let matches = 0;
  const words = lower.split(/\s+/);
  for (const word of words) {
    if (hinglishWords.includes(word)) matches++;
  }

  if (matches >= 1) return 'hinglish';
  return 'english';
}

// ─── INTENT DETECTION ────────────────────────────────────────

function detectIntent(
  input: string,
  memory: NovaMemory,
  history: SimpleMessage[]
): Intent {
  const n = input.toLowerCase().trim();
  const words = n.split(/\s+/);

  // Greeting
  if (/^(hi|hello|hey|namaste|hola|sup|yo|greetings|good\s*(morning|afternoon|evening)|assalam|salam|kaise ho|kya haal)$/i.test(n)) {
    return 'greeting';
  }
  if (words.length <= 2 && /^(hi|hello|hey|namaste)/.test(n)) return 'greeting';

  // Farewell
  if (/^(bye|goodbye|alvida|thank you|thanks|shukriya|chal bye|ok bye|tata|see you)$/i.test(n)) {
    return n.includes('thank') || n.includes('shukri') ? 'thanks' : 'farewell';
  }

  // Thanks
  if (/\b(thanks|thank\s*you|shukriya|dhanyavaad|dhanyawad|thnx|ty)\b/i.test(n)) return 'thanks';

  // Who are you
  if (/\b(who\s*are\s*you|kaun\s*ho|kya\s*ho\s*tum|tum\s*kaun|what\s*are\s*you|about\s*yourself|apne\s*baare|tere\s*baare)\b/i.test(n)) return 'who_are_you';

  // Name declaration
  if (/\b(my\s*name\s*is|i\s*am|mera\s*naam|main\s*hoon|call\s*me|i'm)\b/i.test(n) && words.length <= 8) return 'name_declaration';

  // Contact / quotation request
  if (/\b(contact|call|whatsapp|email|book|consultation|get\s*in\s*touch|connect|baat\s*kar|call\s*kar)\b/i.test(n)) return 'contact_request';
  if (/\b(quote|quotation|proposal|get\s*quote|send\s*quote|quote\s*chahiye|quote\s*bhejo)\b/i.test(n)) return 'quotation_request';

  // Portfolio
  if (/\b(portfolio|projects|previous\s*work|past\s*work|case\s*stud|show\s*work|kaam\s*dikhao|work\s*dikhao|faiz)\b/i.test(n)) return 'portfolio_inquiry';

  // About PrimeNova
  if (/\b(about\s*primenova|about\s*you|primenova\s*kya|company\s*k[ei]|studio\s*k[ei]|team\s*k[ei]|founder)\b/i.test(n)) return 'about_primenova';

  // Budget declaration
  const budgetPattern = /\b(budget|budget\s*hai|budget\s*is|mera\s*budget)\b/i;
  const moneyPattern = /(?:₹|rs\.?|inr)?\s*\d+\s*(?:k|K|lakh|lac|l|,?\d*)/;
  if (budgetPattern.test(n) || (moneyPattern.test(n) && /budget|paisa|spend|invest/i.test(n))) return 'budget_declaration';
  if (/^\s*(?:₹|rs\.?|inr)?\s*\d+\s*(?:k|K|lakh|lac|l)?\s*$/i.test(n) && memory.pendingField === 'budget') return 'budget_declaration';

  // Timeline inquiry
  if (/\b(kitna\s*time|timeline|kab\s*tak|delivery|how\s*long|time\s*lag|duration|deadline|jaldi|urgent)\b/i.test(n)) return 'timeline_inquiry';

  // Technology inquiry
  if (/\b(technology|tech\s*stack|react|next\.?js|flutter|node|python|java|spring|angular|vue|konsi\s*tech|which\s*tech)\b/i.test(n)) {
    if (/\b(use|prefer|recommend|suggest|chahiye|lagao|use\s*kar)\b/i.test(n)) return 'technology_inquiry';
  }

  // Service inquiry
  if (/\b(services|kya\s*karte|kya\s*offer|what\s*do\s*you|provide|offering)\b/i.test(n)) return 'service_inquiry';

  // E-commerce specific
  if (/\b(ecommerce|e-commerce|online\s*store|shop|sell\s*online|dukaan|store\s*ban|online\s*sell)\b/i.test(n)) return 'ecommerce_request';

  // Mobile app
  if (/\b(mobile\s*app|android|ios|app\s*ban|app\s*chahiye|application|react\s*native|flutter\s*app)\b/i.test(n)) return 'mobile_app_request';

  // Website request
  if (/\b(website|web\s*site|site|landing\s*page|webpage|web\s*page|bnani|banwani|banani|banwana|bana\s*do|build|develop)\b/i.test(n)) return 'website_request';

  // Pricing inquiry
  if (/\b(price|pricing|cost|rate|kitne|kitna|charge|fee|fees|lagega|paisa|paise|kharcha|invest|package|plan)\b/i.test(n)) return 'pricing_inquiry';

  // Add feature
  if (/\b(add|include|isme|usme|also|bhi\s*chahiye|bhi\s*add|aur\s*chahiye|plus|with|along|saath)\b/i.test(n) && memory.conversationStage !== 'initial') return 'add_feature';

  // Feature request
  if (/\b(feature|payment|login|admin|dashboard|chat|notification|cart|wishlist|search|filter|booking|form|gallery|map|seo|analytics)\b/i.test(n)) return 'feature_request';

  // Affirmative
  if (/^(yes|yeah|yep|ok|okay|sure|haan|ha|ji|theek|thik|sahi|bilkul|absolutely|definitely|of\s*course|done|chalega|chalo|kar\s*do|kr\s*do|proceed|go\s*ahead|let's\s*go)\s*[.!]?$/i.test(n)) return 'affirmative';

  // Negative
  if (/^(no|nah|nope|nahi|na|mat|nhi|not\s*now|later|baad\s*me|abhi\s*nahi)\s*[.!]?$/i.test(n)) return 'negative';

  // Follow-up answer: short response that's likely answering the last question
  if (memory.pendingField && words.length <= 6) return 'followup_answer';

  // General question
  if (/\?$/.test(n) || /\b(kya|kaise|kyun|why|how|what|when|where|which|kab|kahan)\b/i.test(n)) return 'general_question';

  // If conversation is active and this seems like a short answer
  if (memory.conversationStage !== 'initial' && words.length <= 5) return 'followup_answer';

  return 'unclear';
}

// ─── INDUSTRY / REQUIREMENT PARSING ──────────────────────────

const INDUSTRY_MAP: Record<string, { label: string; keywords: string[] }> = {
  gym: {
    label: 'Gym & Fitness',
    keywords: ['gym', 'fitness', 'workout', 'trainer', 'exercise', 'bodybuilding', 'crossfit'],
  },
  restaurant: {
    label: 'Restaurant & Food',
    keywords: ['restaurant', 'cafe', 'food', 'menu', 'dining', 'eatery', 'bakery', 'dhaba', 'hotel', 'kitchen', 'catering'],
  },
  ecommerce: {
    label: 'E-commerce',
    keywords: ['e-commerce', 'ecommerce', 'online store', 'shop', 'products', 'cart', 'buy online', 'clothes', 'fashion', 'store', 'dukaan', 'sell'],
  },
  portfolio: {
    label: 'Portfolio / Personal Brand',
    keywords: ['portfolio', 'developer', 'designer', 'personal site', 'my work', 'resume', 'cv', 'freelancer'],
  },
  healthcare: {
    label: 'Healthcare & Medical',
    keywords: ['hospital', 'clinic', 'doctor', 'medical', 'patient', 'health', 'dental', 'pharmacy', 'wellness'],
  },
  education: {
    label: 'Education & Coaching',
    keywords: ['school', 'college', 'coaching', 'institute', 'academy', 'courses', 'education', 'tuition', 'lms', 'learning'],
  },
  realestate: {
    label: 'Real Estate',
    keywords: ['real estate', 'property', 'builder', 'flats', 'apartments', 'plots', 'housing', 'realty'],
  },
  saas: {
    label: 'SaaS / Web App',
    keywords: ['saas', 'software', 'dashboard', 'web app', 'platform', 'tool', 'subscription'],
  },
  agency: {
    label: 'Agency / Corporate',
    keywords: ['agency', 'company', 'business', 'corporate', 'studio', 'consultancy', 'firm'],
  },
};

const FEATURE_KEYWORDS: Record<string, string[]> = {
  'payment gateway': ['payment', 'pay', 'checkout', 'razorpay', 'stripe', 'online payment', 'gateway'],
  'login/signup': ['login', 'signup', 'auth', 'registration', 'user account'],
  'admin panel': ['admin', 'dashboard', 'management', 'backend', 'admin panel'],
  'product catalog': ['catalog', 'products', 'items', 'menu', 'listing'],
  'cart & wishlist': ['cart', 'wishlist', 'add to cart', 'shopping cart'],
  'search & filters': ['search', 'filter', 'sort', 'category'],
  'booking system': ['booking', 'appointment', 'reservation', 'slot', 'schedule'],
  'contact form': ['form', 'contact', 'enquiry', 'inquiry', 'lead'],
  'gallery': ['gallery', 'photos', 'images', 'portfolio'],
  'map integration': ['map', 'location', 'google map', 'directions'],
  'WhatsApp integration': ['whatsapp', 'wa', 'direct message'],
  'notifications': ['notification', 'alert', 'sms', 'push notification'],
  'SEO': ['seo', 'search engine', 'ranking', 'google rank'],
  'analytics': ['analytics', 'tracking', 'reports', 'data'],
  'blog/CMS': ['blog', 'cms', 'content', 'articles', 'posts'],
  'order tracking': ['order tracking', 'track order', 'shipping', 'delivery'],
  'coupon system': ['coupon', 'discount', 'offer', 'promo'],
};

const PRODUCT_TYPES: Record<string, string> = {
  clothes: 'Clothing & Fashion',
  clothing: 'Clothing & Fashion',
  fashion: 'Clothing & Fashion',
  shoes: 'Shoes & Footwear',
  footwear: 'Shoes & Footwear',
  electronics: 'Electronics',
  cosmetics: 'Cosmetics & Beauty',
  beauty: 'Cosmetics & Beauty',
  food: 'Food & Groceries',
  grocery: 'Food & Groceries',
  groceries: 'Food & Groceries',
  furniture: 'Furniture & Home Decor',
  decor: 'Furniture & Home Decor',
  jewelry: 'Jewelry & Accessories',
  jewellery: 'Jewelry & Accessories',
  accessories: 'Jewelry & Accessories',
  books: 'Books & Stationery',
  sports: 'Sports & Fitness',
  toys: 'Toys & Games',
  medicines: 'Medicine & Pharma',
  pharma: 'Medicine & Pharma',
};

function detectIndustry(text: string): { key: string; label: string } | null {
  const lower = text.toLowerCase();
  for (const [key, data] of Object.entries(INDUSTRY_MAP)) {
    if (data.keywords.some(kw => lower.includes(kw))) {
      return { key, label: data.label };
    }
  }
  return null;
}

function detectFeatures(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const [feature, keywords] of Object.entries(FEATURE_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      found.push(feature);
    }
  }
  return found;
}

function detectProductType(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [kw, label] of Object.entries(PRODUCT_TYPES)) {
    if (lower.includes(kw)) return label;
  }
  return null;
}

function detectBudget(text: string): string | null {
  const lower = text.toLowerCase();

  const match = lower.match(/(?:₹|rs\.?|inr)?\s*(\d+)\s*(k|K|lakh|lac|l)\b/);
  if (match) {
    const num = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    if (unit === 'k') return `₹${(num * 1000).toLocaleString('en-IN')}`;
    if (['lakh', 'lac', 'l'].includes(unit)) return `₹${num},00,000`;
  }

  const directMatch = lower.match(/(?:₹|rs\.?|inr)\s*(\d[\d,]*)/);
  if (directMatch) {
    return `₹${directMatch[1]}`;
  }

  const plainNum = lower.match(/\b(\d{4,7})\b/);
  if (plainNum && /budget|cost|price|paisa|invest|spend/i.test(lower)) {
    return `₹${parseInt(plainNum[1]).toLocaleString('en-IN')}`;
  }

  return null;
}

function extractName(text: string): string | null {
  const patterns = [
    /my\s*name\s*is\s+([a-zA-Z]+)/i,
    /i\s*am\s+([a-zA-Z]+)/i,
    /i'm\s+([a-zA-Z]+)/i,
    /call\s*me\s+([a-zA-Z]+)/i,
    /mera\s*naam\s+([a-zA-Z]+)/i,
    /main\s+([a-zA-Z]+)\s*hoon/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const name = match[1].trim();
      const stopWords = ['is', 'am', 'a', 'the', 'looking', 'want', 'need', 'here'];
      if (!stopWords.includes(name.toLowerCase()) && name.length > 1) {
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      }
    }
  }
  return null;
}

// ─── RESPONSE LANGUAGE HELPERS ───────────────────────────────

type LangResponses = {
  english: string;
  hinglish: string;
  hindi: string;
};

function pick(lang: Language, responses: LangResponses): string {
  return responses[lang] || responses.english;
}

// ─── CONTEXTUAL SUGGESTION CHIPS ─────────────────────────────

function getContextualChips(intent: Intent, memory: NovaMemory, lang: Language): string[] {
  const stage = memory.conversationStage;

  if (stage === 'initial' || intent === 'greeting') {
    return lang === 'hinglish'
      ? ['Website banwani hai', 'Services dikhao', 'Pricing batao', 'Portfolio dekhna hai']
      : ['Help me build a website', 'Show PrimeNova services', 'View pricing', 'See portfolio'];
  }

  if (intent === 'website_request' || intent === 'ecommerce_request') {
    if (!memory.industry) {
      return lang === 'hinglish'
        ? ['E-commerce', 'Business Website', 'Portfolio', 'Booking System', 'SaaS Platform']
        : ['E-commerce Store', 'Business Website', 'Portfolio', 'Booking System', 'SaaS Platform'];
    }
  }

  if (memory.industry && memory.conversationStage === 'requirements') {
    const chips: string[] = [];
    if (!memory.extractedFeatures.includes('payment gateway')) chips.push(lang === 'hinglish' ? 'Payment gateway chahiye' : 'Add payment gateway');
    if (!memory.extractedFeatures.includes('admin panel')) chips.push(lang === 'hinglish' ? 'Admin panel add karo' : 'Add admin panel');
    if (!memory.extractedFeatures.includes('login/signup')) chips.push(lang === 'hinglish' ? 'Login/signup chahiye' : 'Add login/signup');
    if (!memory.budget) chips.push(lang === 'hinglish' ? 'Budget batao' : 'Discuss budget');
    chips.push(lang === 'hinglish' ? 'Estimated cost batao' : 'Show estimated cost');
    return chips.slice(0, 5);
  }

  if (stage === 'pricing') {
    return lang === 'hinglish'
      ? ['Starter package', 'Professional package', 'Enterprise package', 'Quote chahiye']
      : ['Starter package', 'Professional package', 'Enterprise package', 'Get a quote'];
  }

  if (stage === 'recommendation') {
    return lang === 'hinglish'
      ? ['Estimated cost batao', 'Timeline kya hoga?', 'Quote chahiye', 'Aur features add karo']
      : ['Show estimated cost', 'What\'s the timeline?', 'Get a quote', 'Add more features'];
  }

  if (stage === 'closing') {
    return lang === 'hinglish'
      ? ['Quote chahiye', 'WhatsApp pe baat karo', 'Email bhejo', 'Naya project discuss karo']
      : ['Get a quote', 'Chat on WhatsApp', 'Send email', 'Discuss a new project'];
  }

  // Default
  return lang === 'hinglish'
    ? ['Website banwani hai', 'Services dikhao', 'Pricing batao', 'Portfolio dekhna hai']
    : ['Help me build a website', 'Show services', 'View pricing', 'See portfolio'];
}

// ─── INITIAL GREETING & CHIPS ────────────────────────────────

export function getInitialGreeting(memory: NovaMemory, loggedInName?: string): string {
  const name = loggedInName || memory.userName;
  if (name) {
    return `Welcome back, **${name}**! 👋 I'm Novee, your PrimeNova AI assistant. How can I help you today?`;
  }
  return `Hey! I'm **Novee** 👋\n\nYour PrimeNova Studio AI assistant. I can help you plan websites, estimate costs, explore services, and guide your project from idea to launch.\n\nWhat would you like to explore?`;
}

export function getInitialChips(_memory: NovaMemory): string[] {
  return [
    'Help me build a website',
    'Estimate my project cost',
    'Show PrimeNova services',
    'Recommend features for my business',
  ];
}

// ─── FOLLOW-UP ANSWER HANDLER ────────────────────────────────

function handleFollowUpAnswer(
  input: string,
  memory: NovaMemory,
  lang: Language
): NovaResponse | null {
  const lower = input.toLowerCase().trim();
  const pending = memory.pendingField;

  // ── Answering "what type of website?"
  if (pending === 'projectType' || pending === 'websiteType') {
    const industry = detectIndustry(input);
    if (industry) {
      memory.industry = industry.label;
      memory.projectType = industry.key;
      memory.conversationStage = 'requirements';
      memory.pendingField = 'productType';

      if (industry.key === 'ecommerce') {
        return {
          text: pick(lang, {
            english: `Great choice! What kind of products will you sell — clothing, electronics, cosmetics, food, or something else?`,
            hinglish: `Perfect 👍 Aap kya sell karte ho — clothing, electronics, cosmetics, food ya kuch aur?`,
            hindi: `बढ़िया! आप क्या बेचते हैं — कपड़े, इलेक्ट्रॉनिक्स, कॉस्मेटिक्स, खाना या कुछ और?`,
          }),
          followUpQuestions: [],
          suggestionChips: ['Clothing', 'Electronics', 'Food', 'Cosmetics', 'Something else'],
          intent: 'followup_answer',
        };
      }

      memory.pendingField = 'features';
      return {
        text: pick(lang, {
          english: `Got it — a **${industry.label}** website. What are the main features you need? For example: booking system, contact form, gallery, admin panel, etc.`,
          hinglish: `Samajh gaya — **${industry.label}** website chahiye 👍 Kya kya features chahiye? Jaise booking system, contact form, gallery, admin panel, etc.`,
          hindi: `समझ गया — **${industry.label}** वेबसाइट। इसमें क्या-क्या फीचर्स चाहिए? जैसे बुकिंग, कॉन्टैक्ट फॉर्म, गैलरी, एडमिन पैनल आदि।`,
        }),
        followUpQuestions: [],
        suggestionChips: getContextualChips('followup_answer', memory, lang),
        intent: 'followup_answer',
      };
    }

    // Check for project type keywords
    if (/\b(ecommerce|e-commerce|online\s*store|shop|dukaan)\b/i.test(lower)) {
      memory.industry = 'E-commerce';
      memory.projectType = 'ecommerce';
      memory.conversationStage = 'requirements';
      memory.pendingField = 'productType';
      return {
        text: pick(lang, {
          english: `Perfect. What kind of products will you sell — clothing, electronics, cosmetics, food, or something else?`,
          hinglish: `Perfect 👍 Aap kya sell karte ho — clothing, electronics, cosmetics, food ya kuch aur?`,
          hindi: `बढ़िया! आप क्या बेचते हैं — कपड़े, इलेक्ट्रॉनिक्स, कॉस्मेटिक्स, खाना या कुछ और?`,
        }),
        followUpQuestions: [],
        suggestionChips: ['Clothing', 'Electronics', 'Food', 'Cosmetics', 'Something else'],
        intent: 'followup_answer',
      };
    }

    // Generic type
    if (/\b(business|corporate|company)\b/i.test(lower)) {
      memory.industry = 'Agency / Corporate';
      memory.projectType = 'agency';
    } else if (/\b(portfolio|personal)\b/i.test(lower)) {
      memory.industry = 'Portfolio / Personal Brand';
      memory.projectType = 'portfolio';
    } else if (/\b(booking|appointment)\b/i.test(lower)) {
      memory.industry = 'Booking & Event Platform';
      memory.projectType = 'booking';
    }

    if (memory.industry) {
      memory.conversationStage = 'requirements';
      memory.pendingField = 'features';
      return {
        text: pick(lang, {
          english: `Got it — **${memory.industry}** website. What key features do you need? For example: contact forms, galleries, booking, admin panel, etc.`,
          hinglish: `Samajh gaya — **${memory.industry}** website 👍 Isme kya kya chahiye? Jaise contact form, gallery, booking, admin panel, etc.`,
          hindi: `समझ गया — **${memory.industry}** वेबसाइट। इसमें क्या-क्या चाहिए?`,
        }),
        followUpQuestions: [],
        suggestionChips: getContextualChips('followup_answer', memory, lang),
        intent: 'followup_answer',
      };
    }
  }

  // ── Answering "what products do you sell?"
  if (pending === 'productType') {
    const productType = detectProductType(input);
    if (productType) {
      memory.productType = productType;
    } else {
      memory.productType = input.trim();
    }
    memory.conversationStage = 'recommendation';
    memory.pendingField = 'features';

    const pt = memory.productType;
    const featureSuggestions = getEcommerceFeatures(pt);

    return {
      text: pick(lang, {
        english: `Nice. For a **${pt}** store, we typically include:\n\n${featureSuggestions}\n\nWould you like to add anything specific, or should I estimate the cost?`,
        hinglish: `Nice 👍 **${pt}** store ke liye hum usually ye features include karte hain:\n\n${featureSuggestions}\n\nKuch aur specific add karna hai, ya cost estimate bataaun?`,
        hindi: `बढ़िया। **${pt}** स्टोर के लिए हम आमतौर पर ये फीचर्स शामिल करते हैं:\n\n${featureSuggestions}\n\nकुछ और जोड़ना है, या कॉस्ट एस्टिमेट बताऊं?`,
      }),
      followUpQuestions: [],
      suggestionChips: lang === 'hinglish'
        ? ['Cost estimate batao', 'Payment gateway chahiye', 'Admin panel add karo', 'WhatsApp notifications']
        : ['Show cost estimate', 'Add payment gateway', 'Add admin panel', 'Add WhatsApp notifications'],
      intent: 'followup_answer',
    };
  }

  // ── Answering budget
  if (pending === 'budget') {
    const budget = detectBudget(input);
    if (budget) {
      memory.budget = budget;
      memory.pendingField = null;
      memory.conversationStage = 'recommendation';
      return generateBudgetAnalysis(memory, lang);
    }
  }

  return null;
}

function getEcommerceFeatures(productType: string): string {
  const base = `• Product catalog with images & descriptions\n• Search & filters\n• Cart & wishlist\n• Secure checkout\n• Payment gateway (Razorpay/Stripe)\n• Order management`;

  const extras: string[] = [];
  const lower = productType.toLowerCase();

  if (lower.includes('cloth') || lower.includes('fashion') || lower.includes('shoe') || lower.includes('footwear')) {
    extras.push('• Size & color variants', '• Size chart');
  }
  if (lower.includes('food') || lower.includes('grocer')) {
    extras.push('• Delivery slot booking', '• Perishable item handling');
  }
  if (lower.includes('electron')) {
    extras.push('• Product comparison', '• EMI calculator');
  }

  return base + (extras.length ? '\n' + extras.join('\n') : '');
}

// ─── BUDGET ANALYSIS ─────────────────────────────────────────

function generateBudgetAnalysis(memory: NovaMemory, lang: Language): NovaResponse {
  const budget = memory.budget || 'Custom';
  const industry = memory.industry || 'your project';

  let tier = '';
  let tierDesc = '';
  const budgetNum = parseInt((budget || '0').replace(/[₹,]/g, ''));

  if (budgetNum <= 30000) {
    tier = 'Starter';
    tierDesc = lang === 'hinglish'
      ? 'Isme aapko responsive landing page, contact form, basic SEO aur WhatsApp CTA mil jayega.'
      : 'This includes a responsive landing page, contact form, basic SEO, and WhatsApp CTA.';
  } else if (budgetNum <= 80000) {
    tier = 'Professional';
    tierDesc = lang === 'hinglish'
      ? 'Isme multi-page website, admin panel, database integration, user authentication aur advanced features aa sakte hain.'
      : 'This covers multi-page website, admin panel, database, user auth, and advanced features.';
  } else {
    tier = 'Enterprise';
    tierDesc = lang === 'hinglish'
      ? 'Isme full custom web application, AI integration, payment systems, real-time analytics aur scalable architecture possible hai.'
      : 'This enables full custom web app, AI integration, payment systems, real-time analytics, and scalable architecture.';
  }

  return {
    text: pick(lang, {
      english: `Got it — **${budget}** budget for **${industry}**.\n\nThat falls in our **${tier} tier**. ${tierDesc}\n\nWould you like me to create a detailed feature-by-feature cost breakdown?`,
      hinglish: `Samajh gaya — **${budget}** budget hai **${industry}** ke liye.\n\nYe hamare **${tier} tier** mein aata hai. ${tierDesc}\n\nKya main detailed feature-wise cost breakdown banaun?`,
      hindi: `समझ गया — **${budget}** बजट है **${industry}** के लिए।\n\nये हमारे **${tier} tier** में आता है। ${tierDesc}\n\nक्या मैं विस्तृत फीचर-वाइज़ कॉस्ट ब्रेकडाउन बनाऊं?`,
    }),
    followUpQuestions: [],
    suggestionChips: lang === 'hinglish'
      ? ['Haan, breakdown batao', 'Features adjust karo', 'Quote chahiye']
      : ['Yes, show breakdown', 'Adjust features', 'Get a quote'],
    intent: 'pricing_inquiry',
  };
}

// ─── COST ESTIMATION ─────────────────────────────────────────

function generateCostEstimate(memory: NovaMemory, lang: Language): NovaResponse {
  let total = 0;
  const breakdown: string[] = [];
  const features = memory.extractedFeatures;
  const industry = memory.industry || '';

  // Base pages
  const hasMultiPage = memory.pageTypePreference === 'multi-page' || features.length > 3 || /ecommerce|saas/i.test(industry);
  if (hasMultiPage) {
    total += 15000;
    breakdown.push('Multi-page layout — ₹15,000');
  } else {
    total += 10000;
    breakdown.push('Base pages — ₹10,000');
  }

  // Feature-based costs
  for (const comp of COST_COMPONENTS) {
    const compLower = comp.name.toLowerCase();
    const matched = features.some(f => compLower.includes(f.split(' ')[0].toLowerCase()) || f.toLowerCase().includes(compLower.split(' ')[0].toLowerCase()));
    if (matched) {
      total += comp.price;
      breakdown.push(`${comp.name} — ₹${comp.price.toLocaleString('en-IN')}`);
    }
  }

  // Industry defaults
  if (/ecommerce|e-commerce/i.test(industry) && !features.includes('payment gateway')) {
    total += 12000;
    breakdown.push('Payment Gateway — ₹12,000');
    total += 25000;
    breakdown.push('E-commerce Features — ₹25,000');
  }

  const formatted = breakdown.map(b => `• ${b}`).join('\n');

  return {
    text: pick(lang, {
      english: `Here's an estimated cost breakdown for your **${memory.industry || 'project'}**:\n\n${formatted}\n\n**Estimated Total: ₹${total.toLocaleString('en-IN')}**\n\n*This is an approximate estimate. Final pricing may vary based on detailed requirements and scope discussion.*\n\nWould you like to get a formal quote, or adjust any features?`,
      hinglish: `Aapke **${memory.industry || 'project'}** ka estimated cost breakdown:\n\n${formatted}\n\n**Estimated Total: ₹${total.toLocaleString('en-IN')}**\n\n*Ye approximate estimate hai. Final pricing detailed discussion ke baad decide hogi.*\n\nFormal quote chahiye, ya koi feature adjust karna hai?`,
      hindi: `आपके **${memory.industry || 'प्रोजेक्ट'}** का अनुमानित कॉस्ट ब्रेकडाउन:\n\n${formatted}\n\n**अनुमानित कुल: ₹${total.toLocaleString('en-IN')}**\n\n*ये अनुमानित है। अंतिम कीमत विस्तृत चर्चा पर निर्भर करेगी।*\n\nक्या आप औपचारिक कोट चाहेंगे?`,
    }),
    followUpQuestions: [],
    suggestionChips: lang === 'hinglish'
      ? ['Quote chahiye', 'Features adjust karo', 'Timeline batao']
      : ['Get a quote', 'Adjust features', 'Show timeline'],
    intent: 'pricing_inquiry',
  };
}

// ─── MAIN RESPONSE GENERATOR ─────────────────────────────────

export function generateResponse(
  input: string,
  memory: NovaMemory,
  messageHistory: SimpleMessage[] = []
): NovaResponse {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      text: 'Feel free to ask me anything about PrimeNova Studio!',
      followUpQuestions: [],
      suggestionChips: getInitialChips(memory),
      intent: 'unclear',
    };
  }

  // 1. Detect language
  const detectedLang = detectLanguage(input);
  if (!memory.preferredLanguage || (input.length > 5 && detectedLang !== 'english')) {
    memory.preferredLanguage = detectedLang;
  }
  const lang = memory.preferredLanguage || 'english';

  // 2. Detect intent
  const intent = detectIntent(input, memory, messageHistory);

  // 3. Extract any implicit data
  const detectedName = extractName(input);
  if (detectedName) memory.userName = detectedName;

  const detectedIndustry = detectIndustry(input);
  if (detectedIndustry && intent !== 'followup_answer') {
    memory.industry = detectedIndustry.label;
    memory.projectType = detectedIndustry.key;
  }

  const detectedFeatures = detectFeatures(input);
  if (detectedFeatures.length > 0) {
    memory.extractedFeatures = [...new Set([...memory.extractedFeatures, ...detectedFeatures])];
  }

  const detectedProduct = detectProductType(input);
  if (detectedProduct) memory.productType = detectedProduct;

  const detectedBudget = detectBudget(input);
  if (detectedBudget) memory.budget = detectedBudget;

  // 4. Update conversation counters
  memory.messageCount += 1;
  memory.lastIntent = intent;

  // 5. Handle follow-up answers first
  if (intent === 'followup_answer' && memory.pendingField) {
    const followUpResult = handleFollowUpAnswer(input, memory, lang);
    if (followUpResult) {
      setMemory(memory);
      return followUpResult;
    }
  }

  // 6. Generate response based on intent
  let response: NovaResponse;

  switch (intent) {
    case 'greeting':
      response = handleGreeting(memory, lang);
      break;
    case 'farewell':
      response = handleFarewell(memory, lang);
      break;
    case 'thanks':
      response = handleThanks(memory, lang);
      break;
    case 'who_are_you':
      response = handleWhoAreYou(memory, lang);
      break;
    case 'name_declaration':
      response = handleNameDeclaration(input, memory, lang);
      break;
    case 'website_request':
      response = handleWebsiteRequest(input, memory, lang);
      break;
    case 'ecommerce_request':
      response = handleEcommerceRequest(input, memory, lang);
      break;
    case 'mobile_app_request':
      response = handleMobileAppRequest(memory, lang);
      break;
    case 'pricing_inquiry':
      response = handlePricingInquiry(memory, lang);
      break;
    case 'service_inquiry':
      response = handleServiceInquiry(memory, lang);
      break;
    case 'feature_request':
    case 'add_feature':
      response = handleFeatureRequest(input, memory, lang);
      break;
    case 'portfolio_inquiry':
      response = handlePortfolioInquiry(memory, lang);
      break;
    case 'about_primenova':
      response = handleAboutPrimeNova(memory, lang);
      break;
    case 'timeline_inquiry':
      response = handleTimelineInquiry(memory, lang);
      break;
    case 'technology_inquiry':
      response = handleTechnologyInquiry(memory, lang);
      break;
    case 'budget_declaration':
      response = handleBudgetDeclaration(input, memory, lang);
      break;
    case 'contact_request':
      response = handleContactRequest(memory, lang);
      break;
    case 'quotation_request':
      response = handleQuotationRequest(memory, lang);
      break;
    case 'affirmative':
      response = handleAffirmative(memory, lang);
      break;
    case 'negative':
      response = handleNegative(memory, lang);
      break;
    case 'general_question':
      response = handleGeneralQuestion(input, memory, lang);
      break;
    case 'followup_answer':
      response = handleSmartFollowUp(input, memory, lang);
      break;
    default:
      response = handleUnclear(input, memory, lang);
  }

  setMemory(memory);
  return response;
}

// ─── INTENT HANDLERS ─────────────────────────────────────────

function handleGreeting(memory: NovaMemory, lang: Language): NovaResponse {
  const name = memory.userName;
  memory.conversationStage = 'initial';

  return {
    text: pick(lang, {
      english: name
        ? `Hey ${name}! 👋 How can I help you today?`
        : `Hey there! 👋 I'm Novee, your PrimeNova AI assistant. How can I help you today?`,
      hinglish: name
        ? `Hey ${name}! 👋 Kaise help kar sakta hoon aaj?`
        : `Hey! 👋 Main Novee hoon, PrimeNova ka AI assistant. Batao kya help chahiye?`,
      hindi: name
        ? `नमस्ते ${name}! 👋 आज मैं कैसे मदद कर सकता हूँ?`
        : `नमस्ते! 👋 मैं Novee हूँ, PrimeNova का AI असिस्टेंट। बताइए कैसे मदद करूं?`,
    }),
    followUpQuestions: [],
    suggestionChips: getContextualChips('greeting', memory, lang),
    intent: 'greeting',
  };
}

function handleFarewell(memory: NovaMemory, lang: Language): NovaResponse {
  const name = memory.userName;
  return {
    text: pick(lang, {
      english: `Goodbye${name ? ` ${name}` : ''}! Feel free to come back anytime. Have a great day! 👋`,
      hinglish: `Bye${name ? ` ${name}` : ''}! Jab bhi zaroorat ho wapas aa jana. Take care! 👋`,
      hindi: `अलविदा${name ? ` ${name}` : ''}! जब भी ज़रूरत हो वापस आइए। ध्यान रखें! 👋`,
    }),
    followUpQuestions: [],
    suggestionChips: [],
    intent: 'farewell',
  };
}

function handleThanks(memory: NovaMemory, lang: Language): NovaResponse {
  return {
    text: pick(lang, {
      english: `You're welcome! 😊 Let me know if you need anything else.`,
      hinglish: `Koi baat nahi! 😊 Aur kuch chahiye toh batao.`,
      hindi: `आपका स्वागत है! 😊 और कुछ चाहिए तो बताइए।`,
    }),
    followUpQuestions: [],
    suggestionChips: getContextualChips('thanks', memory, lang),
    intent: 'thanks',
  };
}

function handleWhoAreYou(memory: NovaMemory, lang: Language): NovaResponse {
  return {
    text: pick(lang, {
      english: `I'm **Novee**, the AI assistant for **PrimeNova Studio** — a premium design & development agency.\n\nI can help you with:\n• Planning websites & apps\n• Estimating project costs\n• Exploring our services & portfolio\n• Recommending features for your business\n• Connecting you with the PrimeNova team\n\nWhat would you like to explore?`,
      hinglish: `Main **Novee** hoon — **PrimeNova Studio** ka AI assistant.\n\nPrimeNova ek premium design & development agency hai. Main aapki help kar sakta hoon:\n• Website & app planning\n• Project cost estimate\n• Services & portfolio explore karna\n• Aapke business ke liye features recommend karna\n• PrimeNova team se connect karna\n\nKya explore karna chahoge?`,
      hindi: `मैं **Novee** हूँ — **PrimeNova Studio** का AI असिस्टेंट।\n\nPrimeNova एक प्रीमियम डिज़ाइन और डेवलपमेंट एजेंसी है। मैं आपकी मदद कर सकता हूँ:\n• वेबसाइट और ऐप प्लानिंग\n• प्रोजेक्ट कॉस्ट एस्टिमेट\n• सर्विसेज़ और पोर्टफोलियो\n• बिज़नेस के लिए फीचर्स\n• PrimeNova टीम से कनेक्ट\n\nक्या जानना चाहेंगे?`,
    }),
    followUpQuestions: [],
    suggestionChips: getContextualChips('who_are_you', memory, lang),
    intent: 'who_are_you',
  };
}

function handleNameDeclaration(input: string, memory: NovaMemory, lang: Language): NovaResponse {
  const name = extractName(input) || input.trim().split(/\s+/).pop() || '';
  if (name && name.length > 1 && name.length < 20) {
    memory.userName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
  const displayName = memory.userName || 'there';

  return {
    text: pick(lang, {
      english: `Nice to meet you, **${displayName}**! 😊 How can I help you today?`,
      hinglish: `Nice to meet you, **${displayName}**! 😊 Batao kaise help karun?`,
      hindi: `आपसे मिलकर अच्छा लगा, **${displayName}**! 😊 बताइए कैसे मदद करूं?`,
    }),
    followUpQuestions: [],
    suggestionChips: getContextualChips('greeting', memory, lang),
    intent: 'name_declaration',
  };
}

function handleWebsiteRequest(input: string, memory: NovaMemory, lang: Language): NovaResponse {
  memory.conversationStage = 'discovery';

  // Check if industry already detected from input
  const industry = detectIndustry(input);
  if (industry) {
    memory.industry = industry.label;
    memory.projectType = industry.key;
    memory.conversationStage = 'requirements';

    if (industry.key === 'ecommerce') {
      memory.pendingField = 'productType';
      return {
        text: pick(lang, {
          english: `An e-commerce website — great choice! What kind of products will you sell?`,
          hinglish: `E-commerce website — badhiya! 👍 Aap kya sell karte ho?`,
          hindi: `ई-कॉमर्स वेबसाइट — बढ़िया! आप क्या बेचते हैं?`,
        }),
        followUpQuestions: [],
        suggestionChips: ['Clothing', 'Electronics', 'Food', 'Cosmetics', 'Something else'],
        intent: 'website_request',
      };
    }

    memory.pendingField = 'features';
    return {
      text: pick(lang, {
        english: `Got it — a **${industry.label}** website. What key features do you need?`,
        hinglish: `Samajh gaya — **${industry.label}** website chahiye 👍 Isme kya kya features chahiye?`,
        hindi: `समझ गया — **${industry.label}** वेबसाइट। इसमें क्या-क्या फीचर्स चाहिए?`,
      }),
      followUpQuestions: [],
      suggestionChips: getContextualChips('website_request', memory, lang),
      intent: 'website_request',
    };
  }

  // No industry detected — ask type
  memory.pendingField = 'projectType';
  return {
    text: pick(lang, {
      english: `Absolutely! 👍 What type of website do you need — e-commerce, business website, portfolio, booking system, or something custom?`,
      hinglish: `Bilkul! 👍 Kis type ki website chahiye — e-commerce, business website, portfolio, booking system ya kuch custom?`,
      hindi: `बिल्कुल! 👍 किस तरह की वेबसाइट चाहिए — ई-कॉमर्स, बिज़नेस वेबसाइट, पोर्टफोलियो, बुकिंग सिस्टम या कुछ कस्टम?`,
    }),
    followUpQuestions: [],
    suggestionChips: ['E-commerce', 'Business Website', 'Portfolio', 'Booking System', 'SaaS Platform'],
    intent: 'website_request',
  };
}

function handleEcommerceRequest(input: string, memory: NovaMemory, lang: Language): NovaResponse {
  memory.industry = 'E-commerce';
  memory.projectType = 'ecommerce';
  memory.conversationStage = 'requirements';

  // Check if product type already in input
  const product = detectProductType(input);
  if (product) {
    memory.productType = product;
    memory.conversationStage = 'recommendation';
    memory.pendingField = 'features';

    const featureSuggestions = getEcommerceFeatures(product);
    return {
      text: pick(lang, {
        english: `Great — a **${product}** e-commerce store. Here's what we'd typically include:\n\n${featureSuggestions}\n\nAnything specific you'd like to add, or should I estimate the cost?`,
        hinglish: `Badhiya — **${product}** e-commerce store 👍 Isme hum usually ye features rakhte hain:\n\n${featureSuggestions}\n\nKuch specific add karna hai, ya cost estimate bataaun?`,
        hindi: `बढ़िया — **${product}** ई-कॉमर्स स्टोर। इसमें हम आमतौर पर ये फीचर्स रखते हैं:\n\n${featureSuggestions}\n\nकुछ और जोड़ना है, या कॉस्ट एस्टिमेट बताऊं?`,
      }),
      followUpQuestions: [],
      suggestionChips: lang === 'hinglish'
        ? ['Cost estimate batao', 'Payment Razorpay se', 'Admin panel chahiye', 'WhatsApp notifications']
        : ['Show cost estimate', 'Use Razorpay', 'Add admin panel', 'Add WhatsApp notifications'],
      intent: 'ecommerce_request',
    };
  }

  // Ask for product type
  memory.pendingField = 'productType';
  return {
    text: pick(lang, {
      english: `Perfect — an e-commerce store! What kind of products will you sell — clothing, electronics, cosmetics, food, or something else?`,
      hinglish: `Perfect — e-commerce store! 👍 Aap kya sell karte ho — clothing, electronics, cosmetics, food ya kuch aur?`,
      hindi: `बढ़िया — ई-कॉमर्स स्टोर! आप क्या बेचते हैं — कपड़े, इलेक्ट्रॉनिक्स, कॉस्मेटिक्स, खाना या कुछ और?`,
    }),
    followUpQuestions: [],
    suggestionChips: ['Clothing', 'Electronics', 'Food', 'Cosmetics', 'Something else'],
    intent: 'ecommerce_request',
  };
}

function handleMobileAppRequest(memory: NovaMemory, lang: Language): NovaResponse {
  memory.conversationStage = 'discovery';
  memory.pendingField = 'projectType';

  const service = SERVICES.find(s => s.name === 'Mobile App Development');
  const techList = service?.technologies.join(', ') || 'React Native, Flutter';

  return {
    text: pick(lang, {
      english: `We build mobile apps using **${techList}** 📱\n\nWhat kind of app do you have in mind? Is it for a specific business, or do you have an app idea you'd like to discuss?`,
      hinglish: `Hum **${techList}** se mobile apps build karte hain 📱\n\nKis type ka app chahiye? Koi specific business ke liye hai, ya koi naya app idea discuss karna hai?`,
      hindi: `हम **${techList}** से मोबाइल ऐप्स बनाते हैं 📱\n\nकिस तरह का ऐप चाहिए? किसी बिज़नेस के लिए है, या कोई नया ऐप आइडिया है?`,
    }),
    followUpQuestions: [],
    suggestionChips: lang === 'hinglish'
      ? ['Business app', 'E-commerce app', 'Booking app', 'Custom app idea']
      : ['Business app', 'E-commerce app', 'Booking app', 'Custom app idea'],
    intent: 'mobile_app_request',
  };
}

function handlePricingInquiry(memory: NovaMemory, lang: Language): NovaResponse {
  // If we have enough context, generate estimate
  if (memory.industry && memory.extractedFeatures.length > 0) {
    return generateCostEstimate(memory, lang);
  }

  // If we have industry but no features, do budget analysis
  if (memory.industry && memory.budget) {
    return generateBudgetAnalysis(memory, lang);
  }

  // Smart pricing — don't throw price immediately
  memory.conversationStage = 'pricing';
  memory.pendingField = 'projectType';

  return {
    text: pick(lang, {
      english: `Website cost depends on the type and features you need. Here's a quick overview:\n\n• **Starter (₹15,000 – ₹30,000)** — Landing pages, business sites, basic SEO\n• **Professional (₹40,000 – ₹80,000)** — Multi-page, admin panel, database, CMS\n• **Enterprise (₹1,00,000+)** — Custom web apps, AI, payment systems, scalable architecture\n\nWhat type of project are you planning? I can give you a more accurate estimate.`,
      hinglish: `Website ka cost type aur features pe depend karta hai. Quick overview:\n\n• **Starter (₹15,000 – ₹30,000)** — Landing pages, business sites, basic SEO\n• **Professional (₹40,000 – ₹80,000)** — Multi-page, admin panel, database, CMS\n• **Enterprise (₹1,00,000+)** — Custom web apps, AI, payment systems\n\nAapka project kis type ka hai? Accurate estimate de sakta hoon.`,
      hindi: `वेबसाइट की कीमत टाइप और फीचर्स पर निर्भर करती है:\n\n• **स्टार्टर (₹15,000 – ₹30,000)** — लैंडिंग पेज, बिज़नेस साइट\n• **प्रोफेशनल (₹40,000 – ₹80,000)** — मल्टी-पेज, एडमिन पैनल, डेटाबेस\n• **एंटरप्राइज़ (₹1,00,000+)** — कस्टम वेब ऐप, AI, पेमेंट सिस्टम\n\nआपका प्रोजेक्ट किस तरह का है?`,
    }),
    followUpQuestions: [],
    suggestionChips: getContextualChips('pricing_inquiry', memory, lang),
    intent: 'pricing_inquiry',
  };
}

function handleServiceInquiry(memory: NovaMemory, lang: Language): NovaResponse {
  const serviceList = SERVICES.map(s => `• **${s.name}** — ${s.startingPrice}+`).join('\n');

  return {
    text: pick(lang, {
      english: `PrimeNova Studio offers:\n\n${serviceList}\n\nWhich service interests you? I can provide more details.`,
      hinglish: `PrimeNova Studio ye services offer karta hai:\n\n${serviceList}\n\nKaunsi service mein interest hai? Aur details de sakta hoon.`,
      hindi: `PrimeNova Studio ये सर्विसेज़ देता है:\n\n${serviceList}\n\nकिस सर्विस में रुचि है? और जानकारी दे सकता हूँ।`,
    }),
    followUpQuestions: [],
    suggestionChips: ['Web Development', 'Mobile App', 'UI/UX Design', 'AI Integration', 'E-commerce'],
    intent: 'service_inquiry',
  };
}

function handleFeatureRequest(input: string, memory: NovaMemory, lang: Language): NovaResponse {
  const newFeatures = detectFeatures(input);
  if (newFeatures.length > 0) {
    memory.extractedFeatures = [...new Set([...memory.extractedFeatures, ...newFeatures])];
  }

  const project = memory.industry || memory.projectType || 'your project';
  const featureList = memory.extractedFeatures.map(f => `• ${f}`).join('\n');
  memory.conversationStage = 'requirements';

  // Check for specific tech preferences in the input
  if (/razorpay/i.test(input)) {
    memory.preferredTech = 'Razorpay';
    memory.decisions['payment'] = 'Razorpay';
  }
  if (/stripe/i.test(input)) {
    memory.preferredTech = 'Stripe';
    memory.decisions['payment'] = 'Stripe';
  }

  if (memory.extractedFeatures.length > 0) {
    return {
      text: pick(lang, {
        english: `Got it! Updated feature list for **${project}**:\n\n${featureList}\n\nAnything else to add, or should I estimate the cost?`,
        hinglish: `Done! 👍 **${project}** ke updated features:\n\n${featureList}\n\nKuch aur add karna hai, ya cost estimate bataaun?`,
        hindi: `हो गया! **${project}** के अपडेटेड फीचर्स:\n\n${featureList}\n\nकुछ और जोड़ना है, या कॉस्ट एस्टिमेट बताऊं?`,
      }),
      followUpQuestions: [],
      suggestionChips: lang === 'hinglish'
        ? ['Cost estimate batao', 'Aur features add karo', 'Quote chahiye']
        : ['Show cost estimate', 'Add more features', 'Get a quote'],
      intent: 'feature_request',
    };
  }

  return {
    text: pick(lang, {
      english: `Sure! What specific features would you like? For example:\n\n• Payment gateway\n• Login/signup\n• Admin panel\n• Product catalog\n• Booking system\n• Chat/WhatsApp integration`,
      hinglish: `Bilkul! Kaunse specific features chahiye? Jaise:\n\n• Payment gateway\n• Login/signup\n• Admin panel\n• Product catalog\n• Booking system\n• Chat/WhatsApp integration`,
      hindi: `बिल्कुल! कौन से फीचर्स चाहिए? जैसे:\n\n• पेमेंट गेटवे\n• लॉगिन/साइनअप\n• एडमिन पैनल\n• प्रोडक्ट कैटलॉग\n• बुकिंग सिस्टम\n• चैट/WhatsApp इंटीग्रेशन`,
    }),
    followUpQuestions: [],
    suggestionChips: lang === 'hinglish'
      ? ['Payment gateway', 'Admin panel', 'Login/signup', 'Booking system']
      : ['Payment gateway', 'Admin panel', 'Login/signup', 'Booking system'],
    intent: 'feature_request',
  };
}

function handlePortfolioInquiry(memory: NovaMemory, lang: Language): NovaResponse {
  const projNames = portfolioData.projects
    .map(p => `• **${p.title}** — ${p.category}`)
    .join('\n');

  return {
    text: pick(lang, {
      english: `Here are some of PrimeNova Studio's featured projects:\n\n${projNames}\n\nYou can view the full portfolio at [primenova.studio/portfolio](/portfolio). Which type of project interests you?`,
      hinglish: `PrimeNova Studio ke featured projects:\n\n${projNames}\n\nFull portfolio yahan se dekh sakte ho: [primenova.studio/portfolio](/portfolio). Kaunsa type ka project interest karta hai?`,
      hindi: `PrimeNova Studio के फीचर्ड प्रोजेक्ट्स:\n\n${projNames}\n\nपूरा पोर्टफोलियो यहाँ देखें: [primenova.studio/portfolio](/portfolio)। किस तरह का प्रोजेक्ट पसंद आया?`,
    }),
    followUpQuestions: [],
    suggestionChips: ['Web Apps', 'E-commerce', 'AI Projects', 'Start my project'],
    intent: 'portfolio_inquiry',
  };
}

function handleAboutPrimeNova(memory: NovaMemory, lang: Language): NovaResponse {
  const about = ABOUT_PRIMENOVA;
  return {
    text: pick(lang, {
      english: `**${about.name}** — *${about.tagline}*\n\n${about.description}\n\n• Brands Built: ${about.stats.brandsBuilt}\n• Client Satisfaction: ${about.stats.satisfactionRate}\n• AI Integrations: ${about.stats.aiIntegrations}\n\nFounded by **${about.founder}**.\n\nWant to know about our services, pricing, or start a project?`,
      hinglish: `**${about.name}** — *${about.tagline}*\n\n${about.description}\n\n• Brands Built: ${about.stats.brandsBuilt}\n• Client Satisfaction: ${about.stats.satisfactionRate}\n• AI Integrations: ${about.stats.aiIntegrations}\n\nFounder: **${about.founder}**\n\nServices, pricing ya project start karna hai?`,
      hindi: `**${about.name}** — *${about.tagline}*\n\n${about.description}\n\n• ब्रांड्स बिल्ट: ${about.stats.brandsBuilt}\n• क्लाइंट संतुष्टि: ${about.stats.satisfactionRate}\n• AI इंटीग्रेशन्स: ${about.stats.aiIntegrations}\n\nसंस्थापक: **${about.founder}**\n\nसर्विसेज़, प्राइसिंग या प्रोजेक्ट शुरू करना है?`,
    }),
    followUpQuestions: [],
    suggestionChips: ['View services', 'View pricing', 'Start a project'],
    intent: 'about_primenova',
  };
}

function handleTimelineInquiry(memory: NovaMemory, lang: Language): NovaResponse {
  let timelineInfo = '';
  if (memory.industry) {
    const matchedService = SERVICES.find(s =>
      s.name.toLowerCase().includes(memory.industry?.toLowerCase().split(' ')[0] || '') ||
      memory.industry?.toLowerCase().includes(s.name.toLowerCase().split(' ')[0] || '')
    );
    if (matchedService) {
      timelineInfo = pick(lang, {
        english: `For a **${memory.industry}** project, the typical timeline is **${matchedService.timeline}**.`,
        hinglish: `**${memory.industry}** project ke liye typical timeline **${matchedService.timeline}** hai.`,
        hindi: `**${memory.industry}** प्रोजेक्ट के लिए typical timeline **${matchedService.timeline}** है।`,
      });
    }
  }

  if (!timelineInfo) {
    timelineInfo = pick(lang, {
      english: `Typical project timelines:\n\n• Landing pages: 1–2 weeks\n• Business websites: 4–6 weeks\n• E-commerce stores: 6–10 weeks\n• Mobile apps: 6–12 weeks\n• Custom web apps: 8–16 weeks\n\nTimeline depends on complexity and features.`,
      hinglish: `Typical project timelines:\n\n• Landing pages: 1–2 weeks\n• Business websites: 4–6 weeks\n• E-commerce stores: 6–10 weeks\n• Mobile apps: 6–12 weeks\n• Custom web apps: 8–16 weeks\n\nTimeline complexity aur features pe depend karti hai.`,
      hindi: `सामान्य प्रोजेक्ट टाइमलाइन:\n\n• लैंडिंग पेज: 1–2 हफ्ते\n• बिज़नेस वेबसाइट: 4–6 हफ्ते\n• ई-कॉमर्स: 6–10 हफ्ते\n• मोबाइल ऐप: 6–12 हफ्ते\n• कस्टम वेब ऐप: 8–16 हफ्ते`,
    });
  }

  return {
    text: timelineInfo,
    followUpQuestions: [],
    suggestionChips: getContextualChips('timeline_inquiry', memory, lang),
    intent: 'timeline_inquiry',
  };
}

function handleTechnologyInquiry(memory: NovaMemory, lang: Language): NovaResponse {
  let techResponse = '';

  if (memory.industry) {
    const techMap: Record<string, string> = {
      ecommerce: 'Next.js, React, Node.js, MongoDB/PostgreSQL, Razorpay/Stripe, Cloudinary',
      gym: 'React, Node.js, MongoDB, Tailwind CSS, WhatsApp API',
      restaurant: 'React, Node.js, MongoDB, Google Maps API, WhatsApp Business',
      healthcare: 'React, Node.js, PostgreSQL, WebRTC, Twilio',
      education: 'React, Node.js, PostgreSQL, AWS S3, WebSocket',
      portfolio: 'Next.js, Tailwind CSS, Framer Motion, Vercel',
      saas: 'Next.js, Node.js, PostgreSQL, Redis, Stripe, AWS',
      realestate: 'Next.js, Node.js, PostgreSQL, Google Maps, Cloudinary',
    };
    const key = memory.projectType || '';
    const stack = techMap[key] || 'React, Node.js, MongoDB/PostgreSQL';

    techResponse = pick(lang, {
      english: `For your **${memory.industry}** project, we'd recommend:\n\n**${stack}**\n\nThis stack ensures performance, scalability, and modern UX. Want me to explain the reasoning?`,
      hinglish: `Aapke **${memory.industry}** project ke liye recommended stack:\n\n**${stack}**\n\nYe performance, scalability aur modern UX ensure karega. Reasoning detail mein samjhaaun?`,
      hindi: `आपके **${memory.industry}** प्रोजेक्ट के लिए recommended stack:\n\n**${stack}**\n\nयह performance, scalability और modern UX सुनिश्चित करेगा।`,
    });
  } else {
    techResponse = pick(lang, {
      english: `We work with modern tech stacks:\n\n• **Frontend:** React, Next.js, TypeScript, Tailwind CSS\n• **Backend:** Node.js, Spring Boot, Python\n• **Database:** MongoDB, PostgreSQL, MySQL\n• **Mobile:** React Native, Flutter\n• **AI:** OpenAI, TensorFlow, LangChain\n• **DevOps:** Docker, AWS, Vercel\n\nThe stack depends on your project requirements.`,
      hinglish: `Hum modern tech stacks use karte hain:\n\n• **Frontend:** React, Next.js, TypeScript, Tailwind CSS\n• **Backend:** Node.js, Spring Boot, Python\n• **Database:** MongoDB, PostgreSQL, MySQL\n• **Mobile:** React Native, Flutter\n• **AI:** OpenAI, TensorFlow, LangChain\n• **DevOps:** Docker, AWS, Vercel\n\nStack project requirements pe depend karta hai.`,
      hindi: `हम modern tech stacks use करते हैं:\n\n• **Frontend:** React, Next.js, TypeScript, Tailwind CSS\n• **Backend:** Node.js, Spring Boot, Python\n• **Database:** MongoDB, PostgreSQL, MySQL\n• **Mobile:** React Native, Flutter\n• **AI:** OpenAI, TensorFlow, LangChain`,
    });
  }

  return {
    text: techResponse,
    followUpQuestions: [],
    suggestionChips: getContextualChips('technology_inquiry', memory, lang),
    intent: 'technology_inquiry',
  };
}

function handleBudgetDeclaration(input: string, memory: NovaMemory, lang: Language): NovaResponse {
  const budget = detectBudget(input);
  if (budget) {
    memory.budget = budget;
    memory.conversationStage = 'pricing';
    return generateBudgetAnalysis(memory, lang);
  }

  memory.pendingField = 'budget';
  return {
    text: pick(lang, {
      english: `What's your approximate budget range? For example: ₹15K, ₹40K, ₹1 Lakh, etc.`,
      hinglish: `Aapka approximate budget kya hai? Jaise: ₹15K, ₹40K, ₹1 Lakh, etc.`,
      hindi: `आपका अनुमानित बजट क्या है? जैसे: ₹15K, ₹40K, ₹1 लाख आदि।`,
    }),
    followUpQuestions: [],
    suggestionChips: ['₹15,000', '₹40,000', '₹80,000', '₹1,00,000+'],
    intent: 'budget_declaration',
  };
}

function handleContactRequest(memory: NovaMemory, lang: Language): NovaResponse {
  memory.conversationStage = 'closing';
  const contact = ABOUT_PRIMENOVA.contact;

  return {
    text: pick(lang, {
      english: `You can reach PrimeNova Studio through:\n\n• **Email:** ${contact.email}\n• **Website:** ${contact.website}\n\nOr visit our [Contact Page](/contact) to send a message directly. We typically respond within 24 hours.`,
      hinglish: `PrimeNova Studio se connect karne ke liye:\n\n• **Email:** ${contact.email}\n• **Website:** ${contact.website}\n\nYa hamare [Contact Page](/contact) pe message bhejo. Hum usually 24 hours mein reply karte hain.`,
      hindi: `PrimeNova Studio से संपर्क करें:\n\n• **ईमेल:** ${contact.email}\n• **वेबसाइट:** ${contact.website}\n\nया हमारे [Contact Page](/contact) पर मैसेज भेजें।`,
    }),
    followUpQuestions: [],
    suggestionChips: lang === 'hinglish'
      ? ['Contact page kholo', 'Email bhejo', 'Naya project discuss karo']
      : ['Open contact page', 'Send email', 'Discuss a new project'],
    intent: 'contact_request',
  };
}

function handleQuotationRequest(memory: NovaMemory, lang: Language): NovaResponse {
  memory.conversationStage = 'closing';

  if (memory.industry || memory.extractedFeatures.length > 0) {
    const summary = buildProjectSummary(memory);
    return {
      text: pick(lang, {
        english: `Here's a summary of what we've discussed:\n\n${summary}\n\nTo get a formal quote, please visit our [Contact Page](/contact) or email us at **${ABOUT_PRIMENOVA.contact.email}**. We'll prepare a detailed proposal for you.`,
        hinglish: `Jo hum discuss kar rahe the uska summary:\n\n${summary}\n\nFormal quote ke liye hamare [Contact Page](/contact) pe jaao ya **${ABOUT_PRIMENOVA.contact.email}** pe email karo. Hum detailed proposal bhejenge.`,
        hindi: `हमारी चर्चा का सारांश:\n\n${summary}\n\nफ़ॉर्मल कोट के लिए [Contact Page](/contact) पर जाएं या **${ABOUT_PRIMENOVA.contact.email}** पर ईमेल करें।`,
      }),
      followUpQuestions: [],
      suggestionChips: lang === 'hinglish'
        ? ['Contact page kholo', 'Kuch aur puchna hai']
        : ['Open contact page', 'I have more questions'],
      intent: 'quotation_request',
    };
  }

  return {
    text: pick(lang, {
      english: `To prepare an accurate quote, I'll need to understand your project first. What type of website or app are you looking to build?`,
      hinglish: `Accurate quote ke liye pehle project samajhna hoga. Kis type ki website ya app banwani hai?`,
      hindi: `सटीक कोट के लिए पहले प्रोजेक्ट समझना होगा। किस तरह की वेबसाइट या ऐप बनवानी है?`,
    }),
    followUpQuestions: [],
    suggestionChips: getContextualChips('website_request', memory, lang),
    intent: 'quotation_request',
  };
}

function handleAffirmative(memory: NovaMemory, lang: Language): NovaResponse {
  const lastIntent = memory.lastIntent;
  const stage = memory.conversationStage;

  // If we just asked about cost estimate
  if (stage === 'recommendation' || stage === 'pricing') {
    if (memory.industry && memory.extractedFeatures.length > 0) {
      return generateCostEstimate(memory, lang);
    }
    if (memory.industry && memory.budget) {
      return generateBudgetAnalysis(memory, lang);
    }
  }

  // If we just recommended features
  if (stage === 'requirements') {
    memory.conversationStage = 'pricing';
    memory.pendingField = 'budget';
    return {
      text: pick(lang, {
        english: `Great! What's your approximate budget for this project?`,
        hinglish: `Badhiya! Is project ke liye approximate budget kya hai?`,
        hindi: `बढ़िया! इस प्रोजेक्ट के लिए अनुमानित बजट क्या है?`,
      }),
      followUpQuestions: [],
      suggestionChips: ['₹15,000', '₹40,000', '₹80,000', '₹1,00,000+'],
      intent: 'affirmative',
    };
  }

  // If closing
  if (stage === 'closing' || lastIntent === 'quotation_request') {
    return handleContactRequest(memory, lang);
  }

  // Generic affirmative
  return {
    text: pick(lang, {
      english: `Sure! What would you like to explore next?`,
      hinglish: `Bilkul! Aage kya explore karna hai?`,
      hindi: `बिल्कुल! आगे क्या जानना है?`,
    }),
    followUpQuestions: [],
    suggestionChips: getContextualChips('affirmative', memory, lang),
    intent: 'affirmative',
  };
}

function handleNegative(memory: NovaMemory, lang: Language): NovaResponse {
  return {
    text: pick(lang, {
      english: `No problem! Is there something else I can help you with?`,
      hinglish: `Koi baat nahi! Kuch aur help chahiye?`,
      hindi: `कोई बात नहीं! कुछ और मदद चाहिए?`,
    }),
    followUpQuestions: [],
    suggestionChips: getContextualChips('negative', memory, lang),
    intent: 'negative',
  };
}

function handleGeneralQuestion(input: string, memory: NovaMemory, lang: Language): NovaResponse {
  const lower = input.toLowerCase();

  // Check for service-specific questions
  for (const service of SERVICES) {
    const serviceLower = service.name.toLowerCase();
    if (lower.includes(serviceLower) || serviceLower.split(' ').some(w => lower.includes(w) && w.length > 3)) {
      return respondAboutService(service, memory, lang);
    }
  }

  // Check if asking about existing project context
  if (memory.industry && (/\b(isk[ae]|isme|uska|uski|uske|ye|yeh|this|it)\b/i.test(lower))) {
    return handleContextualQuestion(input, memory, lang);
  }

  return handleUnclear(input, memory, lang);
}

function handleSmartFollowUp(input: string, memory: NovaMemory, lang: Language): NovaResponse {
  // Try to understand what field this answers based on context
  const lower = input.toLowerCase().trim();

  // Could be an industry/type answer
  const industry = detectIndustry(input);
  if (industry) {
    memory.industry = industry.label;
    memory.projectType = industry.key;
    memory.conversationStage = 'requirements';
    memory.pendingField = 'features';
    return {
      text: pick(lang, {
        english: `Got it — **${industry.label}**. What key features do you need for this?`,
        hinglish: `Samajh gaya — **${industry.label}** 👍 Isme kya kya features chahiye?`,
        hindi: `समझ गया — **${industry.label}**। इसमें क्या-क्या फीचर्स चाहिए?`,
      }),
      followUpQuestions: [],
      suggestionChips: getContextualChips('followup_answer', memory, lang),
      intent: 'followup_answer',
    };
  }

  // Could be a product type
  const product = detectProductType(input);
  if (product && memory.projectType === 'ecommerce') {
    memory.productType = product;
    memory.conversationStage = 'recommendation';
    const feats = getEcommerceFeatures(product);
    return {
      text: pick(lang, {
        english: `Great — **${product}** store. Here's what we'd include:\n\n${feats}\n\nWant to add anything, or should I estimate the cost?`,
        hinglish: `Badhiya — **${product}** store 👍 Isme ye features honge:\n\n${feats}\n\nKuch add karna hai, ya cost estimate bataaun?`,
        hindi: `बढ़िया — **${product}** स्टोर। इसमें ये फीचर्स होंगे:\n\n${feats}\n\nकुछ और जोड़ना है?`,
      }),
      followUpQuestions: [],
      suggestionChips: lang === 'hinglish'
        ? ['Cost estimate batao', 'Payment chahiye', 'Admin panel chahiye']
        : ['Show cost estimate', 'Add payment', 'Add admin panel'],
      intent: 'followup_answer',
    };
  }

  // Could be features
  const features = detectFeatures(input);
  if (features.length > 0) {
    memory.extractedFeatures = [...new Set([...memory.extractedFeatures, ...features])];
    return handleFeatureRequest(input, memory, lang);
  }

  // Could be a budget
  const budget = detectBudget(input);
  if (budget) {
    memory.budget = budget;
    return generateBudgetAnalysis(memory, lang);
  }

  return handleUnclear(input, memory, lang);
}

function handleContextualQuestion(input: string, memory: NovaMemory, lang: Language): NovaResponse {
  const lower = input.toLowerCase();

  // Price of current project
  if (/\b(price|cost|kitna|kitne|charge|rate|lagega)\b/i.test(lower)) {
    if (memory.extractedFeatures.length > 0) {
      return generateCostEstimate(memory, lang);
    }
    return handlePricingInquiry(memory, lang);
  }

  // Timeline of current project
  if (/\b(time|timeline|kab|kitna\s*time|delivery|how\s*long)\b/i.test(lower)) {
    return handleTimelineInquiry(memory, lang);
  }

  // Features of current project
  if (/\b(feature|kya\s*kya|include|milega)\b/i.test(lower)) {
    return handleFeatureRequest(input, memory, lang);
  }

  return handleUnclear(input, memory, lang);
}

function respondAboutService(service: ServiceInfo, memory: NovaMemory, lang: Language): NovaResponse {
  const featureList = service.features.map(f => `• ${f}`).join('\n');
  const techList = service.technologies.join(', ');

  return {
    text: pick(lang, {
      english: `**${service.name}**\n\n${service.description}\n\n**Features:**\n${featureList}\n\n**Technologies:** ${techList}\n**Timeline:** ${service.timeline}\n**Starting from:** ${service.startingPrice}\n\nWant to start a project or get a detailed quote?`,
      hinglish: `**${service.name}**\n\n${service.description}\n\n**Features:**\n${featureList}\n\n**Technologies:** ${techList}\n**Timeline:** ${service.timeline}\n**Starting from:** ${service.startingPrice}\n\nProject start karna hai ya detailed quote chahiye?`,
      hindi: `**${service.name}**\n\n${service.description}\n\n**फीचर्स:**\n${featureList}\n\n**टेक्नोलॉजी:** ${techList}\n**टाइमलाइन:** ${service.timeline}\n**शुरुआती कीमत:** ${service.startingPrice}\n\nप्रोजेक्ट शुरू करना है या कोट चाहिए?`,
    }),
    followUpQuestions: [],
    suggestionChips: lang === 'hinglish'
      ? ['Project start karo', 'Quote chahiye', 'Aur services dikhao']
      : ['Start project', 'Get a quote', 'Show other services'],
    intent: 'service_inquiry',
  };
}

function handleUnclear(input: string, memory: NovaMemory, lang: Language): NovaResponse {
  // Try to be helpful based on current conversation context
  if (memory.conversationStage !== 'initial' && memory.industry) {
    return {
      text: pick(lang, {
        english: `I understand! We were discussing your **${memory.industry}** project. Could you clarify what you'd like to know? I can help with features, pricing, timeline, or technology recommendations.`,
        hinglish: `Samajh gaya! Hum aapke **${memory.industry}** project ke baare mein baat kar rahe the. Kya jaanna chahte ho — features, pricing, timeline ya tech recommendations?`,
        hindi: `समझ गया! हम आपके **${memory.industry}** प्रोजेक्ट पर बात कर रहे थे। क्या जानना चाहेंगे — फीचर्स, प्राइसिंग, टाइमलाइन?`,
      }),
      followUpQuestions: [],
      suggestionChips: getContextualChips('unclear', memory, lang),
      intent: 'unclear',
    };
  }

  return {
    text: pick(lang, {
      english: `I'd love to help! I can assist you with:\n\n• Planning websites & apps\n• Estimating project costs\n• Exploring PrimeNova services\n• Recommending features for your business\n\nWhat would you like to explore?`,
      hinglish: `Main aapki help karna chahta hoon! Main ye sab mein madad kar sakta hoon:\n\n• Website & app planning\n• Project cost estimate\n• PrimeNova services explore karna\n• Business ke liye features recommend karna\n\nKya explore karna chahoge?`,
      hindi: `मैं मदद करना चाहता हूँ! मैं इन सब में सहायता कर सकता हूँ:\n\n• वेबसाइट और ऐप प्लानिंग\n• प्रोजेक्ट कॉस्ट एस्टिमेट\n• PrimeNova सर्विसेज़\n• बिज़नेस फीचर्स\n\nक्या एक्सप्लोर करना चाहेंगे?`,
    }),
    followUpQuestions: [],
    suggestionChips: getContextualChips('unclear', memory, lang),
    intent: 'unclear',
  };
}

// ─── PROJECT SUMMARY BUILDER ─────────────────────────────────

function buildProjectSummary(memory: NovaMemory): string {
  const lines: string[] = [];
  if (memory.industry) lines.push(`• **Project Type:** ${memory.industry}`);
  if (memory.productType) lines.push(`• **Products:** ${memory.productType}`);
  if (memory.extractedFeatures.length > 0) lines.push(`• **Features:** ${memory.extractedFeatures.join(', ')}`);
  if (memory.budget) lines.push(`• **Budget:** ${memory.budget}`);
  if (memory.preferredTech) lines.push(`• **Tech Preference:** ${memory.preferredTech}`);
  if (memory.timeline) lines.push(`• **Timeline:** ${memory.timeline}`);
  if (Object.keys(memory.decisions).length > 0) {
    for (const [key, val] of Object.entries(memory.decisions)) {
      lines.push(`• **${key}:** ${val}`);
    }
  }
  return lines.length > 0 ? lines.join('\n') : '*(No specific details discussed yet)*';
}
