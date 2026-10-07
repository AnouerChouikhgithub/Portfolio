import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Exposed for QA scripts (assert trigger counts are stable across
// theme/language toggles). Harmless in production: read-only handle.
if (typeof window !== 'undefined') {
  window.ScrollTrigger = ScrollTrigger;
}

export function initScrollReveal() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    return () => {};
  }

  const ctx = gsap.context(() => {
    gsap.utils.toArray('.section__title').forEach((element) => {
      gsap.fromTo(
        element,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            toggleActions: 'play none play reverse',
          },
        },
      );

      gsap.to(element, {
        '--line': 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
          toggleActions: 'play none play reverse',
        },
      });
    });

    gsap.utils.toArray('.about__image-wrapper').forEach((element) => {
      gsap.fromTo(
        element,
        { clipPath: 'circle(0% at center)', autoAlpha: 0.6 },
        {
          clipPath: 'circle(75% at center)',
          autoAlpha: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            toggleActions: 'play none play reverse',
          },
        },
      );
    });

    gsap.utils.toArray('.about__intro, .about__mission').forEach((element, index) => {
      gsap.fromTo(
        element,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          delay: index * 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            toggleActions: 'play none play reverse',
          },
        },
      );
    });

    gsap.utils.toArray('.skills__subtitle, .skills__tags').forEach((element) => {
      gsap.fromTo(
        element,
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            toggleActions: 'play none play reverse',
          },
        },
      );
    });

    const revealCards = gsap.utils.toArray('.skills__experience-card, .skills-group-card, .project-card, .community-card, .events-card');

    const revealCard = (element) => {
      if (!element) {
        return;
      }

      element.classList.add('is-animating');
      gsap.fromTo(
        element,
        { autoAlpha: 0, y: 32, scale: 0.98 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          ease: 'power3.out',
          onComplete: () => {
            element.classList.remove('is-animating');
            gsap.set(element, { clearProps: 'transform,opacity,scale' });
          },
        },
      );
    };

    ScrollTrigger.batch(revealCards, {
      interval: 0.1,
      batchMax: 6,
      onEnter: (elements) => {
        elements.forEach(revealCard);
      },
      onEnterBack: (elements) => {
        elements.forEach(revealCard);
      },
    });

    gsap.utils.toArray('.contact__form, .footer__content').forEach((element) => {
      gsap.fromTo(
        element,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 88%',
            toggleActions: 'play none play reverse',
          },
        },
      );
    });

    // ── Section identity parallax (transform only, scrubbed) ──────────
    // GSAP owns the parallax wrapper; the inner .section-background__motion
    // keeps its own CSS drift, so no two libraries animate one property.
    const scrubParallax = (selector, fromVars, toVars) => {
      gsap.utils.toArray(selector).forEach((element) => {
        const section = element.closest('section, footer');
        if (!section) return;
        gsap.fromTo(element, fromVars, {
          ...toVars,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    };

    // Projects: diagonal blueprint hatch drifts slowly across the band.
    scrubParallax(
      '.section-background--projects .section-background__parallax',
      { yPercent: -4 },
      { yPercent: 4 },
    );

    // Events: film-strip ruler slides horizontally (RTL just mirrors it).
    scrubParallax(
      '.section-background--events .section-background__parallax',
      { xPercent: -3 },
      { xPercent: 3 },
    );

    // About -> hero wipe: the tinted divider retracts as you scroll in.
    gsap.utils.toArray('.section-background__wipe').forEach((element) => {
      const section = element.closest('section');
      if (!section) return;
      gsap.fromTo(
        element,
        { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'top 35%',
            scrub: true,
          },
        },
      );
    });

    // Community constellation: lines draw on as the section scrolls by.
    gsap.utils.toArray('.section-background__constellation').forEach((svg) => {
      const section = svg.closest('section');
      if (!section) return;
      const lines = svg.querySelectorAll('line');
      const dots = svg.querySelectorAll('circle');
      lines.forEach((line) => {
        const length = line.getTotalLength ? line.getTotalLength() : 1200;
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
      });
      gsap.to(lines, {
        strokeDashoffset: 0,
        ease: 'none',
        stagger: 0.04,
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'center 55%',
          scrub: true,
        },
      });
      gsap.to(dots, {
        opacity: 0.5,
        ease: 'none',
        stagger: 0.05,
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'center 55%',
          scrub: true,
        },
      });
    });

    // Layout settles after fonts/images: re-measure trigger positions.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    window.addEventListener('localechange', () => window.setTimeout(refresh, 300));
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    document.querySelectorAll('img').forEach((image) => {
      if (!image.complete) image.addEventListener('load', refresh, { once: true });
    });
  });

  return () => ctx.revert();
}
