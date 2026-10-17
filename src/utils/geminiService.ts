// ═══════════════════════════════════════════════════════════════
// geminiService.ts — Google Gemini AI integration for Nova
// Hybrid approach: Nova Engine extracts context, Gemini generates
// natural language responses with full PrimeNova knowledge.
// ═══════════════════════════════════════════════════════════════

import { type NovaMemory, type SimpleMessage } from './novaEngine';
import { SERVICES, PRICING_TIERS, COST_COMPONENTS, ABOUT_PRIMENOVA } from './novaKnowledge';

// ─── CONFIG ──────────────────────────────────────────────────

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const GEMINI_MODEL = 'gemini-1.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const GEMINI_STREAM_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent`;

export const isGeminiEnabled = (): boolean =>
  Boolean(GEMINI_API_KEY && GEMINI_API_KEY.trim().length > 10);

// ─── SYSTEM PROMPT BUILDER ───────────────────────────────────

function buildSystemPrompt(memory: NovaMemory): string {
  const servicesText = SERVICES.map(
    s =>
      `• ${s.name}: ${s.description} | Starting: ${s.startingPrice} | Timeline: ${s.timeline}`
  ).join('\n');

  const pricingText = PRICING_TIERS.map(
    t => `• ${t.name} Tier (${t.price}): ${t.bestFor} | Features: ${t.features.join(', ')}`
  ).join('\n');

  const costText = COST_COMPONENTS.map(
    c => `• ${c.name}: ₹${c.price.toLocaleString('en-IN')} — ${c.description}`
  ).join('\n');

  const contextSection = buildContextSection(memory);

  return `You are **Novee**, the official AI assistant of **PrimeNova Studio** — a premium design and development agency based in India.

## Your Personality
- You are warm, friendly, witty, and extremely knowledgeable about web development, design, and digital products.
- You speak naturally — adapt to the user's language: if they speak Hinglish (mix of Hindi + English), reply in Hinglish. If Hindi, reply in Hindi. If English, reply in English.
- You are a consultant, not just a chatbot. You ask smart follow-up questions and guide users toward the right solution.
- You are enthusiastic but never pushy. You give real value, not sales pitches.
- Keep responses concise and conversational. Use bullet points and **bold** for key info.
- Use occasional emojis to feel human and engaging (but don't overdo it).

## About PrimeNova Studio
- **Founder:** ${ABOUT_PRIMENOVA.founder}
- **Tagline:** "${ABOUT_PRIMENOVA.tagline}"
- **Description:** ${ABOUT_PRIMENOVA.description}
- **Stats:** ${ABOUT_PRIMENOVA.stats.brandsBuilt} brands built, ${ABOUT_PRIMENOVA.stats.satisfactionRate} satisfaction rate
- **Contact:** ${ABOUT_PRIMENOVA.contact.email} | ${ABOUT_PRIMENOVA.contact.website}

## Services We Offer
${servicesText}

## Pricing Tiers
${pricingText}

## Cost Components (for estimates)
${costText}

## Your Rules
1. ONLY discuss PrimeNova Studio's services, projects, pricing, and capabilities.
2. For any project inquiry, gather: type of project, industry, key features, budget, timeline.
3. When enough info is gathered, proactively give cost estimates using the cost components above.
4. Always end with a clear CTA: get a quote, WhatsApp, or email.
5. Never make up fake portfolio projects — only mention that we have relevant experience.
6. For contact, direct users to: WhatsApp, email (${ABOUT_PRIMENOVA.contact.email}), or the Contact page.
7. If a question is completely unrelated to digital products/business, politely redirect.

${contextSection}`;
}

function buildContextSection(memory: NovaMemory): string {
  const parts: string[] = ['## Current Conversation Context'];

  if (memory.userName) parts.push(`- **User name:** ${memory.userName}`);
  if (memory.projectType) parts.push(`- **Project type:** ${memory.projectType}`);
  if (memory.industry) parts.push(`- **Industry:** ${memory.industry}`);
  if (memory.productType) parts.push(`- **Product type:** ${memory.productType}`);
  if (memory.budget) parts.push(`- **Budget:** ${memory.budget}`);
  if (memory.timeline) parts.push(`- **Timeline:** ${memory.timeline}`);
  if (memory.preferredTech) parts.push(`- **Preferred tech:** ${memory.preferredTech}`);
  if (memory.extractedFeatures.length > 0) {
    parts.push(`- **Features requested:** ${memory.extractedFeatures.join(', ')}`);
  }
  if (memory.discussedServices.length > 0) {
    parts.push(`- **Discussed services:** ${memory.discussedServices.join(', ')}`);
  }
  parts.push(`- **Conversation stage:** ${memory.conversationStage}`);
  parts.push(`- **Message count:** ${memory.messageCount}`);

  if (parts.length === 1) {
    parts.push('- This is a new conversation. Start with a warm greeting.');
  }

  return parts.join('\n');
}

// ─── TYPES ──────────────────────────────────────────────────

interface GeminiContent {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface GeminiRequest {
  system_instruction: { parts: { text: string }[] };
  contents: GeminiContent[];
  generationConfig: {
    temperature: number;
    topK: number;
    topP: number;
    maxOutputTokens: number;
  };
  safetySettings: {
    category: string;
    threshold: string;
  }[];
}

interface GeminiResponse {
  candidates: {
    content: { parts: { text: string }[]; role: string };
    finishReason: string;
  }[];
  error?: { message: string; code: number };
}

// ─── HISTORY BUILDER ────────────────────────────────────────

function buildGeminiHistory(history: SimpleMessage[]): GeminiContent[] {
  // Keep last 12 messages for context (token limits)
  const recent = history.slice(-12);
  return recent.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));
}

// ─── MAIN GEMINI CALL ────────────────────────────────────────

export interface GeminiResult {
  text: string;
  success: boolean;
  error?: string;
}

export async function callGemini(
  userMessage: string,
  memory: NovaMemory,
  history: SimpleMessage[]
): Promise<GeminiResult> {
  if (!isGeminiEnabled()) {
    return { text: '', success: false, error: 'Gemini API key not configured' };
  }

  const systemPrompt = buildSystemPrompt(memory);
  const geminiHistory = buildGeminiHistory(history);

  const requestBody: GeminiRequest = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      ...geminiHistory,
      {
        role: 'user',
        parts: [{ text: userMessage }],
      },
    ],
    generationConfig: {
      temperature: 0.75,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const data = (await response.json()) as GeminiResponse;

    if (!response.ok || data.error) {
      const errMsg = data.error?.message ?? `HTTP ${response.status}`;
      console.warn('[Novee] Gemini API error:', errMsg);
      return { text: '', success: false, error: errMsg };
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    if (!text) {
      return { text: '', success: false, error: 'Empty response from Gemini' };
    }

    return { text: text.trim(), success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Network error';
    console.warn('[Novee] Gemini fetch error:', msg);
    return { text: '', success: false, error: msg };
  }
}

// ─── STREAMING SUPPORT ───────────────────────────────────────

export async function streamGemini(
  userMessage: string,
  memory: NovaMemory,
  history: SimpleMessage[],
  onChunk: (chunk: string) => void,
  onDone: (fullText: string) => void,
  onError: (error: string) => void
): Promise<void> {
  if (!isGeminiEnabled()) {
    onError('Gemini API key not configured');
    return;
  }

  const systemPrompt = buildSystemPrompt(memory);
  const geminiHistory = buildGeminiHistory(history);

  const requestBody: GeminiRequest = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [
      ...geminiHistory,
      { role: 'user', parts: [{ text: userMessage }] },
    ],
    generationConfig: {
      temperature: 0.75,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  };

  try {
    const response = await fetch(
      `${GEMINI_STREAM_URL}?key=${GEMINI_API_KEY}&alt=sse`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok || !response.body) {
      onError(`HTTP ${response.status}`);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const jsonStr = line.slice(6).trim();
        if (!jsonStr || jsonStr === '[DONE]') continue;

        try {
          const parsed = JSON.parse(jsonStr) as GeminiResponse;
          const chunk = parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
          if (chunk) {
            fullText += chunk;
            onChunk(chunk);
          }
        } catch {
          // skip malformed SSE chunks
        }
      }
    }

    onDone(fullText);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Stream error';
    onError(msg);
  }
}

// ─── SMART SUGGESTION CHIP GENERATOR ───────────────────────

export async function generateSmartChips(
  memory: NovaMemory,
  lastResponse: string
): Promise<string[]> {
  if (!isGeminiEnabled()) return [];

  const prompt = `Based on this conversation context and last AI response, suggest exactly 4 short, actionable follow-up options for the user. Make them relevant, specific, and natural. Return ONLY a JSON array of 4 strings, nothing else.

Context:
- Industry: ${memory.industry ?? 'unknown'}
- Stage: ${memory.conversationStage}
- Budget: ${memory.budget ?? 'not set'}
- Features: ${memory.extractedFeatures.join(', ') || 'none discussed'}
- Language preference: ${memory.preferredLanguage ?? 'english'}

Last AI response excerpt: "${lastResponse.slice(0, 300)}"`;

  try {
    const result = await callGemini(prompt, { ...memory, messageCount: 0 }, []);
    if (!result.success) return [];

    const match = result.text.match(/\[[\s\S]*?\]/);
    if (match) {
      const chips = JSON.parse(match[0]) as string[];
      if (Array.isArray(chips) && chips.length > 0) {
        return chips.slice(0, 4).map((c: string) => String(c));
      }
    }
  } catch {
    // ignore, fallback to engine chips
  }

  return [];
}
