+++
date = '2026-02-04T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 015'
summary = 'About Page, Math Rendering with KaTeX, new PR in cspell-dicts'
+++

Today, I came back to [Hugo](https://gohugo.io/), to give the site a bit more polish. The first order of business was to create an [About](https://test.jimdiroffii.com/about) page with some details on me and my history. I'm using this site on my resumes, and it is nice to give a bit more detail about my history beyond what fits on a typical resume or cover letter.

I also need to get that math rendering working. I've been mentioning this since I started working on [Project Euler](https://projecteuler.net/) a few days ago.

## About Page

Creating a new page in Hugo is pretty easy. Within the `content` directory, I added a new markdown file called `index.md`, within a new directory called `about`. I needed the About page to have some custom styling apart from what I've already used for other content pages. This was accomplished by adding a new front matter field called `layout`, and a new template at `layouts/about/single.html`.

Front matter:

```toml
+++
title = "About"
layout = "about"
+++
```

Template:

```html
{{ define "main" }}
<main class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
  <header class="mb-10 text-center">
    <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-white">{{ .Title }}</h1>
    {{ with .Params.subtitle }}
    <p class="mt-4 text-slate-400">{{ . }}</p>
    {{ end }}
  </header>

  <div class="prose prose-invert max-w-none text-slate-200">
    {{ .Content }}
  </div>
</main>
{{ end }}
```

Very simple and clean. The page could use some fine-tuning on the styles and layout, but this works for now. I'm really trying to not get hung up on too many details, and just keep pushing forward.

## Math Rendering

There are two different ways of rendering math in Hugo. The first is using the [MathJax](https://www.mathjax.org/) or [KaTeX](https://katex.org/) to render the math using JavaScript in the browser. I'm trying to avoid JS as much as possible, and Hugo provides a `transform.ToMath` function to perform the math rendering with KaTeX at build time. I'm going to try the function first before relying a big JS package to be pulled in at runtime.

A note on KaTeX. This is a really impressive JS library. Frequently updated (as of Feb 2026), clean test suite, readable commit history, compatible across all browsers, based on industry standard TeX, and server side rendering to HTML. All JS packages should aspire to be more like KaTeX.

The [Hugo docs](https://gohugo.io/functions/transform/tomath/) explain all the steps required to render math comprehensively. The implementation was straightforward, but I did have to change how I do things a bit. I had created `_partials` for `head.html` and `css.html` when I was originally building out the layout. I couldn't get the KaTeX stylesheet to render onto the page without placing the statements directly into the `baseof.html` file. Meaning, I had to remove the `head.html`, and now have a stylesheet condition that is *not* in the `css.html` file. I'll live with this for now, because it works. I also had to disable formatting on the `layouts/_markup/render-passthrough.html` file, since it has a really long error line, and the formatter was adding a line break. Disabling formatting was the easiest workaround, instead of trying to figure out how to ignore that one file.

This does add my first external runtime dependency to the site. We are fetching the KaTeX style sheet and font files when the page loads for the client. It adds 49.58 kB to the request load. I may pull these in locally later. The KaTeX stylesheet is versioned, so the version I'm pulling could break, preventing the math from rendering properly. A TODO for later.

### Math Render Example

This is an inline \(a^*=x-b^*\) equation.

These are block equations:

\[a^*=x-b^*\]

$$a^*=x-b^*$$

## PR in `cspell-dicts`

Almost forgot that I also did a little contribution for [streetsidesoftware/cspell-dicts](https://github.com/streetsidesoftware/cspell-dicts) today. It was a minor change, but hopefully they appreciate it. I added the word `overreliance` to the `en_shared` dictionary. This should prevent that word from being flagged as a spelling error in future versions. Of course, presuming that my [PR](https://github.com/streetsidesoftware/cspell-dicts/pull/5227) gets merged.

`cspell-dicts` is the repo that contains all the dictionaries in use for the [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) extension in [VS Code](https://code.visualstudio.com/).

I had run `cspell` through my website repo today and fixed any spelling errors in my previous posts. This is when I noticed a few missing words from the dictionary. I only performed a PR for `overreliance` today, to ensure that I had the contribution correct, and will add the other words if my PR is approved.
