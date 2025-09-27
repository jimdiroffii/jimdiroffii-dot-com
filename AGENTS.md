# AGENTS

## Overview
- This repository powers Jim Diroff II’s personal portfolio and blog, built with Astro 5, Tailwind CSS 4, and Svelte 5, and deployed to Netlify.
- Keep changes aligned with the accessibility, performance, SEO, and content goals tracked in the README TODO lists.

## Local development workflow
1. Install dependencies with `npm install`.
2. Run `npm run dev` for the local development server; use `npm run host` when you need LAN access.
3. Use `npm run check` to validate content schemas and TypeScript before committing.
4. Build production assets with `npm run build`.
5. Verify the production build locally with `npm run preview`.

## Project layout
- `src/pages` — Astro routes (home, blog index, robots, RSS, and dynamic posts under `posts/[...slug].astro`).
- `src/components` — UI building blocks (navigation, header/footer, branding, blog post card, prose wrapper, scroll-to-top button, social buttons, and the Svelte testimonial slider).
- `src/layouts` — Base layout shells, including the Markdown post layout.
- `src/blog` — Markdown source files for the `blog` content collection; drafts stay out of production.
- `src/assets` / `src/styles` — Static assets and shared styling utilities.

## Content authoring
- `src/content.config.ts` defines the `blog` collection:
  - Required frontmatter: `title`, `description`, `pubDate`, and `author`.
  - Optional frontmatter: `updatedDate`, `image` (local asset or full URL) with `imageAlt`, `tags`, and `draft`.
  - `featuredRank` accepts a unique value of 1–3; exceeding three featured posts, duplicating ranks, or using other values fails validation.
  - Draft posts are excluded from route generation, listings, and RSS.

## Development guidelines
- Favor accessible, performant implementations and update the README TODO entries when delivering related work.
- Reuse or extend existing components/layouts before introducing new patterns; keep Tailwind usage consistent with the current Astro + Tailwind integration.
- When adjusting build or integration behavior, update `astro.config.mjs` carefully so the Netlify adapter, Svelte integration, and sitemap remain configured.

## Deployment
- Production builds target Netlify via the official adapter, with the canonical site URL set to `https://www.jimdiroffii.com/`. Ensure this stays accurate when changing deployment settings or site structure.
