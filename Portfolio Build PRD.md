# PRD — Sebastian Bosman Portfolio
**Version:** 1.0  
**Owner:** Sebastian Bosman  
**Status:** Ready for build  
**Stack:** Vanilla JS, HTML, CSS — no frameworks. GitHub Pages deployment.

---

## 1. Purpose & Goals

This portfolio replaces the existing Notion site. It serves two audiences:

- **Hiring managers / founders** evaluating Sebastian for Senior PM or product leadership roles
- **Technical collaborators** assessing whether Sebastian can operate in a builder-PM capacity

The portfolio must do three things simultaneously:
1. Present Sebastian's professional work and background clearly
2. Signal that Sebastian is technical, AI-native, and a builder — not just a PM who talks about building
3. Be impressive enough that it becomes a talking point in interviews

The *way the site was built* (Claude Code, structured spec, GitHub workflow) is itself part of the story. This is deliberately surfaced via the terminal boot sequence on the welcome screen.

---

## 2. Site Architecture

```
/
├── index.html              ← Welcome screen + Portfolio page (single file, JS-controlled visibility)
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
│   ├── images/
│   │   └── [project thumbnails — added later]
│   └── fonts/             ← if self-hosting Inter
├── css/
│   └── styles.css
└── js/
    └── main.js
```

---

## 3. Design System

Inspired by cursor.com. Restrained, dark, typographic.

| Token | Value |
|---|---|
| Background | `#0a0a0a` |
| Surface | `#111111` |
| Border | `#1e1e1e` |
| Border hover | `#333333` |
| Text primary | `#f0f0f0` |
| Text secondary | `#888888` |
| Text muted | `#444444` |
| Accent | `#ffffff` |
| Font | Inter (Google Fonts) |
| Base font size | 13px |
| Max content width | 900px |
| Border radius | 8px |
| Transition | 150ms ease |

**Typography scale:**
- Hero name: 64px, weight 300
- Section headings: 11px, uppercase, letter-spacing 0.1em, muted
- Card titles: 13px, regular
- Body: 14px, line-height 1.7

**Rules:**
- No gradients
- No box shadows (except a barely-visible 0 1px 0 border-bottom on nav)
- No colour beyond the tokens above
- Whitespace is the primary design tool

---

## 4. Welcome Screen

### 4a. Terminal Boot Sequence

On page load, before any other content is visible, a full-screen terminal animation plays.

Background: `#0a0a0a`. Centered horizontally and vertically.

A monospace font (use `font-family: 'Courier New', monospace`) typewriter-prints the following lines sequentially, each appearing after the previous completes:

```
> initialising portfolio...
> loading projects...
> built with Claude Code + GitHub
> done ✓
```

- Each character types at ~30ms per character
- 300ms pause between lines
- After final line, 600ms pause, then the terminal block fades out (opacity 0, 400ms)
- Welcome screen content fades in (opacity 0 → 1, 400ms)

Text colour for terminal: `#888888`. The `> done ✓` line renders in `#f0f0f0`.

### 4b. Welcome Screen Layout

Full viewport height. Content vertically and horizontally centered.

```
[Name]
[Role label]

[Value props]

[CTA buttons]
```

**Name:** "Sebastian Bosman" — 64px, weight 300, `#f0f0f0`  
**Role label:** "Entrepreneurial Senior Product Manager" — 11px, uppercase, letter-spacing 0.12em, `#888888`, displayed above the name

**Value props** — stacked lines, each prefixed with `+`, `#888888`, 14px:
- `+ 4-year track record scaling B2C web, mobile and AI products`
- `+ 10 years of 0-1 experience building, testing, marketing and selling`
- `+ Specialist in the electronic dance music industry`
- `+ Strategic. Curious. Empathetic. Builder.`

**Buttons** — displayed in a row below the value props, with 16px gap:

| Button | Style | Action |
|---|---|---|
| View Portfolio | Primary — white fill, black text | Triggers portfolio transition |
| Get in touch | Outlined — white border, white text | Copies `sbtngy@gmail.com` to clipboard. Shows a small inline confirmation: "Email copied ✓" for 2 seconds |
| View LinkedIn | Outlined | Opens `https://www.linkedin.com/in/sebastian-bosman-51530897/` in new tab |
| Download CV | Outlined | Downloads `Sebastian_Bosman_CV_2026.pdf` |

Button sizing: 13px, padding `10px 20px`, border-radius `6px`, border `1px solid`.

### 4c. Welcome → Portfolio Transition

When "View Portfolio" is clicked:
1. Welcome screen fades to opacity 0 over 400ms
2. Welcome screen gets `display: none`
3. Portfolio content fades in from opacity 0 to 1 over 400ms
4. Smooth, clean — no sliding, no wipe, no dramatic movement

---

## 5. Portfolio Page

### 5a. Navigation

Fixed top navbar. Full width. `backdrop-filter: blur(12px)`. Background: `rgba(10,10,10,0.8)`. Bottom border: `1px solid #1e1e1e`.

- **Left:** "Sebastian Bosman" — 13px, regular weight. Clicking scrolls to top.
- **Right:** Text links — "Projects", "Work", "Get in touch" (anchor links). 13px, `#888888`. Hover: `#f0f0f0`. Active section (via IntersectionObserver): `#f0f0f0`.

Nav appears already rendered but hidden behind the welcome screen. Becomes visible when portfolio transition completes.

### 5b. Portfolio Header

Below nav, within the max-width container. Mirrors the welcome screen name/role/value-props layout but smaller — this is a compact header, not a hero. Same content, condensed sizing.

Then 3 CTA buttons: "Get in touch", "View LinkedIn", "Download CV" — same behaviour as welcome screen.

### 5c. Projects Section (id="projects")

Section label treatment: `PROJECTS` in 11px uppercase muted text, with a `1px solid #1e1e1e` horizontal rule extending to the right.

Two cards in a row:

| Card | Project |
|---|---|
| 1 | Vibe Coding — IOnlyListenToVinyl |
| 2 | AI Agent — Automated Content |

### 5d. My Work Section (id="work")

Same section label treatment: `MY WORK`

Five cards in a responsive grid (5 across on desktop, wrapping on smaller viewports):

| Card | Project |
|---|---|
| 1 | NFT Marketplace App — Momint |
| 2 | Client Dashboard — Momint |
| 3 | Web3 Wallet — Momint |
| 4 | Website — Momint |
| 5 | TBT — The Braai Tool |

### 5e. Card Design

Each card:
- Background: `#111111`
- Border: `1px solid #1e1e1e`
- Border radius: `8px`
- Overflow: hidden
- Cursor: pointer

**Thumbnail area:**
- 16:10 aspect ratio
- Background: `#1a1a1a` (placeholder — replaced with real images later)
- No border-bottom — the card surface transitions directly

**Label area:**
- Padding: `12px`
- Small icon: a simple `□` SVG or document icon in `#444444`
- Card title: `13px`, `#f0f0f0`, regular weight

**Hover state:**
- `border-color: #333333`
- `transform: translateY(-2px)`
- Transition: `150ms ease`

**Click behaviour:** navigates to the relevant project page (e.g. `projects/nft-marketplace.html`)

---

## 6. Project Pages

### 6a. Layout Structure

Each project page is a standalone HTML file sharing the same CSS and nav component.

**Nav:** Same fixed nav as portfolio page. "Sebastian Bosman" links back to the portfolio (`../index.html` with a flag to skip welcome and show portfolio directly — implement via `?view=portfolio` query param or URL hash).

**Page structure:**

```
[Project Title]
[One-line description — placeholder]

[Metadata row: Role | Company | Year | Platform]

────────────────────────────────

[Section: Overview]
[Section: My Role]
[Section: Background]
[Section: Understanding the Problem]
[Section: Understanding the User]
[Section: Affinity Mapping]
[Section: Product Vision & Solution]
[Section: Wireframes & Design Iterations]
[Section: Developer Handover]
[Section: Production Prototype]

[← Back to Portfolio]
```

Each section:
- Section label: 11px, uppercase, muted, with horizontal rule
- Content area: 14px body text, `#888888` for placeholder prose
- Image slots: `#1a1a1a` rectangles with a centered muted label "[ Image placeholder ]"
- Figma embed slots: same treatment with label "[ Figma embed ]"

**Note:** Not every project will use all sections. Sections are included as placeholders and will be removed or populated per project during the content sprint.

### 6b. Project Page List & Placeholder Metadata

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

## 7. Responsive Behaviour

| Breakpoint | Behaviour |
|---|---|
| Desktop (>1024px) | Full layout as described |
| Tablet (768–1024px) | My Work grid: 3 columns. Projects: 2 columns. |
| Mobile (<768px) | All grids: 1 column. Nav collapses to name only + hamburger. Welcome screen text scales down. |

---

## 8. Interactions Summary

| Interaction | Behaviour |
|---|---|
| Page load | Terminal boot sequence plays, then welcome screen fades in |
| View Portfolio | Welcome fades out, portfolio fades in |
| Get in touch | Copies email, shows "Email copied ✓" confirmation |
| Download CV | Triggers PDF download |
| Card hover | Border lightens, card lifts 2px |
| Card click | Navigate to project page |
| Nav links | Smooth scroll to section |
| Active nav | IntersectionObserver updates active link |
| Back to portfolio | Returns to index.html with portfolio visible (skip welcome) |

---

## 9. Content Sprint Plan (Post-Build)

Once all pages are structurally built and deployed, content is added in this order:

1. **Portfolio header copy** — finalise value props and CTA labels
2. **Project pages** — one at a time, in this order:
   - NFT Marketplace (most complete case study)
   - The Braai Tool
   - Client Dashboard
   - Web3 Wallet
   - Momint Website
   - Vibe Coding
   - AI Agent
3. **Project thumbnails** — real images added to `/assets/images/` and referenced in card components
4. **Figma embeds** — added to relevant project page sections

---

## 10. Out of Scope (v1)

- Dark/light mode toggle
- Blog or writing section
- Contact form (email copy is sufficient for v1)
- Analytics
- CMS or dynamic content
