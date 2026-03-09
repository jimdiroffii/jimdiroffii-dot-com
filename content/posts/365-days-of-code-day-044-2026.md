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
| DiroffTech Website      | HTML, CSS, JS | In-Progress     | 2026-03-05 | Working on site deployment. `git-lfs` needs to be initialized for images.                                 |

## A Lesson on Spot Instances

The Diroff Tech website has been built for awhile, but has been down for several months. I was using an AWS spot instance to host my websites, which worked without issue for a year or more. Then one day, it was gone. No history, no records. Fortunately, I had all the source code saved for every website, but I did lose all my custom configuration for nginx and other services that were running on that server. This is why I went with a full VPS running on DigitalOcean. Honestly, the AWS server was fine, and fairly cheap for my usage (especially as a spot instance). However, I didn't really need to be running on AWS, and wanted to try out different services.

Of course, I should have known better. I knew spot instances could be removed, I just never had it happen before. I also knew that I should keep backups of critical services, but they never completely disappeared on me before. Lesson learned.

> The cloud is just someone else's computer...

I now keep my private server configurations backed up on a local Gitea instance, that is not on the internet. Good old server hardware that sits right on my desk. That server has multiple redundancies, so now I have at least a couple copies of the critical data I would need to replicate a hosting environment.

## Diroff Technology Consulting Website

One of the sites that I lost was the Diroff Tech website. I would like to get that back up and running, and now I have the infrastructure to do so. After getting [Discinox](https://www.discinox.com) back up yesterday, I felt like it was a good time to work on the Diroff Tech website. This site is a bit more complicated. I hand crafted all the HTML, CS and Javascript, and then ran that through Vite to bundle it all together. I'm noticing now that I wasn't using `git-lfs` on the repository, so I have full images committed with the source code. I may try to fix that too. For now, let's just try to get the site running. I can worry about the git log history later.

### Github Actions

I can use the Github Actions templates from my previous websites, and tweak it a bit to support the Vite build process.

```yaml
name: Deploy Vite Site

on:
  push:
    branches: ["main"]
    paths-ignore:
      - "README.md"
      - ".gitattributes"
      - ".gitignore"
      - ".vscode/**"
      - "LICENSE"
      - ".idea/**"

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
          tags: jimdtech/dirofftech-dot-com:latest

      - name: Deploy to DigitalOcean
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.DO_HOST }}
          username: ${{ secrets.DO_USERNAME }}
          key: ${{ secrets.DO_SSH_KEY }}
          script: echo "Triggering deployment script on DigitalOcean"
```

### Docker

The `Dockerfile` will be another basic nginx website template, with additional commands to run a npm build. A new Docker Hub repo was created for the build.

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Webserver

A new deployment user, SSH key, docker compose file, deploy scripts and permissions were setup.

```bash
# New user
sudo adduser --disabled-password --gecos "" newuser
# SSH setup
sudo mkdir /home/newuser/.ssh
sudo chown -R newuser:newuser /home/newuser/.ssh
sudo chmod 700 /home/newuser/.ssh
sudo touch /home/newuser/.ssh/authorized_keys
sudo chmod 600 /home/newuser/.ssh/authorized_keys
sudo echo "new key file" | sudo tee -a /home/newuser/.ssh/authorized_keys
# Lock down the SSH login in authorized keys
command="/path/to/script.sh",no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty public-key
# Create new script, and set permissions
touch /path/to/script.sh
chown newuser:newuser /path/to/script.sh
chmod 770 /path/to/script.sh
# Add to docker group
sudo usermod -aG docker newuser
```

### Caddy

The Caddyfile was updated, and boom, the site is live once again.

```caddyfile
dirofftech.com {
        redir https://www.dirofftech.com{uri} permanent
        log {
                output file /var/log/caddy/access-dirofftech.com.log
        }
}

www.dirofftech.com {
        reverse_proxy dirofftech-dot-com:80
        log {
                output file /var/log/caddy/access-www.dirofftech.com.log
        }
}
```

### CORS

I kept having CORS issues after deployment, and it took a little troubleshooting to figure it out. I changed the URL from `dirofftech.com` to `www.dirofftech.com`, which required updating the CORS values across several files and the contact form submission API. The contact form is using AWS API Gateway, Lambda, and SES to process emails from the contact form. Once everything matched up. The emails started flowing again.

### Vite Image Processing

Back when I built this site out, I had do perform some major workarounds when using Vite's image processing. I wanted to use my full-size images in the source code, and then present `avif` and `webp` formats in place of the default `jpeg`. In addition to the fallback images, I wanted to ensure that they would automatically resize to smaller images depending on the screen size. This involved some serious shenanigans with JS to get functioning properly. Per my comments on the scripts:

> The issue isn't with Vite itself, but rather a mismatch between what we're asking it to do and how it's designed to work with plain HTML. Vite's asset handling and plugins (like vite-imagetools) are designed to work on modules within a dependency graph. When you use import in a JavaScript file, that file becomes part of a graph. Vite traverses this graph during the build, transforming assets as it goes. The Static HTML Limitation: A plain `index.html` file is the entry point, but it's not truly part of the module graph in the same way a JS file is. Vite reads the HTML and finds links to assets (like `<script src="...">`), but it doesn't deeply parse the HTML to transform `srcset` attributes with special query parameters.

To get around this limitation, I first needed to create an image manifest in JS.

- `image-manifest.js`

```javascript
// --- Hero Image Imports ---
import heroAvif from "/assets/images/dark_server_racks_blue_lights.png?w=360;768;1280;1920;2560&format=avif&as=srcset";
import heroWebp from "/assets/images/dark_server_racks_blue_lights.png?w=360;768;1280;1920;2560&format=webp&as=srcset";
import herojpeg from "/assets/images/dark_server_racks_blue_lights.png?w=360;768;1280;1920;2560&format=jpeg&as=srcset";
import heroFallback from "/assets/images/dark_server_racks_blue_lights.png?w=1280&format=jpeg";

// --- Service Placard Image Imports ---
import p1Avif from "/assets/images/dark_server_rack_white_walls.png?w=375;750&format=avif&aspect=16:9&as=srcset";
import p1Webp from "/assets/images/dark_server_rack_white_walls.png?w=375;750&format=webp&aspect=16:9&as=srcset";
import p1jpeg from "/assets/images/dark_server_rack_white_walls.png?w=375;750&format=jpeg&aspect=16:9&as=srcset";
import p1Fallback from "/assets/images/dark_server_rack_white_walls.png?w=375&format=jpeg&aspect=16:9";

import p2Avif from "/assets/images/cloud_dashboard_laptop_office.png?w=375;750&format=avif&aspect=16:9&as=srcset";
import p2Webp from "/assets/images/cloud_dashboard_laptop_office.png?w=375;750&format=webp&aspect=16:9&as=srcset";
import p2jpeg from "/assets/images/cloud_dashboard_laptop_office.png?w=375;750&format=jpeg&aspect=16:9&as=srcset";
import p2Fallback from "/assets/images/cloud_dashboard_laptop_office.png?w=375&format=jpeg&aspect=16:9";

import p3Avif from "/assets/images/compliance_checklist_pci_cmmc.png?w=375;750&format=avif&aspect=16:9&as=srcset";
import p3Webp from "/assets/images/compliance_checklist_pci_cmmc.png?w=375;750&format=webp&aspect=16:9&as=srcset";
import p3jpeg from "/assets/images/compliance_checklist_pci_cmmc.png?w=375;750&format=jpeg&aspect=16:9&as=srcset";
import p3Fallback from "/assets/images/compliance_checklist_pci_cmmc.png?w=375&format=jpeg&aspect=16:9";

import p4Avif from "/assets/images/airport_point_of_sale_pos.png?w=375;750&format=avif&aspect=16:9&as=srcset";
import p4Webp from "/assets/images/airport_point_of_sale_pos.png?w=375;750&format=webp&aspect=16:9&as=srcset";
import p4jpeg from "/assets/images/airport_point_of_sale_pos.png?w=375;750&format=jpeg&aspect=16:9&as=srcset";
import p4Fallback from "/assets/images/airport_point_of_sale_pos.png?w=375&format=jpeg&aspect=16:9";

import p5Avif from "/assets/images/dark_red_desktop_hack_security.png?w=375;750&format=avif&aspect=16:9&as=srcset";
import p5Webp from "/assets/images/dark_red_desktop_hack_security.png?w=375;750&format=webp&aspect=16:9&as=srcset";
import p5jpeg from "/assets/images/dark_red_desktop_hack_security.png?w=375;750&format=jpeg&aspect=16:9&as=srcset";
import p5Fallback from "/assets/images/dark_red_desktop_hack_security.png?w=375&format=jpeg&aspect=16:9";

import p6Avif from "/assets/images/bricked_computer_system_hardening.png?w=375;750&format=avif&aspect=16:9&as=srcset";
import p6Webp from "/assets/images/bricked_computer_system_hardening.png?w=375;750&format=webp&aspect=16:9&as=srcset";
import p6jpeg from "/assets/images/bricked_computer_system_hardening.png?w=375;750&format=jpeg&aspect=16:9&as=srcset";
import p6Fallback from "/assets/images/bricked_computer_system_hardening.png?w=375&format=jpeg&aspect=16:9";

// Export a structured object that our loader can use
export const imageManifest = {
  dark_server_racks_blue_lights: {
    avif: heroAvif,
    webp: heroWebp,
    jpeg: herojpeg,
    fallback: heroFallback,
  },
  dark_server_rack_white_walls: {
    avif: p1Avif,
    webp: p1Webp,
    jpeg: p1jpeg,
    fallback: p1Fallback,
  },
  cloud_dashboard_laptop_office: {
    avif: p2Avif,
    webp: p2Webp,
    jpeg: p2jpeg,
    fallback: p2Fallback,
  },
  compliance_checklist_pci_cmmc: {
    avif: p3Avif,
    webp: p3Webp,
    jpeg: p3jpeg,
    fallback: p3Fallback,
  },
  airport_point_of_sale_pos: {
    avif: p4Avif,
    webp: p4Webp,
    jpeg: p4jpeg,
    fallback: p4Fallback,
  },
  dark_red_desktop_hack_security: {
    avif: p5Avif,
    webp: p5Webp,
    jpeg: p5jpeg,
    fallback: p5Fallback,
  },
  bricked_computer_system_hardening: {
    avif: p6Avif,
    webp: p6Webp,
    jpeg: p6jpeg,
    fallback: p6Fallback,
  },
};
```

Then load the manifest dynamically:

- `image-loader.js`

```javascript
import { imageManifest } from "./image-manifest.js";

function loadImage(imageName) {
  // Look up the processed image paths from our manifest
  const images = imageManifest[imageName];
  if (!images) return; // Exit if the image name isn't in our manifest

  const sizes =
    imageName === "dark_server_racks_blue_lights"
      ? "100vw"
      : "(min-width: 1200px) 375px, (min-width: 768px) 50vw, 100vw";

  // Select the DOM elements
  const avifSource = document.getElementById(`${imageName}-avif`);
  const webpSource = document.getElementById(`${imageName}-webp`);
  const jpegImg = document.getElementById(`${imageName}-jpeg`);

  // Set the attributes
  if (avifSource && webpSource && jpegImg) {
    avifSource.srcset = images.avif;
    avifSource.sizes = sizes;
    webpSource.srcset = images.webp;
    webpSource.sizes = sizes;
    jpegImg.srcset = images.jpeg;
    jpegImg.sizes = sizes;
    jpegImg.src = images.fallback;
    jpegImg.classList.add("loaded");
  }
}

// Load all necessary images when the document is ready
document.addEventListener("DOMContentLoaded", () => {
  for (const imageName in imageManifest) {
    loadImage(imageName);
  }
});
```

When Vite builds the site, it creates every single image and copies them to the `dist/assets` directory.

```plaintext
airport_point_of_sale_pos-2TMCCV-V.jpeg
airport_point_of_sale_pos-AHULhpzQ.jpeg
airport_point_of_sale_pos-BmLLnm46.avif
airport_point_of_sale_pos-CpT_D-ys.webp
airport_point_of_sale_pos-DWB_KYav.avif
airport_point_of_sale_pos-t69iB_BF.webp
bricked_computer_system_hardening-BlfjspSV.avif
bricked_computer_system_hardening-BRRWT2vV.webp
bricked_computer_system_hardening-D9i6Zr0Y.webp
bricked_computer_system_hardening-DNta2cWd.avif
bricked_computer_system_hardening-DU-8hbtE.jpeg
bricked_computer_system_hardening-El9_kRor.jpeg
cloud_dashboard_laptop_office-CF4wYkbN.avif
cloud_dashboard_laptop_office-CGtIUW6M.avif
cloud_dashboard_laptop_office-CJgQi2vF.jpeg
cloud_dashboard_laptop_office-CtCS0699.jpeg
cloud_dashboard_laptop_office-DaNUyx2M.webp
cloud_dashboard_laptop_office-DVoH5Gfs.webp
compliance_checklist_pci_cmmc-BIW2q5s_.avif
compliance_checklist_pci_cmmc-Bn2h44X4.webp
compliance_checklist_pci_cmmc-BZJrPYcE.webp
compliance_checklist_pci_cmmc-CffcKS0J.avif
compliance_checklist_pci_cmmc-Diq-60ld.jpeg
compliance_checklist_pci_cmmc-m_8TpXzL.jpeg
dark_red_desktop_hack_security-3hiAeMU4.webp
dark_red_desktop_hack_security-63MTBaon.webp
dark_red_desktop_hack_security-C8LGbfn4.jpeg
dark_red_desktop_hack_security-DAUhbYDI.avif
dark_red_desktop_hack_security-DrjnQTPa.jpeg
dark_red_desktop_hack_security-ifnhtrpp.avif
dark_server_racks_blue_lights-7zlU2e7y.jpeg
dark_server_racks_blue_lights-BaJZiadG.webp
dark_server_racks_blue_lights-BkhNF5Qw.webp
dark_server_racks_blue_lights-BnA-OsMi.jpeg
dark_server_racks_blue_lights-BUqgM0rv.avif
dark_server_racks_blue_lights-CDprGDty.avif
dark_server_racks_blue_lights-CwfSx_p1.avif
dark_server_racks_blue_lights-DBgg2Ve_.webp
dark_server_racks_blue_lights-DbZ-14Vk.jpeg
dark_server_racks_blue_lights-Drtbg6Hl.avif
dark_server_racks_blue_lights-DWRrZoAm.webp
dark_server_racks_blue_lights-hI2JHIk9.jpeg
dark_server_rack_white_walls-BCAIkNi-.webp
dark_server_rack_white_walls-B_vuS6gM.jpeg
dark_server_rack_white_walls-C9EKCHoc.jpeg
dark_server_rack_white_walls-CMRvWUpU.webp
dark_server_rack_white_walls-qiK557-O.avif
dark_server_rack_white_walls-yZyLMT3R.avif
```

This is stupid complicated and obviously does not scale. It was manageable for a single page site, but issues such as this are exactly why frameworks are such a good idea.

## It's Alive

Check out the [live site](https://www.dirofftech.com) or the [source code](https://github.com/jimdiroffii/dirofftech-dot-com).
