import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Detect fine pointer (mouse) once at module level — avoids repeated media query calls
const hasFinePointer =
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Cursor variant config — simplified: no text labels, just size changes
// Per requirements: minimal, smooth trailing effect, subtle hover scale only
const VARIANT_CONFIG = {
  default: { outerScale: 1,   innerScale: 1   },
  link:    { outerScale: 1.6, innerScale: 0.5 },
  view:    { outerScale: 2.2, innerScale: 0   },
  button:  { outerScale: 1.8, innerScale: 1.2 },
  drag:    { outerScale: 2.0, innerScale: 0.5 },
  cart:    { outerScale: 2.2, innerScale: 0   },
  success: { outerScale: 2.8, innerScale: 0   },
};

const MotionSystem = () => {
  // ─── Cursor position (raw + spring-smoothed) ───────────────────────────────
  const rawX = useMotionValue(-200);
  const rawY = useMotionValue(-200);

  // Two-tier spring: outer ring is slower (trailing feel), inner dot is snappy
  const outerX = useSpring(rawX, { stiffness: 180, damping: 28, mass: 0.6 });
  const outerY = useSpring(rawY, { stiffness: 180, damping: 28, mass: 0.6 });
  const innerX = useSpring(rawX, { stiffness: 520, damping: 32, mass: 0.18 });
  const innerY = useSpring(rawY, { stiffness: 520, damping: 32, mass: 0.18 });

  // ─── Cursor state ───────────────────────────────────────────────────────────
  const [state, setState] = useState({
    visible: false,
    variant: 'default',
    accentColor: '#00FF88',
  });

  const stateRef = { current: state }; // lightweight ref replacement — no re-render needed

  // ─── Burst helper
  const triggerBurst = useCallback((color = '#00FF88') => {
    const el = document.createElement('div');
    el.className = 'cursor-burst-fx';
    el.style.cssText = `left:${rawX.get()}px;top:${rawY.get()}px;--burst-color:${color}`;
    document.body.appendChild(el);
    gsap.fromTo(
      el,
      { scale: 0.3, opacity: 1 },
      {
        scale: 3.2,
        opacity: 0,
        duration: 0.65,
        ease: 'power2.out',
        onComplete: () => el.remove(),
      }
    );
  }, [rawX, rawY]);

  // ─── Pointer tracking ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!hasFinePointer) return;

    const onMove = (e) => {
      let x = e.clientX;
      let y = e.clientY;

      // Magnetic pull: if hovering a [data-magnetic] element, nudge cursor toward center
      const magnet = e.target.closest?.('[data-magnetic]');
      if (magnet) {
        const strength = parseFloat(magnet.dataset.magneticStrength || '0.18');
        const r = magnet.getBoundingClientRect();
        x += (r.left + r.width  / 2 - x) * strength;
        y += (r.top  + r.height / 2 - y) * strength;
      }

      rawX.set(x);
      rawY.set(y);

      // Determine variant from hovered element
      const target = e.target;
      const cursorEl = target.closest?.('[data-cursor]');
      const isButton = target.closest?.('button') && !cursorEl;
      const isLink   = target.closest?.('a')      && !cursorEl;

      let variant = 'default';

      if (cursorEl) {
        variant = cursorEl.dataset.cursor || 'view';
      } else if (isButton) {
        variant = 'button';
      } else if (isLink) {
        variant = 'link';
      }

      setState((prev) => ({
        ...prev,
        visible: true,
        variant,
      }));
    };

    const onLeave = () =>
      setState((prev) => ({ ...prev, visible: false, variant: 'default' }));

    // Cart success burst
    const onCartBurst = (e) => {
      const color = e.detail?.color || '#00FF88';
      setState((prev) => ({ ...prev, variant: 'success', accentColor: color }));
      triggerBurst(color);
      setTimeout(() => setState((prev) => ({ ...prev, variant: 'default' })), 900);
    };

    // Color preview (hover color swatch)
    const onColorPreview = (e) => {
      if (e.detail?.color) {
        setState((prev) => ({ ...prev, accentColor: e.detail.color }));
      }
    };

    window.addEventListener('pointermove',   onMove,         { passive: true });
    window.addEventListener('pointerleave',  onLeave);
    window.addEventListener('cursor-burst',  onCartBurst);
    window.addEventListener('color-preview', onColorPreview);

    return () => {
      window.removeEventListener('pointermove',   onMove);
      window.removeEventListener('pointerleave',  onLeave);
      window.removeEventListener('cursor-burst',  onCartBurst);
      window.removeEventListener('color-preview', onColorPreview);
    };
  }, [rawX, rawY, triggerBurst]);

  // ─── Magnetic element transform (DOM-level, GPU-friendly) ──────────────────
  useEffect(() => {
    if (!hasFinePointer) return;

    // Use event delegation on document instead of per-element listeners
    // so dynamically rendered elements (product cards, etc.) are covered
    const onMove = (e) => {
      const magnet = e.target.closest?.('[data-magnetic]');
      if (!magnet) return;
      const strength = parseFloat(magnet.dataset.magneticStrength || '0.22');
      const r = magnet.getBoundingClientRect();
      const ox = ((e.clientX - r.left) / r.width  - 0.5) * r.width  * strength;
      const oy = ((e.clientY - r.top)  / r.height - 0.5) * r.height * strength;
      magnet.style.transform = `translate3d(${ox}px,${oy}px,0)`;
    };

    const onLeave = (e) => {
      const magnet = e.target.closest?.('[data-magnetic]');
      if (magnet) {
        gsap.to(magnet, { x: 0, y: 0, duration: 0.45, ease: 'elastic.out(1,0.5)', overwrite: true });
        magnet.style.transform = '';
      }
    };

    document.addEventListener('pointermove',  onMove,  { passive: true });
    document.addEventListener('pointerleave', onLeave, { passive: true, capture: true });

    return () => {
      document.removeEventListener('pointermove',  onMove);
      document.removeEventListener('pointerleave', onLeave, { capture: true });
    };
  }, []);

  // ─── Lenis smooth scroll + GSAP ScrollTrigger ──────────────────────────────
  useEffect(() => {
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.075,
      wheelMultiplier: 1.1,
      smoothWheel: true,
      syncTouch: false,
    });

    const onScroll = ({ animatedScroll, limit }) => {
      const progress = limit > 0 ? animatedScroll / limit : 0;
      document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4));
      ScrollTrigger.update();
    };

    lenis.on('scroll', onScroll);

    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // ─── Don't render on touch/coarse devices or reduced-motion ────────────────
  if (!hasFinePointer || prefersReducedMotion) return null;

  const cfg = VARIANT_CONFIG[state.variant] || VARIANT_CONFIG.default;
  const accent = state.accentColor;

  return (
    <AnimatePresence>
      {state.visible && (
        <>
          {/* ── Outer trailing ring ─────────────────────────────────────── */}
          <motion.div
            aria-hidden="true"
            className="cursor-ring pointer-events-none fixed left-0 top-0 z-[9998]"
            style={{ x: outerX, y: outerY, willChange: 'transform' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="cursor-ring__circle"
              animate={{
                scale: cfg.outerScale,
                borderColor: state.variant === 'success'
                  ? accent
                  : state.variant === 'view' || state.variant === 'cart'
                    ? 'rgba(0,0,0,0.45)'
                    : 'rgba(0,0,0,0.14)',
                backgroundColor: state.variant === 'success'
                  ? `${accent}22`
                  : 'transparent',
              }}
              transition={{ type: 'spring', stiffness: 240, damping: 26 }}
            />
          </motion.div>

          {/* ── Inner snappy dot ────────────────────────────────────────── */}
          <motion.div
            aria-hidden="true"
            className="cursor-dot pointer-events-none fixed left-0 top-0 z-[9999]"
            style={{ x: innerX, y: innerY, willChange: 'transform' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <motion.div
              className="cursor-dot__core"
              animate={{
                scale: cfg.innerScale,
                backgroundColor: state.variant === 'success'
                  ? accent
                  : state.variant === 'button'
                    ? '#0b0b0b'
                    : accent,
                boxShadow: state.variant === 'success'
                  ? `0 0 18px 4px ${accent}88`
                  : `0 0 10px 2px ${accent}44`,
              }}
              transition={{ type: 'spring', stiffness: 480, damping: 28 }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MotionSystem;
