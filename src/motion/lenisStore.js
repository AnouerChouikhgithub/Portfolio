let lenisInstance = null;

export function setLenis(instance) {
  lenisInstance = instance;
}

export function getLenis() {
  return lenisInstance;
}

export function scrollToId(id) {
  const target = typeof id === 'string' ? document.getElementById(id.replace(/^#/, '')) : id;
  if (!target) {
    return false;
  }

  const lenis = getLenis();
  if (lenis) {
    const offset = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scroll-offset')) || 84;
    lenis.scrollTo(target, { offset: -offset, force: true });
    return true;
  }

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
}
