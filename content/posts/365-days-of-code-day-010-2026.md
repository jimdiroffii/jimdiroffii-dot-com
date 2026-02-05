+++
date = '2026-01-30T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 010'
summary = 'Mobile hamburgers... mmm'
+++

Today's code was simple, get the mobile layout configuration set. Most importantly, can we configured a mobile-style hamburger menu using CSS only? Yes, for the most part. One UI feature missing is that if you click the hamburger menu, it will stay open unless you click a button to close it. Since there is no JavaScript, there is no detection for clicks elsewhere on the page. I was willing to give up that functionality, and added a button to close the menu.

## Configuring the Mobile Hamburger Menu

The CSS that needed to be added is fairly simple. The rest of the CSS is configured through Tailwind.

```css
.nav-details summary::-webkit-details-marker {
  display: none;
}

.nav-details[open] .icon-open {
  display: none;
}

.nav-details:not([open]) .icon-close {
  display: none;
}
```

The HTML is more complicated. This is our new `nav` section, which is included in our `header` component at `/layouts/_partials/header.html`:

```html
<nav class="flex justify-between items-center gap-6 font-medium text-white" aria-label="Primary">
  {{- $brand := or site.Title "Jim Diroff II" -}}
  <a href="{{ " /" | relLangURL }}" class="text-lg font-bold">
    {{ $brand }}
  </a>

  {{- $links := slice
  (dict "name" "Home" "url" "/")
  (dict "name" "Blog" "url" "/posts/")
  -}}

  <!-- Desktop nav -->
  <div class="hidden md:flex gap-6">
    {{- range $links -}}
    <a href="{{ .url | relLangURL }}" class="hover:text-blue-500 transition-colors">
      {{ .name }}
    </a>
    {{- end -}}
  </div>

  <!-- Mobile menu (no JS) -->
  <details class="nav-details md:hidden relative">
    <summary
      class="inline-flex items-center justify-center rounded-lg p-2 hover:text-blue-500 transition-colors
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
      aria-label="Toggle navigation menu">
      <span class="sr-only">Menu</span>

      <!-- Hamburger icon -->
      <svg class="icon-open h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>

      <!-- Close (X) icon -->
      <svg class="icon-close h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    </summary>

    <!-- Dropdown panel -->
    <div class="absolute right-0 top-full mt-3 w-52 overflow-hidden rounded-xl border border-slate-800
              bg-slate-950/95 backdrop-blur shadow-xl">
      <div class="p-2 flex flex-col">
        {{- range $links -}}
        <a href="{{ .url | relLangURL }}"
          class="rounded-lg px-3 py-2 hover:bg-white/5 hover:text-blue-500 transition-colors">
          {{ .name }}
        </a>
        {{- end -}}
      </div>
    </div>
  </details>
</nav>
```
