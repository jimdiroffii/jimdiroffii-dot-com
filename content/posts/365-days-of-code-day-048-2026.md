+++
date = '2026-03-09T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 048'
summary = ''
tags = ["365-days-of-code-2026", "hugo", "coding-challenge"]
+++

## Project Status

| Project                 | Language      | Status          | Due Date   | Latest Update                                                        |
| :---------------------- | :------------ | :-------------- | :--------- | :------------------------------------------------------------------- |
| Personal Website        | Hugo          | Ongoing         | None       | The site is live. Continuous improvements ongoing.                   |
| Laravel From Scratch    | Laravel (PHP) | In-Progress     | 2026-03-31 | Episode 8                                                            |
| PRM                     | Laravel (PHP) | In-Progress     | 2026-03-31 | Working alongside other Laravel projects.                            |
| Client Website (J.L.)   | Laravel (PHP) | In-Progress     | 2026-03-31 | Working alongside other Laravel projects.                            |
| Project Euler           | C             | Ongoing         | None       | Working on P25. BigInt (AI gen) was a waste of time, need to rewrite |
| Practice Java           | Java          | Paused          | None       | Installed, need to find a good project.                              |
| Practice Python         | Python        | Paused          | None       | Installed, need to find a good project.                              |
| Learn Go                | Go            | Paused          | None       | Installed, work on LDAP Injector from ippsec.                        |
| Learn Rust              | Rust          | Haven't Started | None       | Installed, will try network protocols after finishing in C and Zig.  |
| Learn Elixir            | Elixir        | Haven't Started | None       | Installed, need a good tutorial project.                             |
| Learn Haskell           | Haskell       | Haven't Started | None       | Installed, need a good tutorial project.                             |
| Learn Zig               | Zig           | Haven't Started | None       | Installed, will try network protocols after finishing in C.          |
| Linux+                  | N/A           | In-Progress     | 2026-03-31 | Reading Chapter 4.                                                   |
| Cyber Quest 2026        | N/A           | In-Progress     | 2026-02-28 | Finished quiz 1 with 75%.                                            |
| Operating Systems       | N/A           | In-Progress     | 2026-03-31 | Reading Chapter 4: Abstraction                                       |
| Grey-Hat Hacking        | Various       | In-Progress     | 2026-03-31 | Reading Chapter 8: Threat Hunting Lab                                |
| PHP Time Tracker        | PHP           | Beta Finished   | None       | Working on a basic level.                                            |
| HTTP Status Code Reader | C             | Complete        | 2026-02-18 | Complete.                                                            |
| ZSH Configuration       | bash/zsh      | Complete        | None       | Sort of an ongoing process, but complete for now. Works good.        |
| Network Protocols       | C             | In-Progress     | None       | V2 complete. Moving to V3, refactoring again.                        |
| Discinox Website        | HTML, CSS, JS | Complete        | 2026-03-04 | The site is live.                                                    |
| DiroffTech Website      | HTML, CSS, JS | Complete        | 2026-03-05 | The site is live. `git-lfs` needs to be initialized for images.      |
| Automate Backups        | bash          | Complete        | 2026-03-08 | Backups done.                                                        |

## Bookmarks Page

I made a small improvement to this site today. Incorporating a new bookmarks page with some links to free online books. This is a bit of the "old web," where we shared information just because we could and thought it was cool. There was also the need for backlinks, which isn't as relevant anymore since Google reduced the effectiveness of early SEO tactics. I added the bookmarks section for nostalgic purposes, but I also wanted to update the site with some new links. It has been several weeks since I added anything new, and it is good to come back to keep the knowledge fresh.

As expected, adding the new bookmarks page was easy. Create a new link in the navigation, provide a layout, and add the markdown. Hugo really does make this pretty simple.

- `layouts/_partials/header.html`

```go
{{- $links := slice
  (dict "name" "Home" "url" "/")
  (dict "name" "Blog" "url" "/posts/")
  (dict "name" "About" "url" "/about/")
  (dict "name" "Bookmarks" "url" "/bookmarks/")
-}}
```

- `layouts/bookmarks/bookmarks.html`

```go
{{ define "main" }}
  <section class="space-y-6">
    <h1 class="text-4xl font-bold tracking-tight text-center">
      {{ .Title }}
    </h1>

    {{ with .Content }}
      <div class="prose prose-invert max-w-none">
        {{ . }}
      </div>
    {{ end }}
  </section>
{{ end }}
```

- `content/bookmarks/index.md`

```go
+++
title = "Bookmarks"
layout = "bookmarks"
+++

content...
```
