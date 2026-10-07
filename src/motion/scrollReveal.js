import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

    window.addEventListener('load', () => ScrollTrigger.refresh());
    window.addEventListener('localechange', () => window.setTimeout(() => ScrollTrigger.refresh(), 300));
  });

  return () => ctx.revert();
}
