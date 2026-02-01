+++
date = '2026-01-29T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 009'
summary = 'git-lfs, CSS, and more'
+++

Still working on the new Hugo site. Today is all about styling and fine-tuning.

## git-lfs

Any binary file included in a git repo should be tracked using lfs (large file storage). While the favicon for the site isn't really a large file, it serves as a good test to ensure lfs is working correctly. *Spoiler* It wasn't. In order to deploy container images properly, lfs needs to be included in the workflow actions file, otherwise, you just get the file pointer.

```yaml
steps:
      - name: Check out the repo
        uses: actions/checkout@v4
        with:
          lfs: true
          fetch-depth: 0
```

## Tailwind CSS / Typography / Prose / Code Blocks

The default CSS styles made by the typography plugin aren't great. I had to make a number of edits to clean them up. I also added my first JavaScript file! As previously stated, my goal is to reduce JavaScript usage as much as possible, but sometimes it is necessary for functionality. And, in my opinion, exactly how JS should be used. Highly targeted functionality. In this instance, the only way to provide a button that can copy to a clipboard is with JS. That is fine, and we can write a tiny script, along with a conditional statement that only applied that script when a code block is present.

First, the CSS changes in `assets/css/main.css`:

```css
@layer components {

  /*** 
   * Markdown code block start
   */

  .prose :where(code):not(:where([class~="not-prose"] *, pre *)) {
    @apply text-slate-100 rounded px-1.5 py-0.5 font-normal mx-0.5;
    background-color: #363636 !important;
  }

  .prose :where(code):not(:where([class~="not-prose"] *, pre *))::before {
    content: none !important;
  }

  .prose :where(code):not(:where([class~="not-prose"] *, pre *))::after {
    content: none !important;
  }

  .prose pre {
    background-color: #02000f !important;
  }

  .code-block .highlight,
  .code-block .chroma,
  .code-block .highlight>div,
  .code-block .chroma pre {
    background-color: transparent !important;
  }

  .code-block .chroma table {
    min-width: 100%;
    width: auto;
    border-spacing: 0;
  }

  .code-block .chroma td:last-child {
    width: 100%;
  }

  .code-block .chroma pre {
    margin: 0;
  }
}
```

`!important` must be included to override some default styles.

Second, add a new JavaScript file at `/assets/js/copy-button.js`:

```javascript
/***
 * JavaScript to handle copy-to-clipboard functionality for code blocks.
 */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.copy-button').forEach(button => {
    button.addEventListener('click', () => {
      const wrapper = button.closest('.code-block');
      const raw = wrapper?.querySelector('.code-raw');

      // Prefer raw code (exact). Fallback to highlighted code only if needed.
      let text = raw?.textContent ?? wrapper?.querySelector('code')?.textContent ?? '';
      text = text.replace(/\n+$/, ''); // trim trailing blank lines

      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        const originalIcon = button.innerHTML;
        button.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        setTimeout(() => (button.innerHTML = originalIcon), 2000);
      }).catch(err => console.error('Failed to copy: ', err));
    });
  });
});
```

Third, add a Hugo render hook for the code blocks at `/layouts/_markup/render-codeblock.html`:

```html
{{- .Page.Store.Set "hasCodeBlock" true -}}

{{- $lang := .Type | default "text" -}}
{{- $raw := .Inner | chomp -}}

{{- $opts := merge .Options (dict
"lineNos" "table"
"lineNumbersInTable" true
"noClasses" false
"wrapperClass" "highlight"
) -}}
{{- $result := transform.HighlightCodeBlock . $opts -}}

<div class="code-block not-prose group relative my-6 overflow-hidden rounded-lg bg-[#02000f]" data-lang="{{ $lang }}">
  <div class="flex items-center justify-between px-4 py-2 bg-slate-950/40 border-b border-white/10">
    <span class="text-md font-mono uppercase tracking-wider text-slate-300">{{ $lang }}</span>

    <button
      class="copy-button p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200"
      aria-label="Copy to Clipboard" type="button">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    </button>
  </div>

  <pre class="code-raw sr-only">{{ $raw }}</pre>

  <div class="overflow-x-auto my-2">
    {{- $result.Wrapped -}}
  </div>
</div>
```

Finally, tack this script onto the bottom of our footer at `/layouts/_partials/footer.html`:

```html
{{/* Only load the script if a code block was rendered on this page */}}
{{ if .Page.Store.Get "hasCodeBlock" }}
{{ $copyJs := resources.Get "js/copy-button.js" | minify | fingerprint }}
<script src="{{ $copyJs.RelPermalink }}" integrity="{{ $copyJs.Data.Integrity }}" defer></script>
{{ end }}
```
