# JimDiroffII.com

My personal portfolio and blog site. Currently under development.

## Stack

Astro 5, Tailwind CSS 4, Svelte 5. Hosted on Netlify.

## Contact

Hit me up on any of the social sites: @jimdiroffii

## TODO List

### Completed Items

[x] Setup Netlify CI/CD build pipeline (simple-design branch)
[x] RSS Feed
[x] Automatic sitemap generation
[x] Setup Astro 5
[x] Setup Tailwind CSS
[x] Setup Svelte
[x] Setup Git LFS
[x] Build content collection for blog posts
[x] Automatic dark theme toggling
[x] Automatic robots generation with disallow entry
[x] Layout: Base
[x] Basic components
[x] Testimonial slider
[x] Image to AVIF with WEBP and JPG fallback

### Content & IA

[ ] Home page section: Introduction
[ ] Home page section: Companies
[ ] Point of sale stuff (case study series)
[ ] Projects (security tools, pipelines, NAS/CI, etc.)
[ ] CTF index (filters; links to writeups)
[ ] About (timeline, certs, NASA L’SPACE)
[ ] Resume link
[ ] Upload previously written blog posts
[ ] Upload CTF markdown files

### Writing UX & Markdown (Astro Content + MDX)

[ ] Markdown post formatting
[ ] Improved Blog (markdown) post layout (TOC, reading time, prev/next, series)
[ ] Syntax highlighting
[ ] Copy button on code blocks
[ ] Footnotes with backrefs

### Design & Brand

[ ] Branding logo (SVG; light/dark variants)
[ ] Favicon set + maskable PWA icon
[ ] Typography and Font selection
[ ] Color palette (WCAG AA)
[ ] OG/social image template
[ ] 404 & 410 pages
[ ] Print styles for posts

### Navigation & Search

[ ] Hamburger mobile nav menu
[ ] Skip links & landmark regions
[ ] Breadcrumbs on posts/case studies (schema.org)
[ ] Client-side search
[ ] Footer quick links

### Accessibility (a11y) Testing

[ ] a11y improvements and testing
[ ] Keyboard tab order & visible focus states
[ ] Color contrast audit
[ ] Reduced-motion variants for animations
[ ] Form labels, descriptions, and error messaging
[ ] Automated checks in CI (axe, Lighthouse, Pa11y)

### Performance & Media

[ ] Lazy-load images/iframes; `decoding="async"`; `fetchpriority` where needed
[ ] Tailwind JIT purge; keep JS budget minimal (islands only)
[ ] Preload local font subset + critical path CSS
[ ] Throttled mobile testing

### SEO & Feeds

[ ] Finalize titles, meta, and canonicals
[ ] RSS/Atom + JSON Feed (global & per-tag)
[ ] schema.org (Person/Organization, BlogPosting, BreadcrumbList)
[ ] Verify Search Console + Bing

### Contact & Newsletter

[ ] Contact form
[ ] Spam protection
[ ] Rate limiting + structured logging

### Privacy, Security & Legal

[ ] Security headers via Netlify `_headers` (CSP w/ nonces, HSTS, Referrer-Policy, Permissions-Policy, X-Frame-Options)
[ ] No third-party trackers; local fonts only
[ ] Privacy policy
[ ] Terms of use
[ ] Accessibility statement
[ ] Content license for blog/code snippets

### Build, CI/CD & Ops (Netlify)

[ ] Branch previews + protected main
[ ] Link checker (lychee) + Markdownlint/Prettier/ESLint
[ ] Verify image optimization in build
[ ] Dependabot/security scanning
[ ] Uptime/TLS monitors; backups of content & artifacts
[ ] Error tracking

### Basic Analytics

[ ] Plausible/Umami (self-hosted or no-cookie mode)
[ ] Goals: contact submit, resume download, read-depth
[ ] Lighthouse score tracking in CI
