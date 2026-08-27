# Jim Diroff II Personal Site

[![Deploy Hugo Site](https://github.com/jimdiroffii/jimdiroffii-dot-com/actions/workflows/deploy-docker-jimdiroffii-dot-com.yml/badge.svg)](https://github.com/jimdiroffii/jimdiroffii-dot-com/actions/workflows/deploy-docker-jimdiroffii-dot-com.yml)

- Current Hugo Version: `0.159.2`

[jimdiroffii.com](https://www.jimdiroffii.com)

## Development Notes

If the site will not build, check if `node` is running or is accessible. I have some environment variables applied through zsh that only work if the `node` and `npm` commands have been run before. Try `node -v` and `npm -v`. Then run `hugo server --disableFastRender` to execute.

To access the site, redirect a port to the dev machine.

```bash
ssh -L 1313:localhost:1313 user@server -i /path/to/key
```

## Todo

- [ ] Fix Firefox single-line code block rendering

> TODO: There is an issue with Firefox rendering of single-line code blocks. The spacing between the line number and code syntax. When the code is rendered from Hugo, a newline is added after the line number, and the following `span` closing tag gets pushed to the next line. If the newline is removed, the code block renders correctly. This issue is not present in the default styling of code blocks when setting up a new Hugo template in any browser. The issue is also not present in Chrome with my current styling. Something in my CSS is causing Firefox to render the code block incorrectly when there is only a single line.

## Upgrading

### Hugo

Hugo upgrades often and there are often a lot of changes that could affect the build. Test first, before upgrading.

- Development is happening on Debian/Ubuntu. Download the `deb` file.

[Hugo Releases](https://github.com/gohugoio/hugo/releases)

```bash
cd /tmp
wget https://github.com/gohugoio/hugo/releases/download/v0.165.0/hugo_0.165.0_linux-amd64.deb
```

- Run the installer

```bash
sudo dpkg -i ./hugo_0.165.0_linux-amd64.deb
```

- Rebuild the site and verify it is working

```bash
hugo server --disable-fast-render
```

If all looks good, modify the `Dockerfile`.

```yaml
ARG HUGO_VERSION=0.165.0
```

Save and push changes.

### Alpine and Nginx

The modifiable Alpine image is only used for pulling the Hugo installer. It doesn't have a big impact on the build.

The Nginx build is a bit more important, since it runs the final container that hosts the site. I stick with the stable version.

[Alpine Releases](https://hub.docker.com/_/alpine)
[Nginx Releases](https://hub.docker.com/_/nginx)

Modify the Dockerfile. Been focusing on major releases, so ignoring the minor version numbers.

```yaml
ARG ALPINE_VERSION=3.24
ARG NGINX_VERSION=1.30
```

### Node

Stick with the latest major LTS release. Ensure the local dev environment is updated and tested before modifying this in the Dockerfile.

[Node Releases](https://nodejs.org/en/download)

```yaml
ARG NODE_VERSION=24
```
