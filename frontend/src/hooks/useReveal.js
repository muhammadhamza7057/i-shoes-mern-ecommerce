import { useEffect } from 'react';

// Simple IntersectionObserver hook to add .revealed class to elements with [data-reveal]
export function initReveal(rootMargin = '0px 0px -8% 0px') {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return () => {};

  const nodes = Array.from(document.querySelectorAll('[data-reveal]'));
  if (!nodes.length) return () => {};

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin, threshold: 0.12 }
  );

  nodes.forEach((n) => obs.observe(n));

  return () => obs.disconnect();
}

export default function useReveal(rootMargin = '0px 0px -8% 0px') {
  useEffect(() => {
    const cleanup = initReveal(rootMargin);
    return () => cleanup && cleanup();
  }, [rootMargin]);
}
