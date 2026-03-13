// ─── Constants ───────────────────────────────────────────────
const CHAR_DELAY    = 12;    // ms per character
const LINE_PAUSE    = 100;   // ms between lines
const DONE_PAUSE    = 2600;  // ms after READY. before fade
const FADE_DURATION = 400;   // ms — matches CSS --fade

const BIOS_LINES = [
  { text: 'SEBASTIAN BOSMAN PORTFOLIO v1.26',                        ok: false },
  { text: 'Copyright (C) 2026.',                                     ok: false },
  { text: 'All Rights Reserved.',                                    ok: false },
  { text: 'Built with Claude Code.',                                  ok: false },
  { text: 'Loading portfolio assets..............................',    ok: true  },
  { text: 'Mounting project files from GitHub....................',    ok: true  },
  { text: 'Checking index.html...................................',    ok: true  },
  { text: 'Compiling js/main.js.................................',     ok: true  },
];

const EMAIL    = 'sbtngy@gmail.com';
const LINKEDIN = 'https://www.linkedin.com/in/sebastian-bosman-51530897/';

// ─── Elements ────────────────────────────────────────────────
const terminalEl    = document.getElementById('terminal');
const terminalBlock = document.getElementById('terminal-block');
const welcomeEl     = document.getElementById('welcome');
const portfolioEl   = document.getElementById('portfolio');

// ─── Helpers ─────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function typewrite(el, text) {
  for (const char of text) {
    el.textContent += char;
    await sleep(CHAR_DELAY);
  }
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  // Fade in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { toast.classList.add('toast-visible'); });
  });

  // After 3s, fade out and remove
  setTimeout(() => {
    toast.classList.remove('toast-visible');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 3000);
}

function copyEmail() {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(EMAIL)
      .then(() => showToast('Email copied to clipboard'))
      .catch(() => {});
  } else {
    const ta = document.createElement('textarea');
    ta.value = EMAIL;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Email copied to clipboard');
  }
}

// ─── Progress Bar ─────────────────────────────────────────────
// Appends into `container`, fills over `duration` ms, then shows READY.
async function runProgressBar(container, duration) {
  const BAR_WIDTH = 55;

  const wrap = document.createElement('div');
  wrap.className = 'bios-progress-wrap';

  const label = document.createElement('span');
  label.className = 'bios-progress-label';
  label.textContent = 'Loading Sebastian Bosman Portfolio...';

  const bar = document.createElement('span');
  bar.className = 'bios-progress-bar';
  bar.textContent = '░'.repeat(BAR_WIDTH);

  wrap.appendChild(label);
  wrap.appendChild(bar);
  container.appendChild(wrap);

  const stepDelay = duration / BAR_WIDTH;
  for (let i = 0; i < BAR_WIDTH; i++) {
    await sleep(stepDelay);
    bar.textContent = '█'.repeat(i + 1) + '░'.repeat(BAR_WIDTH - i - 1);
  }

  label.textContent = 'READY.';
  label.style.color = '#f0f0f0';
}

// ─── BIOS Boot Sequence (Phase 1) ────────────────────────────
async function runBIOS() {
  // Two sub-containers keep DOM order stable:
  // linesContainer is appended first (top), progressContainer second (bottom).
  // Both are in place before any animation starts, so concurrent writes
  // to each container never interleave their visual positions.
  const linesContainer    = document.createElement('div');
  const progressContainer = document.createElement('div');
  terminalBlock.appendChild(linesContainer);
  terminalBlock.appendChild(progressContainer);

  // Calculate exact typing duration so the bar fills in lockstep.
  const totalTypingTime = BIOS_LINES.reduce((acc, { text }) => {
    return acc + (text.length * CHAR_DELAY) + LINE_PAUSE;
  }, 0);

  // Start progress bar concurrently — its first await yields control
  // back here immediately, so the typing loop begins on the same tick.
  const progressDone = runProgressBar(progressContainer, totalTypingTime);

  // Type lines into linesContainer (above the progress bar)
  for (const { text, ok } of BIOS_LINES) {
    const lineEl = document.createElement('div');
    lineEl.className = 'bios-line';
    linesContainer.appendChild(lineEl);

    if (text === '') {
      lineEl.textContent = '\u00a0';
      await sleep(LINE_PAUSE);
      continue;
    }

    const textSpan = document.createElement('span');
    lineEl.appendChild(textSpan);
    await typewrite(textSpan, text);

    if (ok) {
      const okSpan = document.createElement('span');
      okSpan.className = 'bios-ok';
      okSpan.textContent = 'OK';
      lineEl.appendChild(okSpan);
    }

    await sleep(LINE_PAUSE);
  }

  // Typing is done; wait for bar to finish (both complete at the same time)
  await progressDone;

  await sleep(DONE_PAUSE);

  // Fade Phase 1 out, then reveal portfolio directly
  terminalEl.classList.add('fade-out');
  await sleep(FADE_DURATION);
  terminalEl.style.display = 'none';

  document.documentElement.classList.remove('no-scroll');
  document.body.classList.remove('no-scroll');
  portfolioEl.classList.add('visible');
  window.scrollTo(0, 0);
}

// ─── Welcome → Portfolio Transition ──────────────────────────
async function showPortfolio() {
  welcomeEl.classList.add('fade-out');
  await sleep(FADE_DURATION);
  welcomeEl.style.display = 'none';
  document.documentElement.classList.remove('no-scroll');
  document.body.classList.remove('no-scroll');
  portfolioEl.classList.add('visible');
  window.scrollTo(0, 0);
}

// ─── Query Param: ?view=portfolio ────────────────────────────
function checkViewParam() {
  const params = new URLSearchParams(window.location.search);
  return params.get('view') === 'portfolio';
}

// ─── Nav: Active Section via IntersectionObserver ────────────
function initNavObserver() {
  const sections = document.querySelectorAll('#projects, #work');
  const navLinks  = document.querySelectorAll('.nav-links a[data-section]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.dataset.section === entry.target.id
          );
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => observer.observe(section));
}

// ─── Nav: Smooth scroll & brand link behaviour ────────────────
function initNavLinks() {
  document.querySelectorAll('.nav-links a[href^="#"]:not(#nav-contact)').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  document.getElementById('nav-brand').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── Button Wiring ────────────────────────────────────────────
function initButtons() {
  document.getElementById('btn-view-portfolio').addEventListener('click', showPortfolio);

  document.getElementById('btn-get-in-touch-portfolio').addEventListener('click', () => {
    copyEmail();
  });

  document.getElementById('btn-linkedin-portfolio').addEventListener('click', () => {
    window.open(LINKEDIN, '_blank', 'noopener,noreferrer');
  });
}

// ─── Nav Contact: runs on all pages (portfolio + project pages) ──
const navContact = document.getElementById('nav-contact');
if (navContact) {
  navContact.addEventListener('click', (e) => {
    e.preventDefault();
    copyEmail();
  });
}

// ─── Init ─────────────────────────────────────────────────────
(async function init() {
  // Project pages share this file but don't have portfolio elements.
  if (!terminalEl) return;

  if (checkViewParam()) {
    // Skip all phases, show portfolio immediately
    terminalEl.style.display = 'none';
    welcomeEl.style.display  = 'none';
    portfolioEl.classList.add('visible');
    initNavObserver();
    initNavLinks();
    initButtons();
    return;
  }

  // Lock scroll during boot sequence
  document.documentElement.classList.add('no-scroll');
  document.body.classList.add('no-scroll');

  initButtons();
  initNavObserver();
  initNavLinks();
  await runBIOS();
})();
