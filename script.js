/* ============================================================
   ALEX CARTER — PORTFOLIO JS
   Premium Interactions & Animations
   ============================================================ */

'use strict';

// ============================================================
// CUSTOM CURSOR
// ============================================================
const cursorDot = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');

let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

// Smooth outline follow
function animateCursor() {
  outlineX += (mouseX - outlineX) * 0.14;
  outlineY += (mouseY - outlineY) * 0.14;
  cursorOutline.style.left = outlineX + 'px';
  cursorOutline.style.top = outlineY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effect on interactive elements
const hoverTargets = document.querySelectorAll(
  'a, button, .project-card, .skill-card, .testimonial-card, .contact-item, input, textarea, select'
);
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
});

// ============================================================
// NAVBAR SCROLL EFFECT
// ============================================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ============================================================
// HAMBURGER / MOBILE MENU
// ============================================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ============================================================
// ACTIVE NAV LINK (INTERSECTION OBSERVER)
// ============================================================
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

// ============================================================
// TYPING ANIMATION
// ============================================================
const typedEl = document.getElementById('typedText');
const phrases = [
  'building scalable web apps',
  'crafting pixel-perfect UIs',
  'architecting APIs & backends',
  'turning ideas into products',
  'open to new opportunities'
];
let phraseIdx = 0, charIdx = 0, deleting = false, pauseTime = 0;

function typeLoop() {
  const current = phrases[phraseIdx];

  if (!deleting) {
    typedEl.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      pauseTime = 2000;
    }
  } else {
    typedEl.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      pauseTime = 400;
    }
  }

  const speed = deleting ? 50 : pauseTime > 0 ? pauseTime : 90;
  pauseTime = 0;
  setTimeout(typeLoop, speed);
}
typeLoop();

// ============================================================
// SCROLL REVEAL
// ============================================================
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
      const delay = siblings.indexOf(entry.target) * 80;
      setTimeout(() => entry.target.classList.add('visible'), Math.min(delay, 400));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

// ============================================================
// ANIMATED STAT COUNTERS
// ============================================================
function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOutQuart(progress) * target);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statNums = document.querySelectorAll('.stat-num[data-target]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.target);
      animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => counterObserver.observe(el));

// ============================================================
// SKILLS TABS
// ============================================================
const tabBtns = document.querySelectorAll('.tab-btn');
const skillPanels = document.querySelectorAll('.skills-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    skillPanels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    const panel = document.getElementById(`tab-${tab}`);
    panel.classList.add('active');

    // Animate skill bars in the newly active panel
    panel.querySelectorAll('.skill-fill').forEach(fill => {
      fill.classList.remove('animated');
      setTimeout(() => fill.classList.add('animated'), 80);
    });

    // Re-trigger reveal on new cards
    panel.querySelectorAll('.reveal').forEach(el => {
      el.classList.remove('visible');
      setTimeout(() => el.classList.add('visible'), 50);
    });
  });
});

// Animate skill bars when first visible
const skillBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        setTimeout(() => fill.classList.add('animated'), 200);
      });
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skills-panel').forEach(panel => skillBarObserver.observe(panel));

// ============================================================
// SMOOTH SCROLL (with nav offset)
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').slice(1);
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;
    e.preventDefault();
    const navH = navbar.getBoundingClientRect().height;
    const targetY = targetEl.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  });
});

// ============================================================
// BACK TO TOP BUTTON
// ============================================================
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 600);
}, { passive: true });

// ============================================================
// CONTACT FORM
// ============================================================
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const btn = this.querySelector('button[type="submit"]');
  const span = btn.querySelector('span');
  btn.disabled = true;
  span.textContent = 'Sending…';

  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      contactForm.reset();
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    } else {
      const result = await response.json();
      alert(`Oops! There was a problem: ${result.message}\n\nTechnical Details: ${result.error || 'Check Vercel logs'}`);
    }
  } catch (error) {
    alert("Oops! There was a problem submitting your form.");
    console.error(error);
  } finally {
    btn.disabled = false;
    span.textContent = 'Send Message';
  }
});

// ============================================================
// TILT EFFECT ON PROJECT CARDS
// ============================================================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotateX = -dy * 4;
    const rotateY = dx * 4;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});

// ============================================================
// PARALLAX HERO ORBS
// ============================================================
const orbs = document.querySelectorAll('.hero-orb');
document.addEventListener('mousemove', (e) => {
  const { innerWidth: W, innerHeight: H } = window;
  const rx = (e.clientX - W / 2) / W;
  const ry = (e.clientY - H / 2) / H;

  orbs.forEach((orb, i) => {
    const factor = (i + 1) * 12;
    orb.style.transform = `translate(${rx * factor}px, ${ry * factor}px)`;
  });
}, { passive: true });

// ============================================================
// GLITCH CODE CARD TEXT SCRAMBLE
// ============================================================
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';
function scramble(el, original, duration = 600) {
  const startTime = performance.now();
  const len = original.length;

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const fixedChars = Math.floor(progress * len);
    let result = original.substring(0, fixedChars);
    for (let i = fixedChars; i < len; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    el.textContent = result;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = original;
  }
  requestAnimationFrame(update);
}

const codeCard = document.querySelector('.code-card');
if (codeCard) {
  codeCard.addEventListener('mouseenter', () => {
    const kws = codeCard.querySelectorAll('.str, .var, .num');
    kws.forEach(kw => scramble(kw, kw.textContent, 500));
  });
}

// ============================================================
// INITIAL PAGE LOAD: trigger skill bar animation for first tab
// ============================================================
window.addEventListener('load', () => {
  document.querySelectorAll('#tab-frontend .skill-fill').forEach(fill => {
    setTimeout(() => fill.classList.add('animated'), 400);
  });
});

// ============================================================
// FOOTER CURRENT YEAR
// ============================================================
const yearEls = document.querySelectorAll('.footer-year');
const y = new Date().getFullYear();
yearEls.forEach(el => (el.textContent = y));

// ============================================================
// NAV LINK HOVER RIPPLE (micro-interaction)
// ============================================================
navLinkEls.forEach(link => {
  link.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      width:4px; height:4px;
      background:rgba(99,102,241,0.6);
      left:${e.clientX - rect.left}px;
      top:${e.clientY - rect.top}px;
      transform:translate(-50%,-50%) scale(0);
      animation:ripple 0.5s ease-out forwards;
      pointer-events:none;
    `;
    this.style.position = 'relative';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Inject ripple keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to { transform: translate(-50%,-50%) scale(30); opacity: 0; }
  }
`;
document.head.appendChild(style);

console.log('%c Alex Carter Portfolio ', 'background:#6366f1;color:#fff;font-size:14px;font-weight:700;padding:6px 12px;border-radius:4px;');
console.log('%c Built with ❤️  HTML · CSS · Vanilla JS ', 'color:#94a3b8;font-size:11px;');
