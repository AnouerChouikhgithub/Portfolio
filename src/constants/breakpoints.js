/**
 * Shared breakpoint constants — MUST match the media queries in src/styles.css.
 * Mobile-first: base styles target small screens, min-width queries scale up.
 *
 * CSS breakpoints (source of truth):
 *   --bp-sm: 480px   phones
 *   --bp-md: 768px   tablets
 *   --bp-lg: 1024px  small desktops
 */
export const BREAKPOINTS = {
  sm: 480,
  md: 768,
  lg: 1024,
}

/** Convenience media query strings for matchMedia. */
export const MEDIA_QUERIES = {
  isMobile: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  isTablet: `(min-width: ${BREAKPOINTS.sm}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`,
  isDesktop: `(min-width: ${BREAKPOINTS.md}px)`,
}
