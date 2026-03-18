+++
date = '2026-03-17T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 056'
summary = ''
tags = ['365-days-of-code', 'hugo', 'personal-website']
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
| Network Protocols       | C             | In-Progress     | None       | Working on V3, implementing IPv6.                                    |
| Discinox Website        | HTML, CSS, JS | Complete        | 2026-03-04 | The site is live.                                                    |
| DiroffTech Website      | HTML, CSS, JS | Complete        | 2026-03-05 | The site is live. `git-lfs` needs to be initialized for images.      |
| Automate Backups        | bash          | Complete        | 2026-03-08 | Backups done.                                                        |

## Hugo Images

Continuing from yesterday, I want to incorporate some images into this site, and gain a better understanding of the image processing options available in Hugo. I would prefer to upload a single image, such as a `png` file, and have that image processed into different sizes and formats automatically. `avif` should be offered first, then `webp`, and fallback to `png` or `jpg` if necessary.

### Page Resource

My first test was using an image as part of a page resource. I created a new directory at `content/projects/first-project`. I moved the markdown file and the image into this directory. I renamed the markdown to `index.md` and the image to `first-project.png`. Now I can access the image resource directly in the markdown using markdown syntax. No processing is done, and the image renders as-is. This works on the individual project page, but my card component is not referencing the image correctly.

- `content/projects/first-project/index.md`

```go
+++
title = "My Open Source Tool"
summary = "A brief summary of the project. It maps complex requirements to simple solutions, focusing on incident-ready logging."
image = '{{ $image := .Resources.Get "first-project.png"}}'
project_url = "https://github.com/jimdiroffii/my-tool"
tags = ["Go", "Docker", "Tailwind"]
weight = 1
+++

TEST

![first-project.png](first-project.png)
```

Checking on the rendered image for the card component, I can see that the image source is configured as some type of cached object.

```html
<img
  src="#ZgotmplZ"
  alt="Home"
  class="h-48 w-full object-cover border-b border-white/10"
/>
```

## New Branch

This is going to require some more work to fully understand. I haven't been able to dedicate myself to the project as diligently as required. I'm going to revert these changes for now, and start work on a new branch.
