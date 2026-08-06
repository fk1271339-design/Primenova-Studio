// ═══════════════════════════════════════════════════════════════
// config.ts — Centralized Frontend Configuration
// ═══════════════════════════════════════════════════════════════
// Default: sab kuch SAME-ORIGIN chalta hai (frontend + backend dono
// ek hi Spring Boot server :8080 se). Koi extra server/nginx nahi.
//
// Alag setup (e.g. frontend nginx pe, backend alag) ke liye .env me set karo:
//   VITE_API_URL=/api
//   VITE_BACKEND_ORIGIN=https://api.primenova.studio

/** Backend REST API base URL (fetch calls ke liye). */
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';

/**
 * Backend origin — OAuth2 login redirects ke liye (sirf origin, no /api).
 * Default '' = same-origin: app jis host/port se khuli hai, backend wahi
 * mana jata hai. Isliye single-server pe OAuth hamesha sahi jagah jata hai.
 */
export const BACKEND_ORIGIN: string =
  (import.meta.env.VITE_BACKEND_ORIGIN as string | undefined) ?? '';
