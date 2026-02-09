+++
date = '2026-02-09T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 020'
summary = ''
+++

I found that yesterday's detected issue with single line code blocks has been experienced by people in the past, and this issue is only on Firefox. Chrome does not have this issue. I'm going to reproduce it in as simple of manner as possible, and report this as an issue.

## Setup

Create a new Hugo workspace.

```bash
hugo new theme codeblock-test --themesDir .
```

Add a new file at `layouts/_markup/render-codeblock.html`:

```go
{{ $result := transform.HighlightCodeBlock . }}
{{ $result.Wrapped }}
```

## Test 1

Add a couple code blocks to `content/posts/post-1.md`.

Per the documentation, I added `lineNos=inline` to the code block after the language.

These actually rendered as expected. There is proper spacing between the line number and the code syntax.

Maybe I didn't find a bug, and I actually have some kind of issue in my style syntax.

### Investigating

In both my site's generated HTML, and in the test site's HTML, there is a newline being added after the line number.

Both sites:

```html
<pre tabindex="0" class="chroma"><code><span class="lnt">1
</span></code></pre>
```

If I remove the newline, and bring `</span>` up to the previous line, the style issue is resolved.

```html
<pre tabindex="0" class="chroma"><code><span class="lnt">1</span></code></pre>
```

> Note: Use `CTRL+K` and `CTRL+SHIFT+S` to save without formatting in VS Code.

But, considering that the test site does not suffer from this same issue with the newline, then there MUST be something in my site that is causing the issue, and it undoubtedly is in the CSS styles.

I removed all the custom HTML and CSS from `render-codeblock.html`, and only left the Hugo template statements. This produced some interesting behavior. The first column of the table, the line numbers, is not consistently rendered in size. I checked some other pages, and the formatting is all over the place. Sometimes there are very big margins between the line numbers and the code syntax, but other times it is minimal. Practically every code block has a different spacing.

### Fix It Later

I'm going to have to come back to this issue in the future. There is clearly something about my CSS configuration that is causing Firefox issues with rendering single-line code blocks, but this is not the most pressing issue. The code blocks render fine with Chrome and all of its Chromium variants. Adding this a a todo in the readme file.
