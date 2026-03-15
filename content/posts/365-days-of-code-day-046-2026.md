+++
date = '2026-03-07T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 046'
summary = ''
tags = ["365-days-of-code-2026", "docker", "self-hosting", "network-programming", "shell-scripting", "bash"]
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
| Automate Backups        | bash          | In-Progress     | 2026-03-08 | Source backups done. Need to poll and copy for backups to archive server.                                 |

## Backup Day

Today is backup day. It has been several weeks since I last updated my Gitea server, and I have yet to perform a webserver backup since migrating to my new VPS. Given my lessons (hopefully) learned from my AWS spot instance issue, backups are very overdue.

Fortunately, this is a simple matter.

```bash
tar -czf backup_date_time.tar.gz /home/user/backups
```

Then scp these files to my local archive server:

```bash
scp user@webserver:/home/user/backups/backup_date_time.tar.gz .
```

### Automate Backup

This wouldn't be a code challenge if we didn't try to automate this process with some scripts.

Requirements:

- Daily backup
- Timestamped file names
- One backup runs at a time
- Copy to remote archive
- Checksum the files
- Delete old backups
- Log the service with warnings and errors

The following script executes the backups, catches and avoids common warnings and errors, and sets proper permissions.

```bash
#!/bin/bash
# Script: run_backup.sh
set -Eeuo pipefail

umask 077

BACKUP_DIR="/root/backups"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
ARCHIVE_NAME="backup_${TIMESTAMP}.tar.gz"
ARCHIVE_PATH="${BACKUP_DIR}/${ARCHIVE_NAME}"
CHECKSUM_PATH="${BACKUP_DIR}/${ARCHIVE_NAME}.sha256"
RETENTION_DAYS=14
LOCK_FILE="/var/lock/run_backup.lock"
DISK_SPACE_MIN_KB=524288 # 512MB minimum free space threshold

BACKUP_PATHS=(
  "opt/docker"
  "opt/scripts"
)

# Strings to match against tar's standard error output.
# If a warning contains any of these, it will not trigger a script failure.
ALLOWED_TAR_WARNINGS=(
  "file changed as we read it"
  "socket ignored"
  "file removed before we read it"
)

# Track whether the full backup process completed successfully.
BACKUP_COMPLETE=0

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO] $*"
}

warn() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [WARN] $*" >&2
}

error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $*" >&2
}

on_error() {
    local exit_code=$?
    local line_no=$1
    local cmd=$2
    error "Backup failed at line ${line_no}: ${cmd} (exit code: ${exit_code})"
    exit "${exit_code}"
}

# On any non-zero exit before successful completion, remove incomplete backup artifacts
# so they are not mistaken for valid backups by future retention runs.
cleanup_on_exit() {
    local exit_code=$?
    if [[ "${exit_code}" -ne 0 && "${BACKUP_COMPLETE}" -eq 0 ]]; then
        warn "Cleaning up incomplete backup artifacts due to failure"
        rm -f "${ARCHIVE_PATH}" "${CHECKSUM_PATH}"
    fi
}

trap 'on_error ${LINENO} "$BASH_COMMAND"' ERR
trap cleanup_on_exit EXIT

require_command() {
    local cmd="$1"
    command -v "${cmd}" >/dev/null 2>&1 || {
        error "Required command not found: ${cmd}"
        exit 1
    }
}

check_source_paths() {
    local path
    for path in "${BACKUP_PATHS[@]}"; do
        if [[ ! -d "/${path}" ]]; then
            error "Configured backup path does not exist or is not a directory: /${path}"
            exit 1
        fi
    done
}

# Verify sufficient free disk space before attempting to create the archive.
check_disk_space() {
    local available_kb
    available_kb=$(df -Pk "${BACKUP_DIR}" | awk 'NR==2 {print $4}')
    if [[ "${available_kb}" -lt "${DISK_SPACE_MIN_KB}" ]]; then
        error "Insufficient disk space in ${BACKUP_DIR}: ${available_kb}KB available (minimum: ${DISK_SPACE_MIN_KB}KB)"
        exit 1
    fi
    local available_mb=$((available_kb / 1024))
    log "Disk space check passed: ${available_mb}MB available"
}

create_lock() {
    mkdir -p "$(dirname "${LOCK_FILE}")"
    exec 9>"${LOCK_FILE}"
    if ! flock -n 9; then
        error "Another backup job is already running"
        exit 1
    fi
}

run_tar_backup() {
    local tar_output
    local tar_rc=0
    local unexpected_warning=0
    local allowed_warning_seen=0
    local is_allowed=0
    local line
    local allowed_str

    log "Creating archive: ${ARCHIVE_PATH}"
    log "Source paths: /${BACKUP_PATHS[*]}"

    set +e
    tar_output="$(tar -czf "${ARCHIVE_PATH}" -C / "${BACKUP_PATHS[@]}" 2>&1)"
    tar_rc=$?
    set -e

    if [[ -n "${tar_output}" ]]; then
        while IFS= read -r line; do
            [[ -z "${line}" ]] && continue
            warn "tar output: ${line}"

            is_allowed=0
            for allowed_str in "${ALLOWED_TAR_WARNINGS[@]}"; do
                if [[ "${line}" == *"${allowed_str}"* ]]; then
                    is_allowed=1
                    allowed_warning_seen=1
                    break
                fi
            done

            if [[ "${is_allowed}" -eq 0 ]]; then
                unexpected_warning=1
            fi
        done <<< "${tar_output}"
    fi

    case "${tar_rc}" in
        0)
            if [[ "${unexpected_warning}" -eq 1 ]]; then
                error "tar reported unexpected warning output despite exit code 0"
                exit 1
            fi
            log "tar completed successfully"
            ;;
        1)
            if [[ "${unexpected_warning}" -eq 1 ]]; then
                error "tar returned exit code 1 with unexpected warnings"
                exit 1
            fi

            if [[ "${allowed_warning_seen}" -eq 1 ]]; then
                warn "tar reported recognized non-fatal warnings; archive creation continued"
            else
                error "tar returned exit code 1 but no recognized non-fatal warning was found"
                exit 1
            fi
            ;;
        *)
            error "tar failed with exit code ${tar_rc}"
            exit "${tar_rc}"
            ;;
    esac
}

validate_archive() {
    if [[ ! -f "${ARCHIVE_PATH}" ]]; then
        error "Archive was not created: ${ARCHIVE_PATH}"
        exit 1
    fi

    if [[ ! -s "${ARCHIVE_PATH}" ]]; then
        error "Archive was created but is empty: ${ARCHIVE_PATH}"
        exit 1
    fi

    gzip -t "${ARCHIVE_PATH}"
    tar -tzf "${ARCHIVE_PATH}" >/dev/null

    log "Archive validation passed"
}

validate_checksum() {
    if [[ ! -f "${CHECKSUM_PATH}" ]]; then
        error "Checksum file was not created: ${CHECKSUM_PATH}"
        exit 1
    fi

    if [[ ! -s "${CHECKSUM_PATH}" ]]; then
        error "Checksum file is empty: ${CHECKSUM_PATH}"
        exit 1
    fi

    (cd "${BACKUP_DIR}" && sha256sum -c "${ARCHIVE_NAME}.sha256" >/dev/null)
    log "Checksum validation passed"
}

cleanup_old_backups() {
    log "Removing backups older than ${RETENTION_DAYS} days from ${BACKUP_DIR}"

    find "${BACKUP_DIR}" -type f \
        \( -name 'backup_*.tar.gz' -o -name 'backup_*.tar.gz.sha256' \) \
        -mtime +"${RETENTION_DAYS}" -print -delete || {
            warn "Retention cleanup encountered an issue"
            return 1
        }
}

main() {
    require_command tar
    require_command gzip
    require_command sha256sum
    require_command flock
    require_command find
    require_command df
    require_command awk

    mkdir -p "${BACKUP_DIR}" || {
        error "Backup directory does not exist and could not be created: ${BACKUP_DIR}"
        exit 1
    }

    if [[ ! -w "${BACKUP_DIR}" ]]; then
        error "Backup directory is not writable: ${BACKUP_DIR}"
        exit 1
    fi

    create_lock
    check_source_paths
    check_disk_space

    log "Backup job started"

    run_tar_backup
    validate_archive

    log "Creating checksum: ${CHECKSUM_PATH}"
    (cd "${BACKUP_DIR}" && sha256sum "${ARCHIVE_NAME}" > "${ARCHIVE_NAME}.sha256")
    validate_checksum

    cleanup_old_backups || true

    log "Securing backup files as read-only"
    chmod 400 "${ARCHIVE_PATH}" "${CHECKSUM_PATH}"

    BACKUP_COMPLETE=1
    log "Backup job completed successfully"
}

main "$@"
```

### Automation

`cron` is the usual suspect for these types of jobs, but we are going to use `systemd`.

- Service File (`/etc/systemd/system/backup-local.service`)

```ini
[Unit]
Description=Create local backup archive
Documentation=man:tar(1)
After=local-fs.target
ConditionPathIsDirectory=/root/backups

[Service]
Type=oneshot
ExecStart=/root/backups/run_backup.sh
User=root
Group=root
SyslogIdentifier=backup-local
Nice=10
IOSchedulingClass=best-effort
IOSchedulingPriority=7
```

- Timer (`/etc/systemd/system/backup-local.timer`)

```ini
[Unit]
Description=Run local backup daily

[Timer]
OnCalendar=*-*-* 04:47:00
Persistent=true
RandomizedDelaySec=5m

[Install]
WantedBy=timers.target
```

Then enable, run and verify the new service:

```bash
systemctl daemon-reload
systemctl enable --now backup-local.timer
systemctl list-timers --all
systemctl status backup-local.service
systemctl start backup-local.service
journalctl -u backup-local.service -n 100 --no-pager
ls -lh /root/backups
```
