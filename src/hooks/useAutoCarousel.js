import { useCallback, useEffect, useMemo, useState } from 'react';

const getSource = (image) => (typeof image === 'string' ? image : image?.src);

export default function useAutoCarousel(images, intervalMs = 1500) {
  const imageCount = Array.isArray(images) ? images.length : 0;
  const sourceKey = (Array.isArray(images) ? images.map(getSource).filter(Boolean) : []).join('\u0000');
  const imageSources = useMemo(
    () => (sourceKey ? sourceKey.split('\u0000') : []),
    [sourceKey],
  );
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState !== 'hidden',
  );
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [timerKey, setTimerKey] = useState(0);

  useEffect(() => {
    setIndex(0);
    setTimerKey((key) => key + 1);
  }, [sourceKey]);

  useEffect(() => {
    if (typeof Image === 'undefined') return undefined;

    const preloadedImages = imageSources.map((src) => {
      const image = new Image();
      image.src = src;
      return image;
    });

    return () => {
      preloadedImages.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, [imageSources]);

  useEffect(() => {
    const updateVisibility = () => setDocumentVisible(document.visibilityState !== 'hidden');
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', updatePreference);
    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  const selectIndex = useCallback((nextIndex) => {
    if (!imageCount) return;
    setIndex(((nextIndex % imageCount) + imageCount) % imageCount);
    setTimerKey((key) => key + 1);
  }, [imageCount]);

  const next = useCallback(() => selectIndex(index + 1), [index, selectIndex]);
  const previous = useCallback(() => selectIndex(index - 1), [index, selectIndex]);
  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback((event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsFocused(false);
    }
  }, []);

  useEffect(() => {
    if (imageCount < 2 || isHovered || isFocused || !documentVisible || reducedMotion) return undefined;

    const timerId = window.setTimeout(() => {
      setIndex((currentIndex) => (currentIndex + 1) % imageCount);
      setTimerKey((key) => key + 1);
    }, intervalMs);

    return () => window.clearTimeout(timerId);
  }, [documentVisible, imageCount, index, intervalMs, isFocused, isHovered, reducedMotion, timerKey]);

  return {
    index,
    selectIndex,
    next,
    previous,
    carouselProps: {
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      onFocusCapture: handleFocus,
      onBlurCapture: handleBlur,
    },
  };
}
