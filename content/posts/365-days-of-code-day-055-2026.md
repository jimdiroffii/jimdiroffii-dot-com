+++
date = '2026-03-16T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 055'
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

## First Hugo Images / Projects

Since the beginning of this new site, I have avoided all images. Not because I didn't want to include them ever, but it really wasn't necessary for what I was trying to do. I started to build out some content cards for the projects I've been working on, and wanted to include them on the homepage. The card layout I wanted includes a picture in the card, and this was my first real use.

To test, I created a new layout for project cards. I wanted a way that I could provide metadata for a project, and have the layout loop over created project files to display them. This would make it easy to add, remove and order the projects as needed. The first layout was pretty simple. I populated the following into my homepage layout.

- `layouts/index.html`

```go
<section class="mt-12 space-y-6">
  <h2 class="text-2xl font-semibold">Projects</h2>

  <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {{ range sort (where site.RegularPages "Section" "projects") "Weight" }}
      <a
        href="{{ .Params.project_url }}"
        target="_blank"
        rel="noopener noreferrer"
        class="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-colors hover:bg-white/10 decoration-none group"
      >
        {{ with .Params.image }}
          <img
            src="{{ . }}"
            alt="{{ $.Title }}"
            class="h-48 w-full object-cover border-b border-white/10"
          />
        {{ else }}
          <div
            class="h-48 w-full bg-[#02000f] border-b border-white/10 flex items-center justify-center"
          >
            <span class="text-white/30 text-sm">No Image</span>
          </div>
        {{ end }}


        <div class="flex flex-1 flex-col p-5 space-y-3">
          <h3
            class="text-xl font-bold text-white group-hover:text-blue-400 transition-colors"
          >
            {{ .Title }}
          </h3>

          <p class="text-sm text-white/70 flex-1 leading-relaxed">
            {{ .Params.summary }}
          </p>

          {{ with .Params.tags }}
            <div class="flex flex-wrap gap-2 pt-2">
              {{ range . }}
                <span
                  class="inline-flex items-center rounded-md bg-[#363636] px-2 py-1 text-xs font-medium text-slate-300"
                >
                  {{ . }}
                </span>
              {{ end }}
            </div>
          {{ end }}
        </div>
      </a>
    {{ end }}

  </div>
</section>
```

Then created a new content directory for the projects. This would not only provide the scaffolding for the cards, but also allow me to create dedicated project pages within the site.

- `content/projects/first-project.md`

```go
+++
title: "My Open Source Tool"
summary: "A brief summary of the project. It maps complex requirements to simple solutions, focusing on incident-ready logging."
image: "/images/ip.png"
project_url: "https://github.com/jimdiroffii/my-tool"
tags: ["Go", "Docker", "Tailwind"]
weight: 1
+++
```

All the usual suspects are here in the front matter. I also created a generic image that I could use for testing and uploaded it at `assets/images/ip.png`. Unfortunately, I couldn't get the image to display correctly. I tried different paths in the front matter, and also used the Hugo docs to reference a global image `{{ $image := resources.Get "images/ip.png" }}`, but no luck. When I checked the `public/` directory, it didn't look like Hugo processed the image at all. If I had to guess, it would be because Hugo didn't see me use the image anywhere successfully.

Looking back at the documentation, my suspicion was correct, and I wasn't telling Hugo to ever render the image.

```go
{{ $image := .Resources.GetMatch "sunset.jpg" }}
<img src="{{ $image.RelPermalink }}" width="{{ $image.Width }}" height="{{ $image.Height }}">
```

Once the image was rendered in a layout, the build processed it and populated the correct folder and image in the public directory.

I'll need to work on this some more to get it exactly right.
