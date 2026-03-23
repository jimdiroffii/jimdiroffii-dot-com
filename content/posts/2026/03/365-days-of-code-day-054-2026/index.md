+++
date = '2026-03-15T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 054'
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

## Privacy Policies and Relative Link Generation

I added a Privacy Policy to this page, and my other simple websites, to explain to users that I **do not** collect any information for marketing or advertising purposes. There isn't a single cookie in use.

This involved not only creating the new privacy page, but also getting the URL generated in the footer.

This lead me to fixing another problem I was having, which was relative URLs that would change depending on the environment. I had hardcoded the URL for the branding badge on the top left of the page because I was having issues with the linter I'm using in VS Code rewriting the quotes.

This:

```go
<a href='{{ "/" | relLangURL }}' class="text-lg font-bold">
  {{ $brand }}
</a>
```

Was automatically being changed to this:

```go
<a href="{{ "/" | relLangURL }}" class="text-lg font-bold">
  {{ $brand }}
</a>
```

Which breaks things. But, I didn't want to remove the linter/formatter extension, so I needed a workaround. Adding a variable turned out to the be trick.

```go
{{- $home := "/" | relLangURL -}}
<a href="{{ $home }}" class="text-lg font-bold"> {{ $brand }} </a>
```

And...

```go
{{- $privacy := "/privacy/" | relLangURL -}}
<a class="underline" href="{{ $privacy }}">Privacy Policy</a>
```

This fix added the proper relative URL, as well as solved the quoting problem.

## Tagging Posts

Hugo natively supports tagging (taxonomy) of posts, but I haven't utilized it yet. Fortunately, as with most things in Hugo, this was pretty simple.

First, add a tags array to the front matter in a post, and the archetype for posts. The archetype is the same as below, just an empty array.

```toml
+++
date = '2026-03-15T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 054'
summary = ''
tags = ['365-days-of-code-2026', 'hugo', 'personal-website']
+++
```

In both `single.html` and `list.html`, which renders posts or lists of posts, respectively, loop over the tags array.

```go
{{ with .Params.tags }}
  <ul class="flex flex-wrap gap-2 mb-2 justify-center" aria-label="Tags">
    {{ range . }}
      <li>
        <a
          class="rounded-full border border-white/10 bg-white/90 px-2 py-0.5 text-xs text-slate-800 hover:bg-white/80"
          href="{{ (printf "/tags/%s/" (. | urlize)) | relURL }}"
        >
          {{ . }}
        </a>
      </li>
    {{ end }}
  </ul>
{{ end }}
```

And that's it. The tag pages are automatically generated by Hugo as part of the build process.

## Tagging Posts and Codex (helping?)

Now is the harder part, or more accurately, the tedious part. Going back through all the posts to generate tags. Fortunately, we have AI tools which can help speed through this process. I ran all of the posts through OpenAI Codex, and generated tags for every post. Now, was this truly a timesaving measure? Even though I was able to generate tags for all posts, and the results were about 70% accurate, I still had to manually check every single post and correct any tags. This took just as long, if not longer, then just adding the tags myself. A clear example of the pseudo-productivity gains given my AI. I was pretty explicit with my prompts, and I still had a ton of useless tags in my posts that needed to be corrected.

## Related Content

I added the partial for related content as well. I used the default filtering options, but customized the appearance to match the theme from lists. It would probably be a good idea to factor out the styling from the lists so that I can modify both the lists and related content list at the same time.

- `related.html`

```go
{{ with site.RegularPages.Related . | first 5 }}
  <div class="border-b border-slate-100"></div>
  <p class="flex justify-center text-2xl font-bold">Related content</p>
  <ul>
    {{ range . }}
      <li class="mb-2">
        <article
          class="rounded-xl border border-white/10 bg-white/5 p-5 sm:p-6 transition hover:bg-white/10 focus-within:ring-2 focus-within:ring-blue-500/60"
        >
          <header
            class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between"
          >
            <h2 class="text-lg sm:text-xl font-semibold leading-snug">
              <a
                class="text-white underline-offset-4 hover:underline focus:outline-none"
                href="{{ .RelPermalink }}"
              >
                {{ .LinkTitle }}
              </a>
            </h2>

            <p class="text-sm text-slate-300">
              <time datetime="{{ .Date.Format " 2006-01-02T15:04:05Z07:00" }}">
                {{ .Date.Format "Jan 2, 2006" }}
              </time>
            </p>
          </header>

          {{/* Prefer explicit summary, fall back to auto-summary */}}
          {{ $summary := "" }}
          {{ with .Params.summary }}
            {{ $summary = . }}
          {{ else }}
            {{ $summary = (.Summary | plainify) }}
          {{ end }}

          {{ with $summary }}
            <p class="mt-3 text-slate-200 leading-relaxed">
              {{ . | htmlUnescape | truncate 200 }}
            </p>
          {{ end }}


          <footer
            class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-300"
          >
            <span>{{ .ReadingTime }} min read</span>

            {{ with .Params.tags }}
              <span class="text-slate-500">•</span>
              <ul class="flex flex-wrap gap-2" aria-label="Tags">
                {{ range . }}
                  <li>
                    <a
                      class="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-xs text-slate-200 hover:bg-white/10"
                      href="{{ (printf "/tags/%s/" (. | urlize)) | relURL }}"
                    >
                      {{ . }}
                    </a>
                  </li>
                {{ end }}
              </ul>
            {{ end }}
          </footer>
        </article>
      </li>
    {{ end }}
  </ul>
{{ end }}
```
