# CLAUDE.md — Sebastian Bosman Portfolio

This file is the persistent context file for Claude Code. Read this before taking any action in this project.

---

## What This Project Is

A personal portfolio website for Sebastian Bosman — Entrepreneurial Senior Product Manager. This is a static site built with vanilla JS, HTML, and CSS. No frameworks. Deployed via GitHub Pages.

The portfolio is itself a demonstration of an AI-native PM workflow. The way it is built (structured spec, Claude Code, clean git history) is intentionally part of the story. Maintain that standard in everything you do here.

---

## Who Sebastian Is

- Senior PM with a background in product design, entrepreneurship, and growth
- Career arc: Product Designer → Entrepreneur → Product Manager
- Experience: Momint (NFT marketplace), The Beatport Group (music tech), co-founder of The Braai Tool (patented physical product) and Tenfold Agency
- Based in London
- Contact: sbtngy@gmail.com
- LinkedIn: https://www.linkedin.com/in/sebastian-bosman-51530897/

**Do not mention Howbout anywhere in this codebase, in comments, or in content.**

---

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript (ES6+)
- No frameworks, no build tools, no npm
- Google Fonts: Inter (loaded via `<link>` in `<head>`)
- Monospace font for terminal sequence: `'Courier New', monospace`
- Deployment: GitHub Pages

---

## File Structure

```
/
├── index.html
├── CLAUDE.md
├── PRD.md
├── README.md
├── projects/
│   ├── vibe-coding.html
│   ├── ai-agent.html
│   ├── nft-marketplace.html
│   ├── client-dashboard.html
│   ├── web3-wallet.html
│   ├── momint-website.html
│   └── braai-tool.html
├── assets/
│   ├── cv/
│   │   └── Sebastian_Bosman_CV_2026.pdf
│   └── images/
│       └── [project thumbnails — to be added]
├── css/
│   └── styles.css
└── js/
    └── main.js
```

---

## Design System

Aesthetic reference: cursor.com — minimal, dark, typographic, restrained.

### Colour Tokens

```css
--bg:           #0a0a0a;
--surface:      #111111;
--border:       #1e1e1e;
--border-hover: #333333;
--text-primary: #f0f0f0;
--text-secondary: #888888;
--text-muted:   #444444;
--accent:       #ffffff;
```

### Typography

```css
--font-main: 'Inter', sans-serif;
--font-mono: 'Courier New', monospace;
--text-base: 13px;
--text-body: 14px;
--text-hero: 64px;
--text-label: 11px; /* uppercase section labels */
```

### Rules — Never Break These

- No gradients
- No box shadows (a `1px` border is the only depth cue)
- No colours outside the token set above
- No animations beyond: terminal typewriter, opacity fade transitions, card hover lift
- All transitions: `150ms ease`
- Max content width: `900px`, centered with `margin: 0 auto`
- Whitespace is the primary design tool — be generous with padding

---

## Page Architecture

### index.html

Two layers, controlled by JS:

1. **Welcome screen** (`#welcome`) — full viewport, centered content, terminal sequence + name + value props + CTA buttons
2. **Portfolio page** (`#portfolio`) — hidden on load, revealed on "View Portfolio" click

**Welcome → Portfolio transition:**
- Welcome screen fades to `opacity: 0` over 400ms, then `display: none`
- Portfolio fades in from `opacity: 0` to `1` over 400ms
- No slides, wipes, or movement — clean fade only

**Terminal boot sequence** (plays on page load, before welcome content appears):
- Full screen `#0a0a0a`, centered monospace text
- Lines typewrite sequentially at 30ms per character, 300ms pause between lines:
  ```
  > initialising portfolio...
  > loading projects...
  > built with Claude Code + GitHub
  > done ✓
  ```
- Text colour: `#888888`. Final line (`> done ✓`) in `#f0f0f0`
- After final line: 600ms pause → terminal block fades out (400ms) → welcome content fades in (400ms)

### projects/*.html

Standalone pages. Share `../css/styles.css` and a consistent nav + page structure.

Nav "Sebastian Bosman" links back to `../index.html?view=portfolio` — which skips the welcome screen and shows the portfolio directly.

In `main.js` (or inline in `index.html`): on page load, check for `?view=portfolio` query param. If present, skip terminal + welcome, show portfolio immediately.

---

## Component Patterns

### Nav

```html
<nav id="nav">
  <div class="nav-inner">
    <a href="#" class="nav-brand">Sebastian Bosman</a>
    <div class="nav-links">
      <a href="#projects">Projects</a>
      <a href="#work">Work</a>
      <a href="#contact">Get in touch</a>
    </div>
  </div>
</nav>
```

CSS: `position: fixed`, `backdrop-filter: blur(12px)`, `background: rgba(10,10,10,0.8)`, `border-bottom: 1px solid #1e1e1e`

### Section Label

```html
<div class="section-label">
  <span>PROJECTS</span>
  <div class="section-rule"></div>
</div>
```

`PROJECTS` in 11px, uppercase, letter-spacing 0.1em, `#888888`. Rule is `1px solid #1e1e1e` that fills remaining width.

### Card

```html
<a href="projects/nft-marketplace.html" class="card">
  <div class="card-thumb"></div>
  <div class="card-label">
    <span class="card-icon">□</span>
    <span class="card-title">NFT Marketplace App — Momint</span>
  </div>
</a>
```

Hover: `border-color: #333333`, `transform: translateY(-2px)`, `transition: 150ms ease`

### Button Variants

```html
<!-- Primary -->
<button class="btn btn-primary">View Portfolio</button>

<!-- Outlined -->
<button class="btn btn-outline">Get in touch</button>
```

```css
.btn { font-size: 13px; padding: 10px 20px; border-radius: 6px; cursor: pointer; transition: 150ms ease; }
.btn-primary { background: #f0f0f0; color: #0a0a0a; border: 1px solid #f0f0f0; }
.btn-primary:hover { background: #ffffff; }
.btn-outline { background: transparent; color: #f0f0f0; border: 1px solid #444444; }
.btn-outline:hover { border-color: #f0f0f0; }
```

### Image / Figma Placeholder

```html
<div class="placeholder-image">
  <span>[ Image placeholder ]</span>
</div>

<div class="placeholder-figma">
  <span>[ Figma embed ]</span>
</div>
```

Background: `#1a1a1a`. Text: `#444444`, 12px, centered.

---

## Button Actions

| Button | Action |
|---|---|
| View Portfolio | Triggers welcome→portfolio transition |
| Get in touch | `navigator.clipboard.writeText('sbtngy@gmail.com')` + show "Email copied ✓" for 2s |
| View LinkedIn | `window.open('https://www.linkedin.com/in/sebastian-bosman-51530897/', '_blank')` |
| Download CV | `<a href="../assets/cv/Sebastian_Bosman_CV_2026.pdf" download>` |

---

## Project Pages — Section Template

Every project page uses this section structure (remove unused sections per project during content sprint):

1. Overview
2. My Role
3. Background
4. Understanding the Problem
5. Understanding the User
6. Affinity Mapping
7. Product Vision & Solution
8. Wireframes & Design Iterations
9. Developer Handover
10. Production Prototype

Each section uses the standard section-label component. Content areas use placeholder prose. Image and Figma slots use placeholder components.

---

## Project Files & Metadata

| File | Title | Company | Year | Type |
|---|---|---|---|---|
| `vibe-coding.html` | Vibe Coding — IOnlyListenToVinyl | Personal Project | 2024 | Web App |
| `ai-agent.html` | AI Agent — Automated Content | Personal Project | 2024 | AI / Automation |
| `nft-marketplace.html` | NFT Marketplace App | Momint | 2022–2023 | Mobile App |
| `client-dashboard.html` | Client Dashboard | Momint | 2022–2023 | Web App |
| `web3-wallet.html` | Web3 Wallet | Momint | 2022–2023 | Mobile App |
| `momint-website.html` | Website | Momint | 2022–2023 | Web |
| `braai-tool.html` | TBT — The Braai Tool | Personal / Co-Founded | 2015–2018 | Physical Product |

---

## Responsive Breakpoints

| Breakpoint | Behaviour |
|---|---|
| >1024px | Full layout |
| 768–1024px | My Work: 3-col grid. Projects: 2-col. |
| <768px | All grids: 1-col. Nav: name only. Welcome text scales down. |

---

## Git Workflow

- `main` branch — production only. Must always be deployable.
- Feature branches for each major section or feature: `feature/welcome-screen`, `feature/portfolio-page`, `feature/project-pages`, etc.
- Commit messages must be descriptive and intentional. Examples:
  - `feat: add terminal boot sequence to welcome screen`
  - `feat: implement welcome to portfolio fade transition`
  - `fix: correct card hover state on mobile`
  - `content: populate NFT marketplace project page`
- No commits directly to `main` during build phase
- Merge via PR when a feature is complete and tested

---

## Build Order

Build in this sequence. Do not skip ahead.

1. `css/styles.css` — full design system, all tokens, all component styles
2. `index.html` — welcome screen (terminal + content + buttons), portfolio page (nav + header + project sections + work sections), transition logic
3. `js/main.js` — terminal sequence, fade transitions, clipboard, IntersectionObserver for active nav, query param check
4. `projects/nft-marketplace.html` — first project page (establish the template)
5. Remaining 6 project pages — replicate template, update metadata
6. Test all links, transitions, and responsive behaviour
7. Deploy to GitHub Pages

---

## Out of Scope (v1)

- Dark/light toggle
- Blog or writing section
- Contact form
- Analytics
- Any backend or CMS
- npm, webpack, or any build tooling
