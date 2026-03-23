+++
date = '2026-03-14T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 053'
summary = ''
tags = ["365-days-of-code-2026", "ip-protocol-from-scratch", "git", "bash"]
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

## Splitting Code Up Into Branches

Part of writing code is properly managing your VCS. In my IP/ICMP project, I've been adding new folders each time I wanted to create a new version of the project. This is improper, and makes the code base larger than it needs to be. I split the code into branches to support each version.

There are a small number of steps to complete, in order.

1. Checkout `main`
1. Create a new branch
1. Move and remove files
1. Commit
1. Push
1. Repeat

```bash
git checkout main
git checkout -b v1
rm -rf c/v2/ c/v3/
mv c/v1/ip_stack_v1 c/
rm -rf c/v1/
git add .
git commit -S -m "refactor: isolate v1"
git push --set-upstream origin v1
# Restart
git checkout main
git checkout -b v2
rm -rf c/v1/ c/v3/
mv c/v2/ip_stack_v2 c/
rm -rf c/v2/
git add .
git commit -S -m "refactor: isolate v2"
git push --set-upstream origin v2
# Restart
git checkout main
git checkout -b v3
rm -rf c/v1/ c/v2/
mv c/v3/* c/
rm -rf c/v3/
git add .
git commit -S -m "refactor: isolate v3"
git push --set-upstream origin v3
```

Now, everything is nice and organized into branches for each version.

This is all the time I have for code today!
