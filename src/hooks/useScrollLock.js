import { useEffect } from 'react';
import { getLenis } from '../motion/lenisStore';

let lockCount = 0;
let previousBodyStyles;

function acquireScrollLock() {
  if (lockCount === 0) {
    previousBodyStyles = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      const currentPadding = Number.parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';
    getLenis()?.stop();
  }

  lockCount += 1;

  return () => {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount !== 0 || !previousBodyStyles) return;

    document.body.style.overflow = previousBodyStyles.overflow;
    document.body.style.paddingRight = previousBodyStyles.paddingRight;
    previousBodyStyles = null;
    getLenis()?.start();
  };
}

export default function useScrollLock(isOpen, containerRef) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const container = containerRef?.current;
    const affectedRegions = container
      ? [
        container,
        ...container.querySelectorAll(
          '.modal-scroll-region, .pdf-modal__body, .project-modal__content, .event-modal__content, .skills-subscreen',
        ),
      ]
      : [];
    const previousRegionAttributes = affectedRegions.map((region) => ({
      region,
      hadLenisPrevent: region.hasAttribute('data-lenis-prevent'),
      tabIndex: region.getAttribute('tabindex'),
    }));

    affectedRegions.forEach((region) => {
      region.setAttribute('data-lenis-prevent', '');
      if (region.matches('.modal-scroll-region, .pdf-modal__body, .project-modal__content, .event-modal__content, .skills-subscreen') && !region.hasAttribute('tabindex')) {
        region.setAttribute('tabindex', '0');
      }
    });

    const releaseScrollLock = acquireScrollLock();

    return () => {
      previousRegionAttributes.forEach(({ region, hadLenisPrevent, tabIndex }) => {
        if (!hadLenisPrevent) region.removeAttribute('data-lenis-prevent');
        if (tabIndex === null) {
          region.removeAttribute('tabindex');
        } else {
          region.setAttribute('tabindex', tabIndex);
        }
      });
      releaseScrollLock();
    };
  }, [isOpen, containerRef]);
}
