import { useEffect, useState } from 'react'
import { MEDIA_QUERIES } from '../constants/breakpoints'

/**
 * Reactive breakpoint detection via matchMedia (no scroll/resize listeners).
 *
 * Returns { isMobile, isTablet, isDesktop } — derived booleans re-render
 * only when a breakpoint boundary is crossed, not on every resize event.
 *
 * SSR-safe: defaults to desktop on the server.
 */
export function useResponsive() {
  const [breakpoint, setBreakpoint] = useState(() => {
    if (typeof window === 'undefined') return 'desktop'
    if (window.matchMedia(MEDIA_QUERIES.isMobile).matches) return 'mobile'
    if (window.matchMedia(MEDIA_QUERIES.isTablet).matches) return 'tablet'
    return 'desktop'
  })

  useEffect(() => {
    const mobileMql = window.matchMedia(MEDIA_QUERIES.isMobile)
    const tabletMql = window.matchMedia(MEDIA_QUERIES.isTablet)

    const compute = () => {
      if (mobileMql.matches) setBreakpoint('mobile')
      else if (tabletMql.matches) setBreakpoint('tablet')
      else setBreakpoint('desktop')
    }

    compute()
    mobileMql.addEventListener('change', compute)
    tabletMql.addEventListener('change', compute)

    return () => {
      mobileMql.removeEventListener('change', compute)
      tabletMql.removeEventListener('change', compute)
    }
  }, [])

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
  }
}

export default useResponsive
