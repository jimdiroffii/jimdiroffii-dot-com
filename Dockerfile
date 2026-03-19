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