// ═══════════════════════════════════════════════════════════════
// novaEngine.ts — Advanced AI Website Consultant Engine for Novee
// ═══════════════════════════════════════════════════════════════
import { portfolioData } from '../data/portfolioData';

// ─── TYPES & MEMORY STRUCTURE ──────────────────────────────────

export type Language = 'hinglish' | 'hindi' | 'english';

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

const MEMORY_KEY = 'nova_memory';

export function getMemory(): NovaMemory {
  try {
    const stored = localStorage.getItem(MEMORY_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        userName: parsed.userName || null,
        projectType: parsed.projectType || null,
        industry: parsed.industry || null,
        budget: parsed.budget || null,
        preferredLanguage: parsed.preferredLanguage || null,
        extractedFeatures: Array.isArray(parsed.extractedFeatures) ? parsed.extractedFeatures : [],
        pageTypePreference: parsed.pageTypePreference || null,
        conversationContext: parsed.conversationContext || 'default',
        askedForName: parsed.askedForName || false,
        messageCount: parsed.messageCount || 0,
      };
    }
  } catch {
    // ignore
  }
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

// ─── INITIAL HELPERS ──────────────────────────────────────────

export function getInitialGreeting(memory: NovaMemory, loggedInName?: string): string {
  const nameToUse = loggedInName || memory.userName;
  if (nameToUse) {
    if (memory.industry || memory.projectType) {
      const proj = memory.industry || memory.projectType;
      return `Welcome back, **${nameToUse}**! 👋 Last time we discussed your **${proj}** website project. Would you like to continue refining your scope and pricing estimate?`;
    }
    return `Hello, **${nameToUse}**! 👋 Welcome back to PrimeNova Studio.
 
I'm **Novee**, your AI Website Consultant. Let me know what project or features you'd like to plan today!`;
  }

  return `Hello! Welcome to PrimeNova Studio. 👋
 
I'm **Novee**, your AI Website Consultant & Sales Specialist. Tell me about your business or project idea, and I'll help you structure the perfect website, recommend essential features, and analyze your budget!`;
}

export function getInitialChips(_memory: NovaMemory): string[] {
  return [
    'Estimate Website Cost',
    'AI Consultation',
    'Portfolio Projects',
    'UI/UX Design',
    'Mobile Apps',
    'Automation',
  ];
}

// ─── LANGUAGE DETECTION ENGINE ─────────────────────────────────

export function detectLanguage(text: string): Language {
  // Check for Devanagari script (pure Hindi)
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hindi';
  }

  const lower = text.toLowerCase();
  const hinglishKeywords = [
    'chahiye', 'mujhe', 'mera', 'meri', 'mere', 'bhi', 'hai', 'hain', 'karni', 'karna',
    'karo', 'kar', 'par', 'aur', 'ka', 'ki', 'ke', 'batao', 'pe', 'se', 'nahi', 'kya',
    'kaise', 'accha', 'sakte', 'ho', 'hoon', 'kuch', 'lag', 'dena', 'rakhna', 'sab',
    'bana', 'bata', 'rha', 'raha', 'wale', 'wali', 'wala', 'samajh', 'kitna', 'paisa',
    'dijiye', 'karo', 'dikhao', 'kare', 'rahe', 'hona', 'honi', 'mil', 'milega'
  ];

  let matches = 0;
  for (const word of hinglishKeywords) {
    if (new RegExp(`\\b${word}\\b`, 'i').test(lower)) {
      matches++;
    }
  }

  if (matches >= 1 || (lower.includes('website') && (lower.includes('chahiye') || lower.includes('bhi') || lower.includes('hai')))) {
    return 'hinglish';
  }

  return 'english';
}

// ─── REQUIREMENT PARSING ENGINE ───────────────────────────────

interface ParsedRequirement {
  industry: string | null;
  industryKey: string | null;
  features: string[];
  budget: string | null;
  pageTypePreference: 'single-page' | 'multi-page' | 'flexible' | null;
  isDetailedQuery: boolean;
}

const INDUSTRY_MAP: Record<string, { label: string; keywords: string[] }> = {
  gym: {
    label: 'Gym & Fitness',
    keywords: ['gym', 'fitness', 'workout', 'trainer', 'exercise', 'bodybuilding', 'crossfit'],
  },
  restaurant: {
    label: 'Restaurant & Dining',
    keywords: ['restaurant', 'cafe', 'food', 'menu', 'dining', 'table booking', 'eatery', 'bistro', 'dhaba'],
  },
  ecommerce: {
    label: 'E-commerce & Storefront',
    keywords: ['e-commerce', 'ecommerce', 'online store', 'shop', 'products', 'cart', 'buy online', 'clothes', 'fashion', 'store'],
  },
  portfolio: {
    label: 'Portfolio & Personal Brand',
    keywords: ['portfolio', 'developer', 'designer', 'personal site', 'my work', 'resume', 'cv', 'freelancer'],
  },
  healthcare: {
    label: 'Hospital & Healthcare Clinic',
    keywords: ['hospital', 'clinic', 'doctor', 'medical', 'patient', 'health', 'appointment', 'dental', 'care'],
  },
  education: {
    label: 'School & Educational Academy',
    keywords: ['school', 'college', 'coaching', 'institute', 'academy', 'courses', 'education', 'tuition', 'student'],
  },
  realestate: {
    label: 'Real Estate & Property',
    keywords: ['real estate', 'property', 'builder', 'flats', 'apartments', 'plots', 'broker', 'housing'],
  },
  saas: {
    label: 'SaaS & Web Application',
    keywords: ['saas', 'software', 'dashboard', 'web app', 'platform', 'tool', 'analytics', 'subscription'],
  },
  agency: {
    label: 'Agency & Corporate Business',
    keywords: ['agency', 'company', 'business', 'corporate', 'studio', 'consultancy', 'firm'],
  },
  booking: {
    label: 'Booking & Event Platform',
    keywords: ['event', 'booking platform', 'tickets', 'venue', 'rental'],
  },
};

const FEATURE_PATTERNS: Record<string, { label: string; keywords: string[] }> = {
  booking: {
    label: 'Online Booking / Appointment System',
    keywords: ['booking', 'book', 'appointment', 'slot', 'reservation', 'schedule'],
  },
  user_form: {
    label: 'User Details / Contact Lead Form',
    keywords: ['form', 'user details', 'fill form', 'lead form', 'contact form', 'enquiry'],
  },
  confirmation: {
    label: 'Booking Confirmation Screen / Alert',
    keywords: ['confirmation', 'confirm', 'success screen', 'acknowledgement'],
  },
  prices_plans: {
    label: 'Membership Plans & Pricing Tables',
    keywords: ['price', 'prices', 'pricing', 'packages', 'membership', 'plans', 'rates', 'fees'],
  },
  trainers_staff: {
    label: 'Trainers / Faculty / Team Profiles',
    keywords: ['trainers', 'trainer', 'staff', 'doctors', 'team', 'faculty', 'instructor'],
  },
  gallery: {
    label: 'Facilities / Project Gallery',
    keywords: ['gallery', 'photos', 'images', 'pictures', 'ambience'],
  },
  admin_panel: {
    label: 'Admin Dashboard / Management Control',
    keywords: ['admin', 'dashboard', 'management', 'backend control', 'admin panel'],
  },
  payments: {
    label: 'Payment Gateway Integration (Razorpay/Stripe)',
    keywords: ['payment', 'pay', 'checkout', 'razorpay', 'stripe', 'online payment', 'gateway'],
  },
  menu_catalog: {
    label: 'Interactive Digital Menu / Product Catalog',
    keywords: ['menu', 'catalog', 'products', 'dishes', 'items'],
  },
  location_map: {
    label: 'Google Map & Location Integration',
    keywords: ['location', 'map', 'address', 'google map', 'direction'],
  },
  whatsapp_cta: {
    label: 'Direct WhatsApp CTA Integration',
    keywords: ['whatsapp', 'chat', 'direct message'],
  },
  auth: {
    label: 'User Account Login & Authentication',
    keywords: ['login', 'signup', 'auth', 'user account', 'registration'],
  },
};

export function parseUserRequirements(text: string): ParsedRequirement {
  const lower = text.toLowerCase();

  // Industry
  let detectedIndustry: string | null = null;
  let detectedIndustryKey: string | null = null;

  for (const [key, data] of Object.entries(INDUSTRY_MAP)) {
    if (data.keywords.some((kw) => lower.includes(kw))) {
      detectedIndustry = data.label;
      detectedIndustryKey = key;
      break;
    }
  }

  // Features
  const features: string[] = [];
  for (const [key, data] of Object.entries(FEATURE_PATTERNS)) {
    if (data.keywords.some((kw) => lower.includes(kw))) {
      features.push(key);
    }
  }

  // Page Preference
  let pagePref: 'single-page' | 'multi-page' | 'flexible' | null = null;
  if (lower.includes('single page') || lower.includes('single-page') || lower.includes('one page') || lower.includes('ek page')) {
    pagePref = 'single-page';
  } else if (lower.includes('multi page') || lower.includes('multi-page') || lower.includes('multiple pages') || lower.includes('multiple page')) {
    pagePref = 'multi-page';
  } else if (lower.includes('single page ya multi-page') || lower.includes('single or multi')) {
    pagePref = 'flexible';
  }

  // Budget
  let detectedBudget: string | null = null;
  const budgetMatch = lower.match(/(?:budget|price|cost|around|under|in)\s*(?:is|of|hai|=|:)?\s*(?:₹|rs\.?|inr)?\s*(\d+k|\d+,\d+|\d+\s*lakh|\d+\s*l|\d{4,6})/i);
  if (budgetMatch) {
    let raw = budgetMatch[1].trim();
    if (raw.toLowerCase().endsWith('k')) {
      const num = parseInt(raw);
      detectedBudget = `₹${num * 1000}`;
    } else if (raw.toLowerCase().includes('lakh') || raw.toLowerCase().includes('l')) {
      detectedBudget = `₹${raw}`;
    } else {
      detectedBudget = `₹${raw}`;
    }
  } else if (lower.includes('10k') || lower.includes('10,000') || lower.includes('10000')) {
    detectedBudget = '₹10,000';
  } else if (lower.includes('15k') || lower.includes('15,000')) {
    detectedBudget = '₹15,000';
  } else if (lower.includes('20k') || lower.includes('20,000')) {
    detectedBudget = '₹20,000';
  } else if (lower.includes('50k') || lower.includes('50,000')) {
    detectedBudget = '₹50,000';
  } else if (lower.includes('1 lakh') || lower.includes('1lakh') || lower.includes('1L')) {
    detectedBudget = '₹1,00,000';
  }

  // Complexity check
  const isDetailedQuery =
    Boolean(detectedIndustry) ||
    features.length >= 2 ||
    Boolean(detectedBudget) ||
    text.split(' ').length > 12;

  return {
    industry: detectedIndustry,
    industryKey: detectedIndustryKey,
    features,
    budget: detectedBudget,
    pageTypePreference: pagePref,
    isDetailedQuery,
  };
}

// ─── CONSULTATION GENERATOR ───────────────────────────────────

function generateStructuredConsultation(
  memory: NovaMemory,
  currentReq: ParsedRequirement,
  lang: Language
): NovaResponse {
  const industryLabel = memory.industry || currentReq.industry || 'Business';
  const industryKey = currentReq.industryKey || 'agency';
  const budget = memory.budget || currentReq.budget || 'Custom';
  const pagePref = memory.pageTypePreference || currentReq.pageTypePreference || 'flexible';

  // Merge feature set
  const allFeatures = Array.from(
    new Set([...(memory.extractedFeatures || []), ...(currentReq.features || [])])
  );

  // Default features if user gave industry but no specific features
  if (allFeatures.length === 0) {
    if (industryKey === 'gym') allFeatures.push('prices_plans', 'booking', 'user_form', 'confirmation');
    else if (industryKey === 'restaurant') allFeatures.push('menu_catalog', 'booking', 'location_map');
    else if (industryKey === 'ecommerce') allFeatures.push('menu_catalog', 'payments', 'auth');
    else if (industryKey === 'portfolio') allFeatures.push('gallery', 'user_form', 'location_map');
    else allFeatures.push('user_form', 'location_map');
  }

  let text = '';
  let chips = ['Estimate Website Cost', 'Portfolio Projects', 'Contact Us'];
  let followUp = '';

  // ─── HINGLISH RESPONSE GENERATOR ───
  if (lang === 'hinglish') {
    text += `Bilkul! Aapke **${industryLabel}** website requirement ${
      budget !== 'Custom' ? `aur **${budget}** budget` : ''
    } ko dekhte hue, main ek practical aur high-converting website architecture recommend kar raha hoon.\n\n`;

    text += `### 📋 Aapki Requirements:\n`;
    text += `- **Industry:** ${industryLabel}\n`;
    if (pagePref !== 'flexible') text += `- **Page Type:** ${pagePref === 'single-page' ? 'Single-Page Layout' : 'Multi-Page Architecture'}\n`;
    if (budget !== 'Custom') text += `- **Specified Budget:** ${budget}\n`;
    text += `- **Key Features Mentioned:** ${allFeatures.map(f => FEATURE_PATTERNS[f]?.label || f).join(', ')}\n\n`;

    text += `---\n\n`;
    text += `### 🎨 Recommended Website Structure:\n`;

    if (industryKey === 'gym') {
      text += `1. **Hero / Home Section:** Gym introduction, cinematic visuals, aur "Join Now / Book Free Pass" CTA\n`;
      text += `2. **About Gym:** Facilities, modern equipment, aur hygiene/atmosphere details\n`;
      text += `3. **Membership Plans & Pricing:** Clear pricing tables (Monthly, Quarterly, Annual)\n`;
      text += `4. **Trainers & Specializations:** Certified trainers profiles & experience\n`;
      text += `5. **Facilities & Gallery:** High-resolution photos of workout zones\n`;
      text += `6. **Booking & Lead Form:** User name, phone number, preferred timing slot\n`;
      text += `7. **Booking Confirmation State:** Immediate on-screen confirmation + WhatsApp notification trigger\n`;
      text += `8. **Location & Contact:** Google Maps integration, operating hours, aur contact info\n\n`;

      text += `### 🔄 Booking & User Flow:\n`;
      text += `User membership/trial plan select karega ➔ Contact & slot details fill karega ➔ Form submit hone par instant **Booking Confirmation** display hogi ➔ Client aur Admin dono ko instant WhatsApp/Email alert chala jayega.\n\n`;
    } else if (industryKey === 'restaurant') {
      text += `1. **Hero Section:** Ambiance video/banner, chef specials, aur "Reserve a Table" CTA\n`;
      text += `2. **About & Story:** Culinary philosophy aur ambiance overview\n`;
      text += `3. **Interactive Digital Menu:** Filterable menu (Starters, Main Course, Drinks, Veg/Non-Veg)\n`;
      text += `4. **Table Reservation Form:** Date, time, number of guests, special request\n`;
      text += `5. **Confirmation UI:** Reservation confirmation with booking code\n`;
      text += `6. **Location & Timings:** Google Maps, parking info, aur contact numbers\n\n`;

      text += `### 🔄 Reservation Flow:\n`;
      text += `Guest date/time aur guests select karega ➔ Details enter karega ➔ Confirmation screen receive hogi ➔ Restaurant team ko Instant SMS/WhatsApp notify hoga.\n\n`;
    } else if (industryKey === 'ecommerce') {
      text += `1. **Hero Banner:** Featured collections, seasonal offers, aur Shop Now CTA\n`;
      text += `2. **Product Catalog & Filters:** Categories, price range, size/color filters\n`;
      text += `3. **Product Detail Page / Modal:** High-res images, description, stock status\n`;
      text += `4. **Cart & Checkout Drawer:** Dynamic cart calculation, coupon codes, address form\n`;
      text += `5. **Payment Gateway Integration:** Razorpay / Stripe / COD options\n`;
      text += `6. **Order Confirmation & Tracking:** Instant order receipt screen\n\n`;
    } else {
      text += `1. **Hero Section:** Value proposition headline + Primary Call to Action\n`;
      text += `2. **About Section:** Company overview, mission, aur key highlights\n`;
      text += `3. **Services / Features Showcase:** Structured breakdown of offerings\n`;
      text += `4. **Interactive Lead Form:** User details capture form\n`;
      text += `5. **Confirmation UI:** Submission success state\n`;
      text += `6. **Contact & Socials:** Address, email, phone, Google Maps\n\n`;
    }

    text += `---\n\n`;
    text += `### 💰 Budget & Scope Analysis (${budget}):\n`;

    if (budget === '₹10,000' || budget === '₹5,000' || budget === '₹15,000') {
      text += `Aapke **${budget}** budget mein **Custom Single-Page High-Performance Website** with Lead Capture, Booking Confirmation UI, aur WhatsApp CTA fully feasible hai!\n`;
      text += `*Scope Clarification:* Agar aap fully automated online payment gateway (Razorpay) ya full admin dashboard management software chahte hain, toh woh **Silver Tier (₹40,000+)** scope mein aata hai. Lekin lead enquiry format mein booking completely fit ho jayegi.\n\n`;
    } else if (budget === '₹40,000' || budget === '₹50,000') {
      text += `Aapka **${budget}** budget **Silver Tier** range mein hai! Isme aapko Multi-Page layout, MongoDB Database integration, User Authentication, aur Custom Admin Dashboard seamlessly deliver ho sakta hai.\n\n`;
    } else {
      text += `Hum PrimeNova Studio mein Starter websites **₹15,000 - ₹30,000 (Bronze)**, Dynamic Database Apps **₹40,000 - ₹80,000 (Silver)**, aur Custom Enterprise Platforms **₹1,00,000+ (Gold)** mein build karte hain. Aapki requirements ke basis par exact scope customize ho sakta hai.\n\n`;
    }

    text += `### 💡 Smart Recommendations for Maximum Growth:\n`;
    if (industryKey === 'gym') {
      text += `- **1-Day Free Trial Pass CTA:** Visitors ko quickly convert karne ke liye "Get 1 Day Free Gym Pass" offer rakhein.\n`;
      text += `- **WhatsApp Auto-Trigger:** User jab form submit kare, toh uska inquiry payload aapke WhatsApp par immediately trigger ho jaye.\n\n`;
    } else if (industryKey === 'restaurant') {
      text += `- **QR Code Menu:** Dine-in customers ke liye website menu QR code scan enabled rakhein.\n`;
      text += `- **Direct Call / WhatsApp Reservation:** Quick booking ke liye floating action button.\n\n`;
    } else {
      text += `- **Fast Mobile Performance:** 100% responsive design sub-second load times ke saath.\n`;
      text += `- **SEO Meta Setup:** Search engines par locally rank hone ke liye basic schema mapping.\n\n`;
    }

    text += `---\n\n`;

    if (allFeatures.includes('booking') && !allFeatures.includes('payments')) {
      followUp = `Kya aap booking sirf lead/enquiry form format mein chahte hain, ya direct online payment gateway (Razorpay/Stripe) integration ke saath membership confirm karni hai?`;
    } else {
      followUp = `Kya aap chahoge ki main iska exact page breakdown aur feature estimate proposal format mein prepare karoon?`;
    }

    text += `**❓ Next Step:**\n"${followUp}"`;

    chips = ['Generate Proposal', 'Estimate Website Cost', 'View Portfolio Projects'];
  }

  // ─── HINDI RESPONSE GENERATOR ───
  else if (lang === 'hindi') {
    text += `नमस्ते! आपकी **${industryLabel}** वेबसाइट की आवश्यकता ${
      budget !== 'Custom' ? `और **${budget}** बजट` : ''
    } के आधार पर, यहाँ एक पेशेवर वेबसाइट संरचना का सुझाव दिया गया है:\n\n`;

    text += `### 📋 आपकी आवश्यकताएं (Requirements):\n`;
    text += `- **क्षेत्र (Industry):** ${industryLabel}\n`;
    if (budget !== 'Custom') text += `- **निर्धारित बजट:** ${budget}\n`;
    text += `- **मुख्य विशेषताएं:** ${allFeatures.map(f => FEATURE_PATTERNS[f]?.label || f).join(', ')}\n\n`;

    text += `---\n\n`;
    text += `### 🎨 अनुशंसित वेबसाइट संरचना (Structure):\n`;
    text += `1. **मुख्य भाग (Hero Section):** परिचय + 'अभी बुक करें / ज्वाइन करें' बटन\n`;
    text += `2. **हमारे बारे में (About Us):** विवरण और सुविधाएं\n`;
    text += `3. **प्लान और कीमतें (Pricing/Plans):** स्पष्ट शुल्क तालिका\n`;
    text += `4. **बुकिंग और यूज़र डिटेल्स फॉर्म:** नाम, फोन नंबर, पसंदीदा समय फॉर्म\n`;
    text += `5. **बुकिंग कन्फर्मेशन स्क्रीन:** तत्काल ऑन-स्क्रीन पुष्टि और व्हाट्सएप संदेश\n`;
    text += `6. **संपर्क और लोकेशन:** गूगल मैप्स और फोन नंबर\n\n`;

    text += `---\n\n`;
    text += `### 💰 बजट और स्कोप विश्लेषण (${budget}):\n`;
    if (budget === '₹10,000' || budget === '₹15,000') {
      text += `आपके **${budget}** बजट में **कस्टम सिंगल-पेज रेस्पॉन्सिव वेबसाइट** (लीड बुकिंग फॉर्म, कन्फर्मेशन और व्हाट्सएप इंटीग्रेशन के साथ) पूरी तरह से संभव है।\n\n`;
    } else {
      text += `आपके बजट के अनुसार आवश्यकताओं को पूरी तरह से अनुकूलित किया जा सकता है।\n\n`;
    }

    text += `---\n\n`;
    followUp = `क्या आप बुकिंग केवल फॉर्म के माध्यम से चाहते हैं या ऑनलाइन पेमेंट भी जोड़ना चाहते हैं?`;
    text += `**❓ अगला कदम:**\n"${followUp}"`;

    chips = ['एस्टीमेट देखें', 'पोर्टफोलियो देखें', 'संपर्क करें'];
  }

  // ─── ENGLISH RESPONSE GENERATOR ───
  else {
    text += `Certainly! Based on your **${industryLabel}** requirement ${
      budget !== 'Custom' ? `and **${budget}** budget` : ''
    }, here is a high-converting, tailored website architecture for your project.\n\n`;

    text += `### 📋 Understood Requirements:\n`;
    text += `- **Industry / Type:** ${industryLabel}\n`;
    if (pagePref !== 'flexible') text += `- **Layout Style:** ${pagePref === 'single-page' ? 'Single-Page Landing' : 'Multi-Page Platform'}\n`;
    if (budget !== 'Custom') text += `- **Stated Budget:** ${budget}\n`;
    text += `- **Key Features:** ${allFeatures.map(f => FEATURE_PATTERNS[f]?.label || f).join(', ')}\n\n`;

    text += `---\n\n`;
    text += `### 🎨 Recommended Website Structure:\n`;

    if (industryKey === 'gym') {
      text += `1. **Hero Section:** High-energy headline, gym visuals & "Book Free Pass / Join Now" CTA\n`;
      text += `2. **About Gym:** Overview of facilities, cardio/strength zones & hygiene standards\n`;
      text += `3. **Membership Plans & Pricing:** Clear pricing breakdown (Monthly, Quarterly, Annual)\n`;
      text += `4. **Trainers & Staff:** Coach profiles & specializations\n`;
      text += `5. **Gallery:** High-res workout arena photography\n`;
      text += `6. **Booking & Lead Form:** Form collecting name, phone number, and slot preference\n`;
      text += `7. **Booking Confirmation State:** On-screen confirmation + automated WhatsApp alert\n`;
      text += `8. **Contact & Location:** Interactive Google Maps & contact information\n\n`;

      text += `### 🔄 User Booking Flow:\n`;
      text += `User selects membership plan ➔ Fills contact details ➔ Submits form ➔ Receives instant **Booking Confirmation** screen ➔ Lead notification sent to admin via WhatsApp/Email.\n\n`;
    } else if (industryKey === 'restaurant') {
      text += `1. **Hero Section:** Ambience video, chef highlights & "Reserve a Table" CTA\n`;
      text += `2. **About Us:** Culinary story & dining ambience overview\n`;
      text += `3. **Interactive Digital Menu:** Filterable dishes (Starters, Mains, Desserts, Drinks)\n`;
      text += `4. **Table Reservation Form:** Date, time, guest count, and notes\n`;
      text += `5. **Confirmation UI:** Instant reservation receipt with booking ID\n`;
      text += `6. **Location & Directions:** Google Maps integration & phone numbers\n\n`;
    } else {
      text += `1. **Hero Section:** Compelling headline + Primary CTA\n`;
      text += `2. **About Section:** Mission, credentials, and story\n`;
      text += `3. **Services / Features Grid:** Core solutions breakdown\n`;
      text += `4. **Lead Capture Form:** User information collection form\n`;
      text += `5. **Confirmation UI:** Success state acknowledgement\n`;
      text += `6. **Contact Footer:** Address, email, phone & social links\n\n`;
    }

    text += `---\n\n`;
    text += `### 💰 Budget & Scope Analysis (${budget}):\n`;
    if (budget === '₹10,000' || budget === '₹5,000' || budget === '₹15,000') {
      text += `Within your **${budget}** budget, a **Custom Single-Page Responsive Site** with Lead Capture, Booking Confirmation, and WhatsApp integration is completely achievable.\n`;
      text += `*Note:* Fully automated payment gateway checkouts (Stripe/Razorpay) or multi-user admin portals fit into our **Silver Tier (₹40,000+)**.\n\n`;
    } else {
      text += `At PrimeNova Studio, our tiers range from Starter Landing Sites (**₹15,000–₹30,000**), Dynamic Web Applications (**₹40,000–₹80,000**), to Custom Enterprise Solutions (**₹1,00,000+**).\n\n`;
    }

    text += `### 💡 Strategic Consultant Recommendations:\n`;
    text += `- **High-Converting Lead Magnet:** Offer a 1-day free trial or instant discount on initial form submission.\n`;
    text += `- **Mobile Optimization:** Sub-second page loads ensuring zero bounce rates.\n\n`;

    text += `---\n\n`;
    followUp = `Would you like me to generate a detailed feature-by-feature cost breakdown proposal for this project?`;
    text += `**❓ Next Step:**\n"${followUp}"`;

    chips = ['Generate Proposal', 'Estimate Website Cost', 'Explore Portfolio'];
  }

  return {
    text,
    followUpQuestions: [followUp],
    suggestionChips: chips,
    intent: 'consultation',
  };
}

// ─── MAIN RESPONSE GENERATOR ─────────────────────────────────

export function generateResponse(
  input: string,
  memory: NovaMemory,
  messageHistory: SimpleMessage[] = []
): NovaResponse {
  const normalized = input.toLowerCase().trim();

  // 1. Detect language
  const detectedLang = detectLanguage(input);
  if (!memory.preferredLanguage || (input.length > 10 && detectedLang !== 'english')) {
    memory.preferredLanguage = detectedLang;
  }
  const lang = memory.preferredLanguage || 'hinglish';

  // 2. Parse current user message requirements
  const currentReq = parseUserRequirements(input);

  // 3. Scan conversation history for accumulated requirements
  for (const msg of messageHistory) {
    if (msg.sender === 'user') {
      const pastReq = parseUserRequirements(msg.text);
      if (pastReq.industry && !memory.industry) {
        memory.industry = pastReq.industry;
      }
      if (pastReq.budget && !memory.budget) {
        memory.budget = pastReq.budget;
      }
      if (pastReq.pageTypePreference && !memory.pageTypePreference) {
        memory.pageTypePreference = pastReq.pageTypePreference;
      }
      if (pastReq.features.length > 0) {
        const merged = new Set([...memory.extractedFeatures, ...pastReq.features]);
        memory.extractedFeatures = Array.from(merged);
      }
    }
  }

  // Update memory with current message
  if (currentReq.industry) memory.industry = currentReq.industry;
  if (currentReq.budget) memory.budget = currentReq.budget;
  if (currentReq.pageTypePreference) memory.pageTypePreference = currentReq.pageTypePreference;
  if (currentReq.features.length > 0) {
    const merged = new Set([...memory.extractedFeatures, ...currentReq.features]);
    memory.extractedFeatures = Array.from(merged);
  }

  memory.messageCount += 1;
  setMemory(memory);

  // 4. Check if this is a detailed consultation request
  const hasAccumulatedContext = Boolean(memory.industry) || Boolean(memory.budget) || memory.extractedFeatures.length > 0;

  if (currentReq.isDetailedQuery || (hasAccumulatedContext && (normalized.includes('website') || normalized.includes('chahiye') || normalized.includes('add') || normalized.includes('budget') || normalized.includes('booking')))) {
    return generateStructuredConsultation(memory, currentReq, lang);
  }

  // 5. Handle standard simple queries concisely
  // Handle Greetings
  if (/^(hi|hello|hey|namaste|greetings|hola|good morning|good afternoon|good evening)$/i.test(normalized)) {
    let reply = '';
    if (lang === 'hinglish') {
      reply = `Hello! 👋 Main **Novee** hoon, PrimeNova Studio ka AI Website Consultant.\n\nAap kis specific business ya website idea ke liye pricing aur features explore karna chahte ho? (jaise Gym, Restaurant, E-commerce, Portfolio, etc.)`;
    } else if (lang === 'hindi') {
      reply = `नमस्ते! 👋 मैं **Novee** हूँ, PrimeNova Studio का AI वेबसाइट कंसल्टेंट।\n\nआप किस व्यवसाय या वेबसाइट विचार के लिए सुविधाएँ और लागत जानना चाहते हैं?`;
    } else {
      reply = `Hello! 👋 I'm **Novee**, your AI Website Consultant at PrimeNova Studio.\n\nTell me about your business or project idea (e.g. Gym, Restaurant, E-commerce, Portfolio), and I'll outline the ideal structure, features, and cost estimate for you!`;
    }
    return {
      text: reply,
      followUpQuestions: ['Gym website estimate?', 'E-commerce platform?'],
      suggestionChips: ['Estimate Website Cost', 'AI Consultation', 'Portfolio Projects'],
      intent: 'greeting',
    };
  }

  // Handle Portfolio queries
  if (normalized.includes('portfolio') || normalized.includes('projects') || normalized.includes('work') || normalized.includes('faiz')) {
    let reply = '';
    const projNames = portfolioData.projects.map((p) => `• **${p.title}** (${p.category})`).join('\n');
    if (lang === 'hinglish') {
      reply = `Haan bilkul! PrimeNova Studio aur Faiz ke featured projects yahan se explore kar sakte ho:\n\n${projNames}\n\nAap Inme se kis type ka project apne business ke liye build karwana chahte ho?`;
    } else {
      reply = `Here are some of PrimeNova Studio's recent featured engineering projects:\n\n${projNames}\n\nWhich type of project aligns with your vision?`;
    }
    return {
      text: reply,
      followUpQuestions: ['Tell me about the Task App', 'View E-Commerce Platform'],
      suggestionChips: ['Portfolio Projects', 'Estimate Website Cost'],
      intent: 'portfolio',
    };
  }

  // Handle Pricing queries
  if (normalized.includes('price') || normalized.includes('pricing') || normalized.includes('cost') || normalized.includes('rate') || normalized.includes('kitna paisa')) {
    let reply = '';
    if (lang === 'hinglish') {
      reply = `PrimeNova Studio mein hum 3 flexible tiers offer karte hain:\n\n🔹 **Bronze (Starter Landing): ₹15,000 - ₹30,000** — Single/Multi-page responsive landing sites, lead forms, fast performance.\n🔹 **Silver (Dynamic Web App): ₹40,000 - ₹80,000** — MongoDB database, authentication, admin dashboard, dynamic CMS.\n🔹 **Gold (Enterprise Platform): ₹1,00,000+** — Payment gateways, real-time analytics, custom AI integrations.\n\n*Note:* Agar aapka specific budget (jaise ₹10,000) hai, toh mujhe aapki requirements batao, hum scope ko aapke budget mein adjust kar sakte hain!`;
    } else {
      reply = `At PrimeNova Studio, we structure transparent project packages:\n\n🔹 **Bronze Tier (Starter): ₹15,000 - ₹30,000** — Responsive design, high performance, lead capture forms.\n🔹 **Silver Tier (Professional): ₹40,000 - ₹80,000** — Dynamic database, user authentication, custom admin dashboard.\n🔹 **Gold Tier (Enterprise): ₹1,00,000+** — Payment processing, microservices, AI pipelines.\n\nTell me your specific project requirements or budget, and I'll tailor the exact scope for you!`;
    }
    return {
      text: reply,
      followUpQuestions: ['Bronze Tier scope?', 'Can we fit in ₹10k budget?'],
      suggestionChips: ['Estimate Website Cost', 'Generate Proposal'],
      intent: 'pricing',
    };
  }

  // Fallback for short general queries
  let fallbackText = '';
  if (lang === 'hinglish') {
    fallbackText = `Main samajh gaya! Aapko **${input}** ke baare mein guidance chahiye.\n\nMujhe bas thodi details bataiye — aapki website kis type ki hai (jaise Gym, Restaurant, E-commerce, Portfolio), aur usme kya key features (jaise booking, forms, admin panel) chahiye? Main aapko exact structure aur estimate bataunga!`;
  } else if (lang === 'hindi') {
    fallbackText = `मैं समझ गया! कृपया मुझे अपने प्रोजेक्ट का प्रकार (जैसे जिम, रेस्टोरेंट, ई-कॉमर्स) और आवश्यक सुविधाएं बताएं, ताकि मैं आपको सटीक लागत और संरचना बता सकूं।`;
  } else {
    fallbackText = `I understand! Tell me a bit more about your project idea—such as the business type (Gym, Restaurant, E-commerce, Portfolio) and key features required (e.g. booking, forms, payment gateway). I'll generate a complete custom consultation for you!`;
  }

  return {
    text: fallbackText,
    followUpQuestions: ['Gym website guidance', 'E-commerce website guidance'],
    suggestionChips: getInitialChips(memory),
    intent: 'fallback',
  };
}
