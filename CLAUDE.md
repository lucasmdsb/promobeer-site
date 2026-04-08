# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static landing page for **PromoBeer** — a Brazilian mobile app for finding alcoholic beverage promotions. No build system, no package manager, no framework. Open `index.html` directly in a browser to preview.

## Development

No build step required. To serve locally:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Architecture

Single-page site — everything lives in three files:

- **`index.html`** — All page sections (Hero, Sobre, Funcionalidades, Por que usar, Como Funciona, Testimonials, CTA, Footer). Navigation uses anchor links (`#sobre`, `#funcionalidades`, etc.).
- **`css/style.css`** — Base design tokens defined as CSS custom properties in `:root`. The `body` carries `.theme-mm` which overrides the default palette to PromoBeer amber/beer colors. All colors, spacing, shadows, and typography are controlled through these variables.
- **`js/main.js`** — Vanilla JS modules initialized on `DOMContentLoaded`: mobile menu, header scroll effect, testimonials slider, back-to-top button, smooth scroll, and IntersectionObserver animations.

## Known issues

- `index.html` has **duplicate closing tags** (lines 414–429): a second `<button class="back-to-top">` and `<script src="js/main.js">` appear after the `</footer>` and a second `</body></html>`. These are dead markup.
- `js/main.js` contains `initEventsCarousel()` and `initHeroVideo()` functions that target `.events-carousel` and `.hero-video` elements that no longer exist in the current HTML (the hero video uses inline autoplay instead). These functions exit early via early-return guards and are harmless but can be removed.
- The JS file header comment still reads "Montenegro Musicalização" — a leftover from the template this site was adapted from. The CSS file has the same comment.

## CSS conventions

- Use existing CSS variables (`var(--color-secondary)`, `var(--space-xl)`, etc.) rather than hardcoded values.
- The `.theme-mm` class on `<body>` overrides default variables. New brand-specific overrides should go in the `.theme-mm {}` block in `style.css`.
- Fonts: `var(--font-display)` = Bebas Neue (headings/numbers), `var(--font-body)` = Montserrat (body text).
