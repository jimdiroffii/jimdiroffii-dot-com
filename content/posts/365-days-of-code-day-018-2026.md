+++
date = '2026-02-07T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 018'
summary = ''
+++

I'm trying to make a decision here. After yesterday's new understanding of how [Hugo Sections](https://cloudcannon.com/blog/the-ultimate-guide-to-hugo-sections/) work, I want to restructure this site a little bit. I always knew I was going to rework some areas, such as the names of these blog posts, but now I want to reconfigure everything from scratch again. The baseline template theme from yesterday gave me some good ideas for a new structure. I've also already had to go back and fix some template issues in this code base. So, now that I know what I'm doing (at least a little bit better), I should be able to avoid some mistakes and get this site structured better for the long term.

After some internal deliberation, I don't think I'll start from scratch, as that really isn't necessary. I just started this site, and there isn't too much debt yet. Modifying what I already have is likely the better choice.

## 404 Robots

I added a custom 404 page while working on the site refactoring. While focusing mostly on the core site functionality, I missed some of the basics, such as a 404 page, or a robots.txt file. I went with a completely customized 404 page, with a flashlight effect. It looks pretty cool. [Try it out](https://www.jimdiroffii.com/thisdoesnotexist)!

## Broken Build / New Server

As I was working on the initial changes last night, I somehow broke the Hugo server rendering, and my site was stuck in a loop. I took advantage of the problem to start with a fresh server, moving from Debian to Ubuntu. I've favored Debian for several years due to Ubuntu's commercialization. But, I've been having some issues with Debian being virtualized on an UnRaid host, and have never had an issue with Ubuntu. I setup the new server, installed the software needed, and moved my repos over. Today, we write on Ubuntu.