/**
 * Contact-form validation rules. The server (netlify/functions/contact.mjs)
 * applies the same rules — keep both in sync.
 */
export const VALIDATION = {
  /** Letters (any script), spaces, apostrophes, hyphens, periods. */
  namePattern: /^[\p{L}\p{M}\s'’.-]+$/u,
  /** Pragmatic email check, mirrored server-side. */
  emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  /** 8-digit local phone number (Tunisia). */
  phonePattern: /^\d{8}$/,
  /** Server hard limit is 5,000 chars. */
  maxMessageLength: 5000,
}
