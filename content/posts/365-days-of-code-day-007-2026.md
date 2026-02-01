+++
date = '2026-01-27T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 007'
summary = 'Getting started with Hugo'
+++

Today's goal is to get started with [Hugo](https://gohugo.io). Hugo is a static site generator (SSG) written in Go, and markets itself as the fastest framework for building websites. I liked the idea of Hugo for several reasons.

## No JavaScript

First, Hugo isn't JavaScript. I don't hate JavaScript, but I do believe the [web has suffered from an overreliance on JavaScript](https://www.jonoalderson.com/conjecture/javascript-broke-the-web-and-called-it-progress/). Huge, complex frameworks make building on the web slow and difficult. HTML5 and CSS3 have made great strides towards natively supporting much of what makes the modern web interactive and fun to use. That said, I am using [Tailwind](https://tailwindcss.com/) to configure the CSS for this site, and Tailwind is installed through `npm`. But, this exists totally on the development side, and doesn't affect the UX. Like I said, I don't hate JavaScript, it is just a tool. We should just be mindful of using JavaScript where it is necessary, not everywhere we can.

## No Dependencies

Ignoring my reliance on Tailwind for development, Hugo doesn't require any dependencies to use, it is essentially just one executable. I like that simplicity. Sure, I'm adding Tailwind on so I don't have to write all my CSS by hand, but the key difference is that the site itself doesn't require any of these dependencies once it is built. Just deploy a stack of static files and (Hu)go.

## Built-in Dev Server

Sure, PHP has a built-in server, and hot-reloading with Vite is pretty cool, but the Hugo development server works great and doesn't require any additional configuration. I like tight feedback loops: change a file, refresh, repeat. Hugo’s dev server makes that feel instant, and that encourages me to write more, tweak more, and iterate more. I’m not staring at a bundler spinner wondering what it’s doing this *this* time.

## Markdown Native

All the content is written in Markdown. I love this workflow, and was one of my top reasons for moving to Hugo. Writing in Markdown is a breeze, and its compatible with so many systems. Since I decided to start blogging every single day, trying to write up everything directly into HTML was a huge pain point. I missed Markdown, and needed to get it back ASAP.

## Getting Started With Hugo

It actually wasn't easy to get started with Hugo. The documentation is quite good, but the documentation isn't structure for learning Hugo from scratch. There is a quickstart guide, but it relies on using a Hugo template, and I wanted to start from scratch. I did take a look at a couple templates, but they might as well be written in hieroglphics for someone who has never dealt with the Hugo templating system before. Sometimes, it is helpful to have a template, but more often than not I find it helpful to build things myself starting from nothing.

A base installation of Hugo comes with practically no configuration, and doesn't work right away. In my opinion, I would change the default Hugo installation so that it can work out of the box. It took a little while, and some AI help, to realize that Hugo needs three essential files to begin development: `baseof.html`, `single.html` and `list.html`.

- `baseof.html`: This is the core template for all pages.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ .Title }} | Jim Diroff II</title>
    <style>
        body { max-width: 800px; margin: 0 auto; font-family: sans-serif; line-height: 1.6; padding: 20px; }
        header, nav { margin-bottom: 40px; }
        a { color: #007bff; text-decoration: none; }
        code { background: #f4f4f4; padding: 2px 5px; }
    </style>
</head>
<body>
    <header>
        <nav>
            <a href="/"><strong>Home</strong></a> | 
            <a href="/posts/">Blog</a>
        </nav>
    </header>

    <main>
        {{ block "main" . }}{{ end }}
    </main>

    <footer>
        <hr>
        <p>&copy; 2026 Jim Diroff II</p>
    </footer>
</body>
</html>
```

- `single.html`: This controls how a single markdown file is rendered. It populates the `main` block of the `baseof.html` template.

```html
{{ define "main" }}
<article>
    <h1>{{ .Title }}</h1>
    <time>{{ .Date.Format "January 2, 2006" }}</time>
    
    <div class="content">
        {{ .Content }}
    </div>
</article>
{{ end }}
```

- `list.html`: This controls how a list of markdown files is rendered, as well as the home page. It also populates the `main` block of the `baseof.html` template.

```html
{{ define "main" }}
    <h1>{{ .Title }}</h1>
    
    <ul>
        {{ range .Pages }}
        <li>
            <a href="{{ .Permalink }}">{{ .Title }}</a>
            <small>({{ .Date.Format "2006-01-02" }})</small>
        </li>
        {{ end }}
    </ul>
{{ end }}
```

With these three files created, the Hugo development server has something to work with.

```bash
hugo server
```

Of course, there isn't any content yet, so let's create something. The only file Hugo ships with is an `archetype`, which structures a basic markdown file.

```bash
hugo new content content/posts/test.md
```

Importantly, this new content file will not be rendered until `draft` is set to `false` in the frontmatter.

- `default.md`: The base archetype created by Hugo, notice `draft = true` in the frontmatter. New files will take on this option.

```toml
+++
date = '{{ .Date }}'
draft = true
title = '{{ replace .File.ContentBaseName "-" " " | title }}'
+++
```

## Configuring Tailwind CSS

The [Hugo Docs have a section for how to setup Tailwind](https://gohugo.io/functions/css/tailwindcss/#article). I also setup the typography plugin for Tailwind, to get some base styling on single markdown files. The installation for the typography plugin can be found on [Github](https://github.com/tailwindlabs/tailwindcss-typography).

## Testing Github Actions and Docker Deployment

With Hugo setup and configured, it was time to test the deployment workflow. First, the `Dockerfile`:

```Dockerfile
FROM node:22-alpine AS builder
RUN apk add --no-cache hugo go git
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN hugo --minify --gc
FROM nginx:alpine
COPY --from=builder /app/public /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Second, the compose file:

```yaml
ervices:
  hugo-site:
    image: jimdtech/jimdiroffii-dot-com:latest
    container_name: jimdiroffii-dot-com
    restart: unless-stopped
    expose:
      - '80'
    networks:
      - web-public

networks:
  web-public:
    external: true
```

And last, the action deployment file:

```yaml
name: Deploy Hugo Site

on:
  push:
    branches: [ "hugo" ]
    paths-ignore:
      - 'README.md'
      - '.gitattributes'
      - '.gitignore'
      - '.vscode/**'
      - 'LICENSE'
      - '.idea/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Check out the repo
        uses: actions/checkout@v4
        with:
          lfs: true
          fetch-depth: 0

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: Dockerfile
          push: true
          tags: jimdtech/jimdiroffii-dot-com:latest

      - name: Deploy to DigitalOcean
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.DO_HOST }}
          username: ${{ secrets.DO_USERNAME }}
          key: ${{ secrets.DO_SSH_KEY }}
          script: |
            # Navigate to the project directory
            cd /opt/docker/jimdiroffii-dot-com
            
            # Pull the new image we just pushed
            docker compose pull
            
            # Recreate the container with the new image
            docker compose up -d
            
            # Clean up old images to save disk space
            docker system prune -f
```

As you can see, very similar to my test application from the previous day. This is the normal way to learn how to do something, iterative progress and building up complexity.
