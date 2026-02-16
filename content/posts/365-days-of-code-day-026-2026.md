+++
date = '2026-02-15T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 026'
summary = 'Hardening Server Deployments: Securing GitHub Actions with Least Privilege'
+++

I checked on my webserver today, just to read logs, verify logins, review bans, and perform maintenance. I noticed a configuration mistake, and got to work correcting it.

## Fixing The Mistake

I created a new SSH key specifically for deployment of Github Actions workflows. This was a good move. However, I used my standard user account on the server to administer the actions. This sort of defeated the purpose of having a separate SSH key. Sure, my primary SSH key is still private, but the Github Actions SSH key is authorized to log into my account. A new user would be needed to fix this up.

### Create a Dedicated Service Account

The foundation of least privilege is isolating roles. We need an account that exists solely to run deployment scripts—no passwords, no interactive logins. However, this user still needs access to services like Docker to be able to manage the container deployment.

```bash
# Create the user with no password and no prompt
sudo adduser --disabled-password --gecos "" <deployment-account>

# Add the user to the docker group to allow container management
sudo usermod -aG docker <deployment-account>
```

Next, move the authorized key entry from my personal account to the new user account's `authorized_keys` file.

### Directory Architecture, Root Anchoring, and SGID

Permissions changes were incoming. With the new user account, I had to rethink permissions on the folders where the web services are being deployed and hosted. But, I also wanted to be able to access and modify the configurations using my user account when necessary.

If you and the service account both need to edit files in your web directory (e.g., `/opt/docker`), who owns it? If your personal user owns it, the service account will hit permission denied errors. If you use a default OS group like `staff` or `admin`, you risk granting hidden, global escalation paths.

The solution is a dedicated shared group and _Root Anchoring_.

I created a new custom group and added both my personal user and new `<deployment-account>` to it. Then, structured the docker directory like this:

```bash
drwxrws--- 6 root <deployment-account-group> 4096 Jan 28 15:44 docker
```

And, modified the ownership and permissions of the container directory like this:

```bash
drwxrws--- 2 <my-user> <deployment-account-group> 4096 Jan 28 15:45 jimdiroffii-dot-com
```

- **Root Anchoring**: The top-level `/opt/docker` directory is owned by root. Neither my personal user nor the compromised service account can accidentally delete or move the root folder itself.

- **The SGID Bit**: By running `sudo chmod -R g+s /opt/docker`, I applied the `Set-Group-ID` bit. This forces any new file or folder created inside these directories to automatically inherit the folder group ownership. Now, GitHub Actions can write deployment logs, and I can edit files, without ever fighting over file ownership.

### Locking Down With SSH Forced Commands

Even with a restricted user, an attacker with the private SSH key could theoretically request a reverse shell. I can neutralize this threat using [_SSH forced commands_](https://docs.ssh.com/manuals/server-admin/66/sysadmin-forcedcommands.html). Instead of letting GitHub Actions send arbitrary bash commands over SSH, I moved the deployment logic into a script directly on the server. The directory containing the script has similar permissions to the container directories.

Then, in the `authorized_keys` file, add a prefix to the SSH key with the following:

```bash
command="/path/to/script.sh",no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty <ssh-key>
```

With this configuration, hopefully any attacker that somehow managed to compromise the private SSH key of the deployment user can only continuously redeploy my site. No terminal will be provided (`no-pty`), and no tunneling should be possible (`no-port-forwarding`).

## Aggressive Fail2Ban

I'm getting tired of my SSH auth logs being filled with attempts by bots from around the world. I had initially setup a basic `sshd` ban with [fail2ban](https://github.com/fail2ban/fail2ban) that blocked IPs for an hour before unbanning. This obviously did not dissuade attempts. Let's punch it up a notch, and ban for a year.

If any IP gets banned twice within 1 day, they are banned for a year. That should stop the most aggressive bots. I'll check back in the week and see how the attempts look.

Update to the `jail.local` file:

```ini
[recidive]
enabled  = true
filter   = recidive
logpath  = /var/log/fail2ban.log
findtime = 1d
maxretry = 2
bantime  = 1y
```
