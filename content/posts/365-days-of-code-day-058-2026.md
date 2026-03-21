+++
date = '2026-03-19T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 058'
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

## Hugo Image Processing

Back to working on image processing in Hugo today. I made some progress on getting unique images into the processing pipeline for every post. It requires setting up an image in the front matter, and referring to that image in the layout template. Unfortunately, Hugo doesn't yet have full `avif` support, but `webp` is working well.

- `layouts/single.html`

```go
{{/* Check if the front matter has a hero_image defined */}}
{{ if .Params.hero_image }}
  {{/* Grab the image from the page bundle using the front matter variable */}}
  {{ with .Resources.GetMatch .Params.hero_image }}

    {{/* Store the original image */}}
    {{ $original := . }}

    {{/* Process the image into modern formats and resize it (e.g., to 800px wide) */}}
    {{/* {{ $avif := $original.Resize "200x avif" }} */}}
    {{ $webp := $original.Resize "200x webp" }}
    {{ $resizedOriginal := $original.Resize "200x" }}

    {{/* Output the HTML picture element */}}
    <picture>
      {{/* <source srcset="{{ $avif.RelPermalink }}" type="image/avif" /> */}}
      <source srcset="{{ $webp.RelPermalink }}" type="image/webp" />

      <img
        src="{{ $resizedOriginal.RelPermalink }}"
        width="{{ $resizedOriginal.Width }}"
        height="{{ $resizedOriginal.Height }}"
        alt="{{ $.Params.hero_alt | default $.Title }}"
        loading="lazy"
      />
    </picture>
  {{ end }}
{{ end }}
```

- `content/projects/project-2/index.md`

```toml
+++
date = '2026-03-19T00:00:01-05:00'
draft = false
title = 'Project 2'
summary = 'Project 2 Description'
tags = ['project', 'new-project', 'c']
hero_image = "computer.jpg"
hero_alt = "A description of the hero image for accessibility"
+++
```

If the post has a `hero_image` parameter, then Hugo will pick up that image as a page resource, process it into a `webp`, and any other additional options (resized to 200px here), and output new images.
