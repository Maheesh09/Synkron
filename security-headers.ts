/**
 * HTTP security headers for every route (HTML, assets, server functions).
 *
 * Applied through Nitro `routeRules` in vite.config.ts, so the same policy is
 * used on Vercel (Nitro writes it into the platform routing config, which also
 * covers static files served from the CDN) and on the Node server output.
 *
 * Every external origin below is there for a reason. If you add a new
 * third-party script, API, font or embed, add its origin to the matching
 * directive, or the browser will block it.
 */

const FIREBASE_AUTH_DOMAIN = "synkron-497817.firebaseapp.com";

function originOf(url: string | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

export function buildContentSecurityPolicy(apiUrl?: string): string {
  const api = originOf(apiUrl);

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    // 'unsafe-inline': TanStack Start streams inline hydration scripts and the
    //   page has an inline JSON-LD block. (Next step: per-request nonces.)
    // apis.google.com: Firebase Auth loads gapi for signInWithPopup.
    "script-src": ["'self'", "'unsafe-inline'", "https://apis.google.com"],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
    "img-src": [
      "'self'",
      "data:",
      "blob:",
      "https://avatars.githubusercontent.com",
      "https://*.googleusercontent.com",
    ],
    "connect-src": [
      "'self'",
      ...(api ? [api] : []),
      "https://identitytoolkit.googleapis.com",
      "https://securetoken.googleapis.com",
      "https://www.googleapis.com",
      "https://apis.google.com",
    ],
    // Firebase Auth's hidden helper iframe lives on the auth domain.
    "frame-src": [`https://${FIREBASE_AUTH_DOMAIN}`],
    "worker-src": ["'self'", "blob:"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    "upgrade-insecure-requests": [],
  };

  return Object.entries(directives)
    .map(([name, values]) => [name, ...values].join(" "))
    .join("; ");
}

export function securityHeaders(apiUrl?: string): Record<string, string> {
  return {
    "Content-Security-Policy": buildContentSecurityPolicy(apiUrl),
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains",
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy":
      "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()",
    // same-origin would cut the link to the GitHub sign-in popup.
    "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    "X-Permitted-Cross-Domain-Policies": "none",
  };
}
