+++
date = '2026-03-18T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 057'
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

## Hugo Updates

I discarded all the updates from yesterday and started from scratch in a new branch today. I made some progress on the image processing when I noticed that Hugo had some nice updates for image processing in recent releases. It was time to update Hugo.

Updating Hugo locally is easy, but I did not have a mechanism for updating the Hugo version running in Docker in production.

First, update locally:

```zsh
> wget https://github.com/gohugoio/hugo/releases/download/v0.158.0/hugo_0.158.0_linux-amd64.deb
> sudo dpkg -i ./hugo_0.158.0_linux-amd64.deb
> hugo version
hugo v0.158.0-f41be7959a44108641f1e081adf5c4be7fc1bb63 linux/amd64 BuildDate=2026-03-16T17:42:04Z VendorInfo=gohugoio
```

Let's make sure the site works with the new version. I am anticipating some deprecated notices.

```zsh
hugo server --disableFastRender --logLevel info | grep deprecated
```

We get some notices that the language processing methods has been updated. This requires two updates, one to `baseof.html` and another to `hugo.toml`.

- `baseof.html`

```go
<html
  lang="{{ site.Language.Locale }}"
  dir="{{ or site.Language.Direction `ltr` }}"
>
```

- `hugo.toml`

```toml
locale = 'en-US'
```

With these updated, I'm ready for the hard part, refactoring `Dockerfile`. This required nearly a full rewrite of the `Dockerfile`. I based it off of [this post](https://discourse.gohugo.io/t/alpine-linux-install-hugo-from-a-prebuilt-binary/47551) on the Hugo forum. Luckily, user `dvdksn` had already done this for Docker before. I just needed to merge his code with my requirements.

```Dockerfile
# syntax=docker/dockerfile:1

# ---------------------------------------------------
# Versioning
# ---------------------------------------------------
ARG ALPINE_VERSION=3.23
ARG HUGO_VERSION=0.158.0
ARG NODE_VERSION=24

# ---------------------------------------------------
# Stage 1: Get Hugo Binary
#
# Example download URL from Github Releases page - https://github.com/gohugoio/hugo/releases/
# https://github.com/gohugoio/hugo/releases/download/v0.158.0/hugo_0.158.0_linux-amd64.tar.gz
# ---------------------------------------------------
FROM alpine:${ALPINE_VERSION} AS hugo-downloader
WORKDIR /tmp/hugo
# Redeclare HUGO_VERSION so it can be used in RUN commands
ARG HUGO_VERSION
ARG TARGETARCH
RUN apk add --no-cache wget tar
RUN wget -O "hugo.tar.gz" "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_linux-${TARGETARCH}.tar.gz"
RUN tar -xf "hugo.tar.gz" -C /usr/bin hugo

# ---------------------------------------------------
# Stage 2: Build the static site
# ---------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS builder
RUN apk add --no-cache git
COPY --from=hugo-downloader /usr/bin/hugo /usr/bin/hugo
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN hugo --minify --gc

# ---------------------------------------------------
# Stage 3: Serve with Nginx
# ---------------------------------------------------
FROM nginx:alpine
COPY --from=builder /app/public /usr/share/nginx/html
COPY .nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

I tested locally first.

```zsh
docker build -t local-hugo-test .
docker run -d --name hugo-test-container -p 8080:80 local-hugo-test
docker rm -f hugo-test-container
```

Everything worked great locally, but there was one more change to make. Due to the usage of the `ARG TARGETARCH` command, it was necessary to include `Buildx` in the workflow. And, since `Buildx` was being added, I might as well include caching. These statements were added to the workflow:

```yml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v4

<snip>

  cache-from: type=gha
  cache-to: type=gha,mode=max
```

With everything in place, I pushed the branch up to Github, submitted the PR, and merged the changes. The build fired off without a hitch. Very satisfying.

Now, I can finally get back to working on my image processing!
