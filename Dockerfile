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
