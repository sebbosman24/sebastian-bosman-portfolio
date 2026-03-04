// ─── Constants ───────────────────────────────────────────────
const CHAR_DELAY    = 30;   // ms per character
const LINE_PAUSE    = 300;  // ms between lines
const DONE_PAUSE    = 600;  // ms after final line before fade
const FADE_DURATION = 400;  // ms — matches CSS --fade

const TERMINAL_LINES = [
  { text: '> initialising portfolio...',      done: false },
  { text: '> loading projects...',            done: false },
  { text: '> built with Claude Code + GitHub', done: false },
  { text: '> done ✓',                         done: true  },
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

function typewriteLine(lineEl, text) {
  return new Promise(async (resolve) => {
    for (const char of text) {
      lineEl.textContent += char;
      await sleep(CHAR_DELAY);
    }
    resolve();
  });
}

function showEmailConfirm(confirmEl) {
  confirmEl.classList.add('visible');
  setTimeout(() => confirmEl.classList.remove('visible'), 2000);
}

function copyEmail(confirmEl) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(EMAIL)
      .then(() => showEmailConfirm(confirmEl))
      .catch(() => showEmailConfirm(confirmEl));
  } else {
    // Fallback for older browsers
    const ta = document.createElement('textarea');
    ta.value = EMAIL;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showEmailConfirm(confirmEl);
  }
}

// ─── Terminal Boot Sequence ───────────────────────────────────
async function runTerminal() {
  for (const { text, done } of TERMINAL_LINES) {
    const lineEl = document.createElement('span');
    lineEl.className = 'terminal-line' + (done ? ' done' : '');
    terminalBlock.appendChild(lineEl);
    await typewriteLine(lineEl, text);
    await sleep(LINE_PAUSE);
  }

  await sleep(DONE_PAUSE);

  // Fade terminal out
  terminalEl.classList.add('fade-out');
  await sleep(FADE_DURATION);
  terminalEl.style.display = 'none';

  // Fade welcome screen in
  welcomeEl.classList.add('visible');
}

// ─── Welcome → Portfolio Transition ──────────────────────────
async function showPortfolio() {
  welcomeEl.classList.add('fade-out');
  await sleep(FADE_DURATION);
  welcomeEl.style.display = 'none';
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
  const sections = document.querySelectorAll('#projects, #work, #contact');
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
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
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
  // View Portfolio
  document.getElementById('btn-view-portfolio').addEventListener('click', showPortfolio);

  // Get in touch — welcome
  document.getElementById('btn-get-in-touch').addEventListener('click', () => {
    copyEmail(document.getElementById('email-confirm-welcome'));
  });

  // Get in touch — portfolio header
  document.getElementById('btn-get-in-touch-portfolio').addEventListener('click', () => {
    copyEmail(document.getElementById('email-confirm-portfolio'));
  });

  // Nav: Get in touch
  document.getElementById('nav-contact').addEventListener('click', (e) => {
    e.preventDefault();
    copyEmail(document.getElementById('email-confirm-portfolio'));
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  });

  // LinkedIn — welcome
  document.getElementById('btn-linkedin-welcome').addEventListener('click', () => {
    window.open(LINKEDIN, '_blank', 'noopener,noreferrer');
  });

  // LinkedIn — portfolio
  document.getElementById('btn-linkedin-portfolio').addEventListener('click', () => {
    window.open(LINKEDIN, '_blank', 'noopener,noreferrer');
  });
}

// ─── Init ─────────────────────────────────────────────────────
(async function init() {
  // Project pages share this file but don't have portfolio elements.
  // Bail out early — project pages need no JS beyond what's inline.
  if (!terminalEl) return;

  if (checkViewParam()) {
    // Skip terminal + welcome, show portfolio immediately
    terminalEl.style.display = 'none';
    welcomeEl.style.display  = 'none';
    portfolioEl.classList.add('visible');
    initNavObserver();
    initNavLinks();
    initButtons();
    return;
  }

  // Normal flow
  initButtons();
  initNavObserver();
  initNavLinks();
  await runTerminal();
})();
