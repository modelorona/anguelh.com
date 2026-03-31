# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio and blog site for Anguel Hristozov (anguelh.com). Built with Astro, styled with Bulma (Darkly theme via Bulmaswatch CDN), deployed to Netlify as a static site.

## Commands

- **Dev server:** `pnpm dev`
- **Build:** `pnpm build`
- **Format:** `pnpm format` (Prettier with astro plugin)
- **Preview build:** `pnpm preview`

Package manager is **pnpm** (v9.14.4). No test suite exists.

## Architecture

### Content Collections (Astro Content Layer API)

Defined in `src/content.config.ts` using `glob` loaders. Three collections:

- **blog** (`src/content/blog/*.md`) — Frontmatter: `title`, `description`, `pubDate`, `updatedDate?`, `heroImage?`, `tags[]`
- **projects** (`src/content/projects/*.md`) — Frontmatter: `title`, `description`, `year`, `type`, `links[]`, `tech[]`, `extraTags[]`, `order` (used for sort)
- **privacy_policies** (`src/content/privacy_policies/*.md`) — Frontmatter: `title`, `description`, `lastUpdatedDate?`

### Routing

- `/` — About page (`src/pages/index.astro`)
- `/blog` — Posts grouped by year, sorted newest first
- `/blog/[slug]` — Individual post with prev/next navigation and reading time (calculated at 200 wpm from `post.body`)
- `/blog/tags/[tag]` — Tag filter page, tags derived from blog collection at build time
- `/projects` — Projects sorted by `order` field (descending)
- `/resume` — Embeds PDF via PDFObject
- `/rss.xml` — RSS feed
- `/privacy_policies/[slug]` — Privacy policy pages

### Layouts

- `Page.astro` — Base HTML shell (BaseHead + Header + Footer + `src/js/index.js`)
- `BlogPost.astro` — Blog post layout with JSON-LD structured data, reading time, tags, prev/next nav
- `PrivacyPolicy.astro` — Privacy policy layout

### Styling

CSS is in `src/styles/main.css`. Uses CSS custom properties and respects `prefers-color-scheme` for light/dark code blocks and blockquotes. Bulma classes are used throughout templates (tiles, columns, tags, modals, navbar).

### Sitemap Generation

`astro.config.mjs` reads blog filenames at config time (via `fs.readdirSync`) to build `customPages` for the sitemap integration. Blog URLs are constructed from the markdown filename (minus extension).

### Netlify Configuration

`netlify.toml` defines security headers (HSTS, CSP-adjacent, Permissions-Policy), short URL redirects (`/p/*` to GitHub/Play Store), and the build command.

### Formatting Rules

Prettier config (`.prettierrc.mjs`): 4-space tabs for JS/TS, `printWidth: 100`, trailing commas (es5), no single quotes, Astro parser for `.astro` files.

## Key Conventions

- Site constants (title, description, author) live in `src/consts.ts`
- Analytics: GoatCounter (loaded in `BaseHead.astro`)
- Contact form: Netlify Forms with honeypot spam protection (in `Header.astro`)
- Easter egg: Clippy (clippyts) loaded on demand from CDN via "Harmless surprise" nav link
- Icons: SVG icons rendered through `Icon.astro` component
