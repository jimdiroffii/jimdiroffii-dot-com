# jimdiroffii-dot-com

An Astro website - Current live build is on `simple-design` branch.

## TODO

- [ ] Modify `robots.txt.ts` to allow indexing (automatically generates robots file)
- [ ] Modify meta robots tag in `BaseLayout.astro` to allow indexing
- [ ] Update production URL domain in `astro.config.mjs`
- [ ] Remove SVG from Git LFS tracking
- [ ] Setup Netlify headers in `netlify.toml` before production deployment (see example below)
- [ ] Update the `rss.xml.js` file to include proper title, description, etc.
- [ ] Add skip to content link
- [ ] Setup Playwright testing platform (issues with Debian/LMDE installation)

## Build Status

[![Netlify Status](https://api.netlify.com/api/v1/badges/63b7ed2f-2996-4d5b-ae9a-628ab9a2f800/deploy-status)](https://app.netlify.com/projects/jimdiroffii-dot-com/deploys)

## Binary File Handling

Ensure binary files are handled through [git lfs](https://git-lfs.com/).

- Install git lfs package: `apt install git-lfs`
- Setup the package: `git lfs install`
- Track files: `git lfs track "*.ext"`
- Commit git attributes: `git add .gitattributes`

### Track previously committed files and rebase with signature

**This is a destructive action that rewrites the commit history**

- Track the file that was not included in `lfs`: `git lfs migrate import --everything --include="favicon.svg"`

The `rebase` operation can be performed from the first commit where the imported file was committed, or from the root commit. Without `rebase`, all GPG signatures of rewritten commits become invalid.

- Rebase from root: `git rebase --exec 'git commit --amend --no-edit -S' --root`
- Rebase from commit: `git rebase --exec 'git commit --amend --no-edit -S' -i <commit hash>`

The next push has to be forced since the commit history changed. Other copies of the repository will need to be cloned or rebased again.

- Force push: `git push --force`

The new commits should have been written, and GPG signatures verified.

## Upgrading Astro and integrations

Upgrade to the latest version of Astro, and upgrade all integrations to their latest versions.

```
npx @astrojs/upgrade
```

## Netlify Header Configuration

An example netlify header configuration for production use:

```toml
# Security + caching headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    Strict-Transport-Security = "max-age=63072000; includeSubDomains; preload"

# Cache hashed build assets aggressively (Astro emits /_astro/* by default)
[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## Dark mode behavior

- Theme is applied pre-paint via an inline script. Explicit user choices (`light`/`dark`) override system.
- In “system” mode the site follows `prefers-color-scheme` when the browser exposes live updates.
- Some Firefox themes and privacy forks can pin native widget appearance or `prefers-color-scheme`.
