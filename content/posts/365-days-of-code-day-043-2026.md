+++
date = '2026-03-04T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 043'
summary = ''
tags = ["365-days-of-code-2026", "docker", "discinox", "javascript"]
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

## Discinox

The Discinox is an annual disc golf event that occurs on the solstice every year. We started in 2008, so this year will be the 18th annual event. I've held onto the [domain](https://www.discinox.com) for many years, and never really did anything with it. At one time I wanted to start a disc golf company, but that ship sailed after realizing I needed to sell hundreds of thousands of discs to make back my salary at the time. I still like to keep the memory alive, so I'm reinstating the Discinox website on the new webserver I built.

The website is simple. A javascript countdown timer that resets on June 21st each year. Let's get it up and running. I already have a working template for the workflow: local > github > docker > webserver. I just need to replicate what I've already done.

### Docker

The `Dockerfile` is just a copy of the nginx website template I did for testing the workflow at the beginning. A couple quick modifications to copy over the `css` and `js`, and this should be done.

```dockerfile
FROM nginx:alpine
COPY src/ /usr/share/nginx/html/
COPY .nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

I also need to setup a [new repo on Docker Hub](https://hub.docker.com/repository/docker/jimdtech/discinox-dot-com/general). Done.

### Github

I'll setup a [new repo for the Discinox website](https://github.com/jimdiroffii/discinox-dot-com), and [new secrets](https://youtu.be/dQw4w9WgXcQ?si=lEi2lC_2on_SlQaR) for the workflow. In order to setup the secrets, I'll need to configure the server.

### Webserver

The webserver setup is a bit more complicated for security purposes. I'll setup a new user with new keys to deploy the new website, deployment scripts, and modify the Caddy configuration to support the new domain.

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

```caddyfile
discinox.com {
  redir https://www.discinox.com{uri} permanent
  log {
    output file /var/log/caddy/access-discinox.com.log
  }
}

www.discinox.com {
  reverse_proxy discinox-dot-com:80
  log {
    output file /var/log/caddy/access-www.discinox.com.log
  }
}
```

## Javascript Countdown

As mentioned, the website is currently extremely simple. Nothing more than a countdown.

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("discinox");
  if (!el) return;

  function updateCountdown() {
    const now = new Date(); // local timezone
    const year = now.getFullYear();

    // June is month 5 (0-based index)
    const thisYearStart = new Date(year, 5, 21, 0, 0, 0, 0);
    const thisYearEnd = new Date(year, 5, 22, 0, 0, 0, 0);

    let target;
    if (now >= thisYearStart && now < thisYearEnd) {
      el.textContent = "Discinox is today!";
      return;
    }

    if (now < thisYearStart) {
      target = thisYearStart;
    } else {
      // past this year's Discinox, look to next year
      target = new Date(year + 1, 5, 21, 0, 0, 0, 0);
    }

    // Calculate full days until target (round up so partial days count as a day)
    const msPerDay = 1000 * 60 * 60 * 24;
    const days = Math.ceil((target - now) / msPerDay);
    el.textContent = `${days} day${days === 1 ? "" : "s"} until the next Discinox!`;
  }

  // initial update and then update every minute
  updateCountdown();
  setInterval(updateCountdown, 60 * 1000);
});
```
