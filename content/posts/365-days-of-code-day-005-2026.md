+++
date = '2026-01-25T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 005'
+++

More administration work today. I needed a new webserver, as my old AWS server was deleted because I accidentally left it as a spot instance. I started a new DigitalOcean server to give their service a fair shot. This lead me to setting up a private instance of [Gitea](https://about.gitea.com/) on my local server to start a repo for server configurations that I do not want to post on the public internet (Github). That further led me down a rabbit hole where I found out my development server could not see any [Tailscale](https://tailscale.com/) machines due to a DNS issue. Once again, none of this is technically code, so I need to find something else to work on. I'm already a few days out from the last time I worked on my Laravel tutorial, and associated sites, so I need to get cranking on that. First, I need to get my new Personal Relationship Manager repo up to date.

The [DigitalOcean](https://www.digitalocean.com/) server is running [Ubuntu](https://ubuntu.com/), and before I install any production software, I need to go through some hardening steps. Preventing root user login, setting up new users, enabling firewall rules, fail2ban configuration, software removal, and more. The [Center for Internet Security](https://www.cisecurity.org/) publishes hardening guides mapped to [NIST 800-53](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final) controls. The Ubuntu hardening guide is over 1000 pages. While I don't need every single control, it is a helpful guide for targeting a secure configuration.

The Gitea setup was pretty smooth. I used the container version, which I hosted on [Unraid](https://unraid.net/). The UI is practically identical to Github, so onboarding was quick and easy. I also setup mirroring for all my Github repos, so I have another copy that automatically updates.

My DNS issue was annoying but ultimately pretty simple to fix. The issue was that `resolv.conf` was being fought over by dhcpd and Tailscale, and dhcpd was always winning the fight. I had to add `nohook resolv.conf` to my `dhcpcd.conf` configuration, which resolved the issue.

Writing up all of these articles into HTML is not a very fun experience. I much prefer writing in Markdown, and Markdown also gives me the option to migrate to a different platform quite easily without changing my writing style or posts. I have changed this so many times, from [Wordpress](https://wordpress.com/) to [Astro](https://astro.build/) to [11ty](https://www.11ty.dev/) to something else I can't even remember. Today, I was looking at [Ghost](https://ghost.org/) and [Hugo](https://gohugo.io/). I really like static sites for type of content. It is fast and easy. I think I'm going to go with Hugo.

If we can call it code, I wrote some Markdown today. I created a readme for the [PRM repo](https://github.com/jimdiroffii/personal-relationship-manager), so that I could know where to start with the [Laravel](https://laravel.com/) configuration. I installed the [LiveWire](https://livewire.laravel.com/) starter template, which enabled a number of things, including authentication, but I need to review all of the code generated before I can really begin making edits. The readme file structures the first steps needed to get the application up and running with a MVP alpha build.
