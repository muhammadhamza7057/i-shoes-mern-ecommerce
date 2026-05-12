import { useEffect } from 'react';

export default function useGsapScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let ctx = null;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
      .then(([gsapModule, scrollModule]) => {
        const gsap = (gsapModule && (gsapModule.default || gsapModule));
        const ScrollTrigger = (scrollModule && (scrollModule.default || scrollModule));
        if (!gsap) return;
        if (ScrollTrigger && gsap.registerPlugin) gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          const els = document.querySelectorAll('[data-gsap-reveal]');
          els.forEach((el) => {
            gsap.fromTo(
              el,
              { autoAlpha: 0, y: 32, scale: 0.995 },
              {
                duration: 1.1,
                autoAlpha: 1,
                y: 0,
                scale: 1,
                ease: 'power3.out',
                overwrite: true,
                scrollTrigger: {
                  trigger: el,
                  start: 'top 85%',
                  end: 'bottom 20%',
                  toggleActions: 'play none none reverse',
                  markers: false,
                },
              }
            );
          });
        });
      })
      .catch((err) => {
        // failsafe - GSAP not critical
        console.warn('GSAP not loaded:', err);
      });

    return () => {
      try {
        if (ctx && typeof ctx.revert === 'function') ctx.revert();
      } catch (e) {}
    };
  }, []);
}
