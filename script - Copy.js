/* ============================================================
   NESSO LMS Landing Page — JS
   Supports: standalone (direct open) + iframe (WP embed)
   ============================================================ */

const isInIframe = window.self !== window.top;

/* --- Smooth Scroll (Lenis-style lerp) — Desktop standalone only --- */
if (!isInIframe) {
  (function() {
    if (window.matchMedia('(max-width: 1024px)').matches) return;

    let current = window.scrollY;
    let target = window.scrollY;
    const ease = 0.08;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function update() {
      current = lerp(current, target, ease);
      if (Math.abs(current - target) < 0.5) current = target;
      window.scrollTo(0, current);
      requestAnimationFrame(update);
    }

    window.addEventListener('wheel', function(e) {
      e.preventDefault();
      target = Math.max(0, Math.min(
        target + e.deltaY,
        document.documentElement.scrollHeight - window.innerHeight
      ));
    }, { passive: false });

    window.addEventListener('scroll', function() {
      if (Math.abs(current - window.scrollY) > 2) {
        current = window.scrollY;
        target = window.scrollY;
      }
    });

    requestAnimationFrame(update);
  })();
}

/* --- Iframe → Parent: send height --- */
if (isInIframe) {
  function sendHeight() {
    const h = document.documentElement.scrollHeight;
    window.parent.postMessage({ type: 'NESSO_LMS_HEIGHT', height: h }, '*');
  }
  window.addEventListener('load', sendHeight);
  window.addEventListener('resize', sendHeight);
}

document.addEventListener('DOMContentLoaded', () => {
  // Pricing cards — auto-activate hover on scroll (mobile)
  const isTouchDevice = window.matchMedia('(max-width: 1024px)').matches;
  if (isTouchDevice) {
    const cards = document.querySelectorAll('.pricing__card');
    if (cards.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('pricing__card--active');
          } else {
            entry.target.classList.remove('pricing__card--active');
          }
        });
      }, {
        rootMargin: '-30% 0px -30% 0px',
        threshold: 0.3
      });
      cards.forEach(card => observer.observe(card));
    }
  }

  // Logo marquee — seamless loop fix
  const track = document.querySelector('.logo-section__track');
  if (track) {
    const wraps = track.querySelectorAll('.logo-section__logo-wrap');
    const half = wraps.length / 2;
    const gap = 69;
    let totalWidth = 0;
    for (let i = 0; i < half; i++) {
      totalWidth += wraps[i].offsetWidth;
    }
    totalWidth += half * gap;
    track.style.setProperty('--marquee-distance', `-${totalWidth}px`);
  }

  // === Scroll Reveal Setup ===
  const sections = document.querySelectorAll(
    '.logo-section, .usp-section, .features, .ecosystem, .core-values, .pricing, .testimonials, .cta-section, .footer'
  );

  sections.forEach(section => {
    const children = section.querySelectorAll(
      'h1, h2, h3, h4, h5, p, span.features__highlight, ' +
      '[class*="__card"], [class*="__heading"], [class*="__subtitle"], ' +
      '[class*="__badge"], [class*="__pill"], [class*="__effect"], ' +
      '[class*="__grid"] > *, [class*="__cards"] > *, ' +
      '[class*="__logos"], [class*="__divider"], ' +
      '[class*="__cta"], [class*="__brand"], [class*="__links"], ' +
      '[class*="__bottom"], [class*="__top"], ' +
      '.usp-pill, .usp-card__left, .usp-card__star'
    );

    children.forEach(el => {
      if (el.closest('.logo-section__track') || el.closest('nav')) return;
      if (el.classList.contains('reveal')) return;
      el.classList.add('reveal');
    });
  });

  // Stagger sibling cards
  document.querySelectorAll(
    '.usp-section__cards, .features__grid, .ecosystem__grid, .core-values__grid, .pricing__cards'
  ).forEach(container => {
    const children = container.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      if (i > 0) child.classList.add(`reveal-delay-${Math.min(i, 4)}`);
    });
  });

  // Collect all reveal elements
  const revealEls = document.querySelectorAll('.reveal');

  if (!isInIframe) {
    // === STANDALONE MODE: optimized scroll reveal ===
    const hidden = new Set(revealEls);
    const visible = new Set();
    let lastY = -1;

    function checkReveals() {
      const y = window.scrollY;
      // Only check when scroll position changes
      if (y !== lastY) {
        lastY = y;
        const vh = window.innerHeight;

        // Check hidden → reveal (enter viewport from bottom with -30px margin)
        hidden.forEach(el => {
          const top = el.getBoundingClientRect().top;
          if (top < vh - 30) {
            el.classList.add('reveal--visible');
            hidden.delete(el);
            visible.add(el);
          }
        });

        // Check visible → hide (exit viewport with generous 150px buffer to prevent jitter)
        visible.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.bottom < -150 || rect.top > window.innerHeight + 150) {
            el.classList.remove('reveal--visible');
            visible.delete(el);
            hidden.add(el);
          }
        });
      }
      requestAnimationFrame(checkReveals);
    }
    requestAnimationFrame(checkReveals);
  } else {
    // === IFRAME MODE: listen for parent scroll position via postMessage ===
    function checkRevealFromParent(parentScrollY, parentViewportH) {
      const iframeRect = { top: 0 }; // iframe starts at top of its own document
      revealEls.forEach(el => {
        const rect = el.getBoundingClientRect(); // position relative to iframe viewport (= iframe document since no scroll)
        const elTop = rect.top;
        const elBottom = rect.bottom;

        // Element is "visible" if it overlaps with parent's visible window
        // parentScrollY = how far parent scrolled the iframe up
        // visible range in iframe coords: [parentScrollY, parentScrollY + parentViewportH]
        const visibleTop = parentScrollY;
        const visibleBottom = parentScrollY + parentViewportH - 20;

        if (elTop < visibleBottom && elBottom > visibleTop) {
          el.classList.add('reveal--visible');
        } else {
          el.classList.remove('reveal--visible');
        }
      });

      // Also handle pricing cards on mobile
      if (isTouchDevice) {
        const cards = document.querySelectorAll('.pricing__card');
        const centerZoneTop = parentScrollY + parentViewportH * 0.3;
        const centerZoneBottom = parentScrollY + parentViewportH * 0.7;
        cards.forEach(card => {
          const rect = card.getBoundingClientRect();
          if (rect.top < centerZoneBottom && rect.bottom > centerZoneTop) {
            card.classList.add('pricing__card--active');
          } else {
            card.classList.remove('pricing__card--active');
          }
        });
      }
    }

    window.addEventListener('message', function(e) {
      if (!e.data || e.data.type !== 'NESSO_PARENT_SCROLL') return;
      checkRevealFromParent(e.data.scrollY, e.data.viewportH);
    });
  }
});
