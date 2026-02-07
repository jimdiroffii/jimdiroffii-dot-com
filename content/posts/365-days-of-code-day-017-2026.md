+++
date = '2026-02-06T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 017'
summary = ''
+++

Day 17. Things have been going pretty well. Other than class work, this is one of my most consistent streaks of getting things done. The value of what I have done so far could be debated, but it is something I've wanted to do for a long time. Here I am! Blogging like it is 2006 and not 2026! I've been reviewing the site files, and found some inconsistencies with the styling. There are some more features that I want to add, such as tagging/categorization of posts, project cards, side bars, footer navigation, social links, and more. However, I blasted through the development of this new site, and was learning Hugo as I went along. Therefore, I've ended up with some technical debt in the page templates that I want to get in order before adding more features.

My first fix was to correct the display of `h1` tags across pages. I also found that the `main` tag was being duplicated in some layouts. Getting those two issues fixed up helped provide a consistent look across the primary pages. Seeing these issues made me consider that there were probably a lot of inconsistences in the layouts, so I'm going to go over the entire site.

While I was doing some research on Hugo best practices and code formatting, I finally found the template I was looking for. I really wish this option was in the Hugo getting-started guide. `hugo-formatting` is just the folder name where the project is stored.

```bash
hugo new theme hugo-formatting --themesDir .
```

This command gives you a full directory layout, with default files in place. Including some basic assets, page templates, partials, tagging, and more.

```bash
❯ tree -a
.
├── archetypes
│   └── default.md
├── assets
│   ├── css
│   │   └── main.css
│   └── js
│       └── main.js
├── content
│   ├── _index.md
│   └── posts
│       ├── _index.md
│       ├── post-1.md
│       ├── post-2.md
│       └── post-3
│           ├── bryce-canyon.jpg
│           └── index.md
├── data
├── .hugo_build.lock
├── hugo.toml
├── i18n
├── layouts
│   ├── baseof.html
│   ├── home.html
│   ├── page.html
│   ├── _partials
│   │   ├── footer.html
│   │   ├── head
│   │   │   ├── css.html
│   │   │   └── js.html
│   │   ├── header.html
│   │   ├── head.html
│   │   ├── menu.html
│   │   └── terms.html
│   ├── section.html
│   ├── taxonomy.html
│   └── term.html
├── public
│   ├── categories
│   │   ├── index.html
│   │   └── index.xml
│   ├── css
│   │   └── main.css
│   ├── favicon.ico
│   ├── index.html
│   ├── index.xml
│   ├── js
│   │   ├── main.js
│   │   └── main.js.map
│   ├── posts
│   │   ├── index.html
│   │   ├── index.xml
│   │   ├── post-1
│   │   │   └── index.html
│   │   ├── post-2
│   │   │   └── index.html
│   │   └── post-3
│   │       ├── bryce-canyon.jpg
│   │       └── index.html
│   ├── sitemap.xml
│   └── tags
│       ├── blue
│       │   ├── index.html
│       │   └── index.xml
│       ├── green
│       │   ├── index.html
│       │   └── index.xml
│       ├── index.html
│       ├── index.xml
│       └── red
│           ├── index.html
│           └── index.xml
└── static
    └── favicon.ico
```

This would have been immensely helpful when I was just starting out. I'll be making some changes to my site layout based on this starter template theme. Everything is much easier to understand. I may even migrate all of the customized content over to this starter theme.

I had to do more reading on the subject, and found [this article](https://cloudcannon.com/blog/the-ultimate-guide-to-hugo-sections/) from [CloudCannon](https://cloudcannon.com), which does an excellent job of breaking down how the sections work. I have a saying that I like to use...

> You do everything better the second time.

As far as I'm aware, I'm the first person to publicly use that exact phrase. It speaks to something I've encountered over and over again with everything I've done in life where you get a second chance. First time around, you learn the ropes, try to understand, and make a lot of mistakes. Then, if you can do it again, you'll be faster, better, and more proficient. It doesn't matter if you are building a bird house or a web application. Your second one will always be better than your first.

## Hugo Formatting

I added a proper Hugo file formatter to my VS Code settings. I created a new profile called `Hugo`, and only added the extensions needed.

- Prettier (both extension and npm package)
- prettier-plugin-go-template (npm package)
- Tailwind CSS IntelliSense
- Hugo Language and Syntax Support
- Even Better TOML
