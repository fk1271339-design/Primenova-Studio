// ═══════════════════════════════════════════════════════════════
// chatPersistenceService.ts — Backend memory sync for Nova AI
// Saves/restores conversation context from MongoDB via backend.
// Only active for logged-in users; guests stay localStorage-only.
// ═══════════════════════════════════════════════════════════════

import { type NovaMemory, setMemory, getMemory } from './novaEngine';

// ─── CONFIG ──────────────────────────────────────────────────

const API_BASE = (import.meta.env.VITE_API_URL as string) || '/api';

// ─── AUTH TOKEN HELPER ────────────────────────────────────────

function getAuthToken(): string | null {
  try {
    // Try common storage keys for JWT token
    return (
      localStorage.getItem('accessToken') ||
      localStorage.getItem('token') ||
      sessionStorage.getItem('accessToken') ||
      null
    );
  } catch {
    return null;
  }
}

function isLoggedIn(): boolean {
  return Boolean(getAuthToken());
}

function authHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── SESSION ID MANAGEMENT ────────────────────────────────────

const SESSION_KEY = 'nova_active_session_id';

function getActiveSessionId(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

function setActiveSessionId(id: string): void {
  localStorage.setItem(SESSION_KEY, id);
}

// ─── ENSURE SESSION EXISTS ────────────────────────────────────

export async function ensureActiveSession(): Promise<string | null> {
  if (!isLoggedIn()) return null;

  // Use cached session ID if available
  const cached = getActiveSessionId();
  if (cached) return cached;

  try {
    const res = await fetch(`${API_BASE}/chat/sessions/ensure-active`, {
      method: 'POST',
      headers: authHeaders(),
    });

    if (!res.ok) return null;
    const session = (await res.json()) as { id: string };
    setActiveSessionId(session.id);
    return session.id;
  } catch {
    return null;
  }
}

// ─── SAVE NOVA MEMORY TO BACKEND ─────────────────────────────

let saveDebounceTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Debounced save — batches rapid memory updates into one backend call.
 * Waits 2 seconds after last update before saving.
 */
export function scheduleSaveMemory(memory: NovaMemory): void {
  if (!isLoggedIn()) return;

  if (saveDebounceTimer) clearTimeout(saveDebounceTimer);

  saveDebounceTimer = setTimeout(() => {
    void saveMemoryToBackend(memory);
  }, 2000);
}

async function saveMemoryToBackend(memory: NovaMemory): Promise<void> {
  if (!isLoggedIn()) return;

  try {
    let sessionId = getActiveSessionId();
    if (!sessionId) {
      sessionId = await ensureActiveSession();
      if (!sessionId) return;
    }

    await fetch(`${API_BASE}/chat/sessions/${sessionId}/nova-memory`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({
        userName: memory.userName,
        projectType: memory.projectType,
        industry: memory.industry,
        budget: memory.budget,
        timeline: memory.timeline,
        productType: memory.productType,
        preferredTech: memory.preferredTech,
        extractedFeatures: memory.extractedFeatures,
        discussedServices: memory.discussedServices,
        conversationStage: memory.conversationStage,
        preferredLanguage: memory.preferredLanguage,
        decisions: memory.decisions,
      }),
    });
  } catch {
    // Fail silently — localStorage is still the source of truth
  }
}

// ─── SAVE MESSAGE TO BACKEND ──────────────────────────────────

export async function saveMessageToBackend(
  sender: 'user' | 'ai',
  text: string
): Promise<void> {
  if (!isLoggedIn()) return;

  try {
    let sessionId = getActiveSessionId();
    if (!sessionId) {
      sessionId = await ensureActiveSession();
      if (!sessionId) return;
    }

    await fetch(`${API_BASE}/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ sender, text }),
    });
  } catch {
    // Fail silently
  }
}

// ─── RESTORE NOVA MEMORY FROM BACKEND ────────────────────────

interface BackendMemorySnapshot {
  sessionId?: string;
  userName?: string;
  projectType?: string;
  industry?: string;
  budget?: string;
  timeline?: string;
  productType?: string;
  preferredTech?: string;
  extractedFeatures?: string[];
  discussedServices?: string[];
  conversationStage?: string;
  preferredLanguage?: string;
  decisions?: Record<string, string>;
}

/**
 * Loads Nova memory from backend and merges into localStorage.
 * Called once on app mount for logged-in users.
 * Backend wins for context fields; localStorage wins for message count etc.
 */
export async function restoreMemoryFromBackend(): Promise<boolean> {
  if (!isLoggedIn()) return false;

  try {
    const res = await fetch(`${API_BASE}/chat/sessions/latest/nova-memory`, {
      headers: authHeaders(),
    });

    if (!res.ok) return false;

    const snapshot = (await res.json()) as BackendMemorySnapshot;

    // Save session ID for future saves
    if (snapshot.sessionId) {
      setActiveSessionId(snapshot.sessionId);
    }

    // Only restore if there's meaningful data
    const hasData =
      snapshot.userName ||
      snapshot.projectType ||
      snapshot.industry ||
      snapshot.budget;

    if (!hasData) return false;

    const currentMemory = getMemory();
    const merged: NovaMemory = {
      ...currentMemory,
      userName: snapshot.userName ?? currentMemory.userName,
      projectType: snapshot.projectType ?? currentMemory.projectType,
      industry: snapshot.industry ?? currentMemory.industry,
      budget: snapshot.budget ?? currentMemory.budget,
      timeline: snapshot.timeline ?? currentMemory.timeline,
      productType: snapshot.productType ?? currentMemory.productType,
      preferredTech: snapshot.preferredTech ?? currentMemory.preferredTech,
      extractedFeatures:
        snapshot.extractedFeatures && snapshot.extractedFeatures.length > 0
          ? snapshot.extractedFeatures
          : currentMemory.extractedFeatures,
      discussedServices:
        snapshot.discussedServices && snapshot.discussedServices.length > 0
          ? snapshot.discussedServices
          : currentMemory.discussedServices,
      conversationStage:
        (snapshot.conversationStage as NovaMemory['conversationStage']) ??
        currentMemory.conversationStage,
      preferredLanguage:
        (snapshot.preferredLanguage as NovaMemory['preferredLanguage']) ??
        currentMemory.preferredLanguage,
      decisions: snapshot.decisions ?? currentMemory.decisions,
    };

    setMemory(merged);
    return true;
  } catch {
    return false;
  }
}

// ─── NEW CHAT — CLEAR & CREATE FRESH SESSION ─────────────────

export async function startNewBackendSession(): Promise<void> {
  if (!isLoggedIn()) return;

  localStorage.removeItem(SESSION_KEY);

  try {
    const res = await fetch(`${API_BASE}/chat/sessions`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ title: 'New Conversation' }),
    });

    if (res.ok) {
      const session = (await res.json()) as { id: string };
      setActiveSessionId(session.id);
    }
  } catch {
    // ignore
  }
}
