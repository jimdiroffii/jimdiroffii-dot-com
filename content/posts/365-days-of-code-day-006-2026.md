+++
date = '2026-01-26T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 006'
summary = 'Migrating to Caddy, Docker configuration, and testing Github Actions workflow'
+++

## Introduction

Today is new server setup and testing day. My goal is to have a complete workflow from local development, pushing to [Github](https://github.com/), deploying to [Docker Hub](https://hub.docker.com/), and then automatically updating a hosted container. I started with [Nginx Proxy Manager](https://nginxproxymanager.com/), but eventually moved to [Caddy](https://caddyserver.com/) as the proxy. Automatic support for both `http/3` and `https` was the primary motivator. I also setup an app container to test the deployment workflow.

## Caddy

The Caddy setup was quick and easy. Both the Docker Compose file and the Caddyfile configuration is very straightforward. I setup Caddy to bind `80/TCP` and `443/TCP/UDP`, and used bind mounts for configuration files and logs. This ensures I can utilize `http/3`, backup my certificates, and easily access the `Caddyfile` and log files.

```yaml
services:
  app:
    image: 'caddy:latest'
    container_name: caddy
    restart: unless-stopped
    ports:
      - '80:80'
      - '443:443'
      - '443:443/udp'
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - ./caddy_data:/data/caddy
      - ./caddy_config:/config/caddy
      - ./logs:/var/log/caddy
    networks:
      - web-public

networks:
  web-public:
    external: true
```

The `Caddyfile` is also incredibly simple. Just point to the container name, and provide a log file.

```caddyfile
example.com {
  reverse-proxy container-name:80
  log {
    output file /var/log/caddy/example.com-access.log
  }
}
```

## Test App Container

To test the Github Actions workflow, I created a testing container with a simple `index.html` file and `nginx`. The `Dockerfile` is as simple as it gets.

```Dockerfile
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
```

Next, I created a repository on Docker Hub, and created a docker compose file on the webserver.

```yaml
services:
  webapp:
    image: jimdtech/test-deployment-workflow:latest
    container_name: test-app
    restart: unless-stopped
    expose:
      - '80'
    networks:
      - web-public

networks:
  web-public:
    external: true
```

The workflow file is also pretty simple. All the secrets are stored in Github Actions secrets configuration. We first checkout the repo branch `main`, login to Docker Hub, build and push a new container, and then deploy that container directly to the DigitalOcean server. In a true production environment, there would be more steps, such as staging and testing, but this was good enough to start with.

```yaml
name: Build and Push to Docker Hub

on:
  push:
    branches: [ "main" ]
    paths-ignore:
      - 'README.md'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Check out the repo
        uses: actions/checkout@v4

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: jimdtech/test-deployment-workflow:latest

      - name: Deploy to DigitalOcean
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.DO_HOST }}
          username: ${{ secrets.DO_USERNAME }}
          key: ${{ secrets.DO_SSH_KEY }}
          script: |
            cd /opt/docker/test-app
            docker compose pull
            docker compose up -d
            docker system prune -f
```

With everything in place, I can now make local changes to the repo, push them up to Github, and watch the workflow run.
