+++
date = '2026-03-05T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 044'
summary = ''
+++

## Project Status

| Project                 | Language      | Status          | Due Date   | Latest Update                                                                                             |
| :---------------------- | :------------ | :-------------- | :--------- | :-------------------------------------------------------------------------------------------------------- |
| Personal Website        | Hugo          | Ongoing         | None       | The site is live. There are some TODOs. Need to work on categorization, tagging, and layout improvements. |
| Laravel From Scratch    | Laravel (PHP) | In-Progress     | 2026-03-31 | Episode 8                                                                                                 |
| PRM                     | Laravel (PHP) | In-Progress     | 2026-03-31 | Working alongside other Laravel projects.                                                                 |
| Client Website (J.L.)   | Laravel (PHP) | In-Progress     | 2026-03-31 | Working alongside other Laravel projects.                                                                 |
| Project Euler           | C             | Ongoing         | None       | Working on P25. BigInt (AI gen) was a waste of time, need to rewrite                                      |
| Practice Java           | Java          | Paused          | None       | Installed, need to find a good project.                                                                   |
| Practice Python         | Python        | Paused          | None       | Installed, need to find a good project.                                                                   |
| Learn Go                | Go            | Paused          | None       | Installed, work on LDAP Injector from ippsec.                                                             |
| Learn Rust              | Rust          | Haven't Started | None       | Installed, will try network protocols after finishing in C and Zig.                                       |
| Learn Elixir            | Elixir        | Haven't Started | None       | Installed, need a good tutorial project.                                                                  |
| Learn Haskell           | Haskell       | Haven't Started | None       | Installed, need a good tutorial project.                                                                  |
| Learn Zig               | Zig           | Haven't Started | None       | Installed, will try network protocols after finishing in C.                                               |
| Linux+                  | N/A           | In-Progress     | 2026-03-31 | Reading Chapter 4.                                                                                        |
| Cyber Quest 2026        | N/A           | In-Progress     | 2026-02-28 | Finished quiz 1 with 75%.                                                                                 |
| Operating Systems       | N/A           | In-Progress     | 2026-03-31 | Reading Chapter 4: Abstraction                                                                            |
| Grey-Hat Hacking        | Various       | In-Progress     | 2026-03-31 | Reading Chapter 8: Threat Hunting Lab                                                                     |
| PHP Time Tracker        | PHP           | Beta Finished   | None       | Working on a basic level. Could use a couple more updates to make it fully functional.                    |
| HTTP Status Code Reader | C             | Complete        | 2026-02-18 | Complete. Could potentially upgrade for more advanced functions or follow redirects.                      |
| ZSH Configuration       | bash/zsh      | Complete        | None       | Sort of an ongoing process, but complete for now. Works good.                                             |
| Network Protocols       | C             | In-Progress     | None       | V2 complete. Moving to V3, refactoring again.                                                             |
| Discinox Website        | HTML, CSS, JS | Complete        | 2026-03-04 | The site is live.                                                                                         |
| DiroffTech Website      | HTML, CSS, JS | In-Progress     | 2026-03-04 | Working on site deployment. `git-lfs` needs to be initialized for images.                                 |

## A Lesson on Spot Instances

The Diroff Tech website has been built for awhile, but has been down for several months. I was using an AWS spot instance to host my websites, which worked without issue for a year or more. Then one day, it was gone. No history, no records. Fortunately, I had all the source code saved for every website, but I did lose all my custom configuration for nginx and other services that were running on that server. This is why I went with a full VPS running on DigitalOcean. Honestly, the AWS server was fine, and fairly cheap for my usage (especially as a spot instance). However, I didn't really need to be running on AWS, and wanted to try out different services.

Of course, I should have known better. I knew spot instances could be removed, I just never had it happen before. I also knew that I should keep backups of critical services, but they never completely disappeared on me before. Lesson learned.

> The cloud is just someone else's computer...

I now keep my private server configurations backed up on a local Gitea instance, that is not on the internet. Good old server hardware that sits right on my desk. That server has multiple redundancies, so now I have at least a couple copies of the critical data I would need to replicate a hosting environment.

## Diroff Technology Consulting Website

One of the sites that I lost was the Diroff Tech website. I would like to get that back up and running, and now I have the infrastructure to do so. After getting [Discinox](https://www.discinox.com) back up yesterday, I felt like it was a good time to work on the Diroff Tech website. This site is a bit more complicated. I hand crafted all the HTML, CS and Javascript, and then ran that through Vite to bundle it all together. I'm noticing now that I wasn't using `git-lfs` on the repository, so I have full images committed with the source code. I may try to fix that too. For now, let's just try to get the site running. I can worry about the git log history later.

### Github Actions

I can use the Github Actions templates from my previous websites, and tweak it a bit to support the Vite build process.

### Docker

The `Dockerfile` will be another basic nginx website template, with additional commands to run a npm build. A new Docker Hub repo was created for the build.

### Webserver

A new deployment user, SSH key, docker compose file, deploy scripts and permissions were setup.

### CORS

I changed the URL from `dirofftech.com` to `www.dirofftech.com`, which required updating the CORS values across several files and the contact form submission API. The contact form is using AWS API Gateway, Lambda, and SES to process emails from the contact form.

### Caddy

The Caddyfile was updated, and boom, the site is live once again.
