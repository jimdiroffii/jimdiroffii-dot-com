+++
date = '2026-03-08T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 047'
summary = ''
tags = ["365-days-of-code-2026", "self-hosting", "shell-scripting", "bash"]
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
| DiroffTech Website      | HTML, CSS, JS | Complete        | 2026-03-05 | The site is live. `git-lfs` needs to be initialized for images.                                           |
| Automate Backups        | bash          | Complete        | 2026-03-08 | Backups done.                                                                                             |

## Archive Day

Today is archive day. I take the backups we created yesterday, and copy those to a remote archive server. The primary complication is that we don't automatically know what the names of the backups are. They will have unique dates and times. Despite executing on a set schedule, we should be able to detect the file name to copy. We also need to include the checksum file, and run the checksum to validate the integrity of the backup. Lastly, the backups are stored while being owned by root.

A new user and SSH key was added for the archiving purposes on the web server. The script below runs on the local archive server.

```bash
#!/usr/bin/env bash
set -Eeuo pipefail

REMOTE_USER="archivepull"
REMOTE_HOST="webserver.example.com"
REMOTE_DIR="/var/backups/local"
SSH_KEY="/home/user/.ssh/archive_pull"
LOCAL_DIR="/srv/archive/webserver"
LOCK_FILE="/var/lock/pull_web_backup.lock"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO] $*"
}

warn() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [WARN] $*" >&2
}

error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $*" >&2
}

require_command() {
    local cmd="$1"
    command -v "${cmd}" >/dev/null 2>&1 || {
        error "Required command not found: ${cmd}"
        exit 1
    }
}

create_lock() {
    mkdir -p "$(dirname "${LOCK_FILE}")"
    exec 9>"${LOCK_FILE}"
    flock -n 9 || {
        error "Another archive pull job is already running"
        exit 1
    }
}

main() {
    local latest_archive
    local latest_file
    local latest_checksum

    require_command ssh
    require_command rsync
    require_command sha256sum
    require_command find
    require_command sort
    require_command tail
    require_command basename

    mkdir -p "${LOCAL_DIR}"
    create_lock

    log "Locating newest remote backup"

    latest_archive="$(ssh -i "${SSH_KEY}" -o BatchMode=yes "${REMOTE_USER}@${REMOTE_HOST}" \
        "find '${REMOTE_DIR}' -maxdepth 1 -type f -name 'backup_*.tar.gz' | sort | tail -n 1")"

    if [[ -z "${latest_archive}" ]]; then
        error "No remote backup archive found"
        exit 1
    fi

    latest_file="$(basename "${latest_archive}")"
    latest_checksum="${latest_file}.sha256"

    log "Newest backup identified: ${latest_file}"

    if [[ -f "${LOCAL_DIR}/${latest_file}" && -f "${LOCAL_DIR}/${latest_checksum}" ]]; then
        log "Latest backup already exists locally, validating checksum"
        (
            cd "${LOCAL_DIR}"
            sha256sum -c "${latest_checksum}" >/dev/null
        )
        log "Backup already archived and verified; skipping copy"
        exit 0
    fi

    log "Copying backup and checksum from remote server"
    rsync -av --partial -e "ssh -i ${SSH_KEY} -o BatchMode=yes" \
        "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/${latest_file}" \
        "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/${latest_checksum}" \
        "${LOCAL_DIR}/"

    log "Validating checksum"
    (
        cd "${LOCAL_DIR}"
        sha256sum -c "${latest_checksum}" >/dev/null
    )

    log "Archive pull completed successfully"
}

main "$@"
```
