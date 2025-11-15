// script.js
// Handles mobile nav toggle, scroll reveal, marquee controls, and subtle parallax.
// Safe defaults for users who prefer reduced motion.

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* -------------------------
       Mobile navigation toggle
       ------------------------- */
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');

    function openNav() {
      if (!nav) return;
      toggle.setAttribute('aria-expanded', 'true');
      // Inline styles used so CSS media queries still control desktop layout
      nav.style.display = 'block';
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.right = '28px';
      nav.style.top = '72px';
      nav.style.background = 'rgba(255,255,255,0.95)';
      nav.style.padding = '12px';
      nav.style.borderRadius = '10px';
      nav.style.boxShadow = '0 10px 30px rgba(10,20,10,0.08)';
    }

    function closeNav() {
      if (!nav) return;
      toggle.setAttribute('aria-expanded', 'false');
      nav.style.display = '';
      nav.style.flexDirection = '';
      nav.style.position = '';
      nav.style.right = '';
      nav.style.top = '';
      nav.style.background = '';
      nav.style.padding = '';
      nav.style.borderRadius = '';
      nav.style.boxShadow = '';
    }

    if (toggle && nav) {
      toggle.addEventListener('click', (e) => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        if (expanded) closeNav();
        else openNav();
        e.stopPropagation();
      });

      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (nav.style.display === 'block' && !nav.contains(e.target) && !toggle.contains(e.target)) {
          closeNav();
        }
      });

      // Close on Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.style.display === 'block') {
          closeNav();
        }
      });
    }

    /* -------------------------
       Scroll reveal (IntersectionObserver)
       ------------------------- */
    const reveals = document.querySelectorAll('.reveal');
    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      reveals.forEach(el => io.observe(el));
    } else {
      // If reduced motion or no IO support, reveal everything immediately
      reveals.forEach(el => el.classList.add('visible'));
    }

    /* -------------------------
       Marquee controls (pause on hover/focus)
       ------------------------- */
    const marquees = document.querySelectorAll('.marquee');
    marquees.forEach(m => {
      const content = m.querySelector('.marquee-content');
      if (!content) return;

      // Pointer hover
      m.addEventListener('pointerenter', () => {
        content.style.animationPlayState = 'paused';
      });
      m.addEventListener('pointerleave', () => {
        content.style.animationPlayState = '';
      });

      // Keyboard focus (for accessibility)
      m.addEventListener('focusin', () => {
        content.style.animationPlayState = 'paused';
      });
      m.addEventListener('focusout', () => {
        content.style.animationPlayState = '';
      });

      // If user prefers reduced motion, ensure animation is paused/stopped
      if (prefersReducedMotion) {
        content.style.animation = 'none';
        content.style.transform = 'translateX(0)';
      }
    });

    /* -------------------------
       Hero parallax for decorative leaves
       ------------------------- */
    const hero = document.querySelector('.hero');
    if (hero && !prefersReducedMotion) {
      const leaves = hero.querySelectorAll('.leaf');
      // Use pointer events for both mouse and touch (where supported)
      hero.addEventListener('pointermove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        leaves.forEach((leaf, i) => {
          const depth = (i + 1) * 6;
          // Keep a base rotation consistent with CSS; only translate for parallax
          const baseRotate = (i % 2) ? -12 : 6;
          leaf.style.transform = `translate(${x * depth}px, ${y * depth}px) rotate(${baseRotate}deg)`;
        });
      });

      hero.addEventListener('pointerleave', () => {
        leaves.forEach(leaf => leaf.style.transform = '');
      });
    }

    /* -------------------------
       Optional: gentle card hover tilt (non-intrusive)
       ------------------------- */
    if (!prefersReducedMotion) {
      const cards = document.querySelectorAll('.card');
      cards.forEach(card => {
        // small tilt effect while pointer moves over a card
        card.addEventListener('pointermove', (e) => {
          const rect = card.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width;
          const py = (e.clientY - rect.top) / rect.height;
          const rotateX = (py - 0.5) * 6; // tilt range
          const rotateY = (px - 0.5) * -6;
          // combine with existing CSS hover transform by using a subtle perspective
          card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('pointerleave', () => {
          card.style.transform = '';
        });
      });
    }

    /* -------------------------
       Small utility: ensure focus outlines for keyboard users
       ------------------------- */
    (function keyboardFocusOutline() {
      let usingKeyboard = false;
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          usingKeyboard = true;
          document.documentElement.classList.add('using-keyboard');
        }
      });
      window.addEventListener('mousedown', () => {
        if (usingKeyboard) {
          usingKeyboard = false;
          document.documentElement.classList.remove('using-keyboard');
        }
      });
    })();

  }); // DOMContentLoaded
})();
