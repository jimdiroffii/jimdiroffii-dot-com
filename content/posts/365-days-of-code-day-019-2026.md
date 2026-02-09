+++
date = '2026-02-08T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 019'
summary = ''
+++

Software can be crazy. I'm having the same issue from yesterday from Ubuntu. The issue is that my site is not rendering with the Hugo development server. I started poking a bit more at the problem, and found that both Chrome and Firefox were both working fine, but Firefox Dev Edition would not render the site. Specifically, the css file request never finishes. I ended up resetting Firefox Dev, and it appears to be working again. I'm still not sure exactly what the issue was, but my best guess is some type of caching issue. I always develop with `Disable Cache` enabled, but clearly something went wrong while requesting information from the site.

With the browser working again, I can go back to restructing the site layouts.

## Meta Tags

I went through and updated the `head` with all the optional `meta` tags for SEO and social sharing. Another win for Hugo, as they have [embedded partial templates](https://gohugo.io/templates/embedded/) for [OpenGraph](https://ogp.me/), [HTML schema microdata](https://html.spec.whatwg.org/multipage/microdata.html#microdata), and [X (Twitter) cards](https://developer.x.com/en/docs/twitter-for-websites/cards/overview/abouts-cards). Extremely convenient.

## Fixing Link Generation

I noticed that an extra space was being added to links generated from markdown. This was introduced when I added the Prettier extension to format code on save. Fortunately, Prettier has an option to ignore a block of code from formatting. `prettier-ignore-start` and `prettier-ignore-end`. This is how the link generation block ended up.

- `layouts/_markup/render-link.html`

```go
{{- $u := urls.Parse .Destination -}}
{{- $base := urls.Parse site.BaseURL -}}

{{- $isHTTP := or (eq $u.Scheme "http") (eq $u.Scheme "https") -}}
{{- $isExternal := and $u.IsAbs $isHTTP (ne $u.Hostname $base.Hostname) -}}

{{/* prettier-ignore-start */}}
<a href="{{ .Destination | safeURL }}"
  {{- with .Title }}title="{{ . }}"{{ end -}}{{- if $isExternal }}
    target="_blank" rel="nofollow noopener noreferrer"
  {{ end -}}
  >{{- with .Text }}{{ . }}{{ end -}}{{- if $isExternal }}<span class="sr-only"> (opens in a new tab)</span>{{ end -}}</a>
{{- /* chomp trailing newline */ -}}
{{/* prettier-ignore-end */}}
```

I gotta say, from a subjective standpoint, this code is ugly as hell. But, it does work exactly the way I want it to. Beautiful syntax isn't everything when it comes to Hugo.

### Ope... Not Done Yet

Well, I fixed the extra space being part of the `a` tag, which looks better, but the space is still being included in the markup.

Such as this section with a list of links:

```plaintext
for OpenGraph (opens in a new tab) , HTML schema microdata (opens in a new tab) , and X (Twitter) cards (opens in a new tab) .
```

The generated HTML looks like this:

```html
<p>
  I went through and updated the <code>head</code> with all the optional
  <code>meta</code> tags for SEO and social sharing. Another win for Hugo, as
  they have
  <a
    href="https://gohugo.io/templates/embedded/"
    target="_blank"
    rel="nofollow noopener noreferrer"
    >embedded partial templates<span class="sr-only">
      (opens in a new tab)</span
    ></a
  >
  for
  <a href="https://ogp.me/" target="_blank" rel="nofollow noopener noreferrer"
    >OpenGraph<span class="sr-only"> (opens in a new tab)</span></a
  >
  ,
  <a
    href="https://html.spec.whatwg.org/multipage/microdata.html#microdata"
    target="_blank"
    rel="nofollow noopener noreferrer"
    >HTML schema microdata<span class="sr-only"> (opens in a new tab)</span></a
  >
  , and
  <a
    href="https://developer.x.com/en/docs/twitter-for-websites/cards/overview/abouts-cards"
    target="_blank"
    rel="nofollow noopener noreferrer"
    >X (Twitter) cards<span class="sr-only"> (opens in a new tab)</span></a
  >
  . Extremely convenient.
</p>
```

Extremely inconvenient.

I'm going to try to collapse the entire `a` line in `render-link.html` and see what happens...

```go
{{/* prettier-ignore-start */}}
<a href="{{ .Destination | safeURL }}"{{- with .Title }}title="{{ . }}"{{ end -}}{{- if $isExternal }}target="_blank" rel="nofollow noopener noreferrer"{{ end -}}>{{- with .Text }}{{ . }}{{ end -}}{{- if $isExternal }}<span class="sr-only"> (opens in a new tab)</span>{{ end -}}</a>
{{- /* chomp trailing newline */ -}}
{{/* prettier-ignore-end */}}
```

Which did not fix the issue. Look at the generated HTML directly, there are newlines being added before and after the `a` tags. If I manually remove the newlines, the spacing is corrected.

I need to look closer at this `chomp trailing newline` option that was copied in from the Hugo docs. There is a [string function called Chomp](https://gohugo.io/functions/strings/chomp/#article) in Hugo to remove all trailing newline characters and carriage returns. This might be the ticket.

I was doing some research on `chomp` and where to use it, and was about to open a new discussion on the [Hugo forum](https://discourse.gohugo.io/). As a responsible nerd, I first did some searches on the forum to see if I could find someone else having the same issue. The magic was from a fix identified in [this post](https://discourse.gohugo.io/t/another-extra-space-after-link-issue/51392/3). My `render-link.html` file has a newline at the end of the file. This newline is being added by my HTML formatter automatically, and I'm not sure how to prevent it, since I typically prefer a newline at the end of most files. Dropping `prettier-ignore-end` as the last line in the file didn't help. Other than preventing EOF newlines in all HTML files, I just have to save the `render-link.html` file without formatting and hope I don't accidentally format it later and reintroduce the problem.

## Project Euler P20

Now onto something slightly more interesting, more [Project Euler](https://projecteuler.net). Problem 20 is what I'll try to work on today. P20 states:

> \(n!\) means \(n\times(n-1)\times\cdots\times3\times2\times1\).
>
> For example, \(10!=10\times9\times\cdots\times3\times2\times1=3628800\), and the sum of the digits in the number \(10!\) is \(3+6+2+8+8+0+0=27\).
>
> Find the sum of the digits in the number \(100!\).

We are dealing with another massive number problem, just like in [P16](https://projecteuler.net/problem=16). In this case, [158 decimal digits](https://www.wolframalpha.com/input?i=100%21).

Our exponent problem was solved by performing multiplication using a carry, and moving one digit at a time, saving the result into an array in reverse order.

The algorithm here is different, but similar, since both a factorial and exponent problem deal with multiplication. We have to solve the factorial first, then figure out how to represent the result in an array, then add the digits together.

### Solving a Factorial

As explained in the problem summary, a factorial is a multiplication of every value from \(N\) to \(1\). This is trivial to implement on its own.

```c
#include <stdio.h>

int main() {
  int n = 10;
  int result = n;

  for (int i = n - 1; i > 0; --i) {
    result *= i;
  }

  printf("Result: %i", result);
  return 0;
}
```

Output:

```bash
Result: 3628800
```

> TODO: Just found a bug in my markdown code block rendering. If there is only a single line, there is no gap between the line number and the code. I think I would have noticed this before, so something must have changed along with my other changes in teh last couple days. Always something...

It is getting late though, and as much as I want to finish this program tonight. I'm going to have to do it tomorrow.
