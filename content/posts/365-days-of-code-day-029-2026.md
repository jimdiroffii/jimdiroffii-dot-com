+++
date = '2026-02-18T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 029'
summary = ''
+++

## Project Status

Going to start including the project status table moving forward. This should help better track progress over the year.

| Project               | Language      | Status          | Due Date   | Latest Update                                                                                             |
| :-------------------- | :------------ | :-------------- | :--------- | :-------------------------------------------------------------------------------------------------------- |
| Personal Website      | Hugo          | In-Progress     | None       | The site is live. There are some TODOs. Need to work on categorization, tagging, and layout improvements. |
| Laravel From Scratch  | Laravel (PHP) | In-Progress     | 2026-03-31 | Episode 6                                                                                                 |
| PRM                   | Laravel (PHP) | In-Progress     | 2026-03-31 | Working alongside other Laravel projects.                                                                 |
| Client Website (J.L.) | Laravel (PHP) | In-Progress     | 2026-03-31 | Working alongside other Laravel projects.                                                                 |
| Project Euler         | C             | Ongoing         | None       | Working on P25 on a best effort basis. Currently building a BigInt library.                               |
| Learn Rust            | Rust          | Haven't Started | None       | Installed, need to find a good tutorial.                                                                  |
| Learn Go              | Go            | Paused          | None       | Installed, work on LDAP Injector from ippsec.                                                             |
| Practice Java         | Java          | Paused          | None       | Installed, need to find a good project.                                                                   |
| Practice Python       | Python        | Paused          | None       | Installed, need to find a good project.                                                                   |
| PHP Time Tracker      | PHP           | Beta Finished   | None       | Working on a basic level. Could use a couple more updates to make it fully functional.                    |
| Learn Elixir          | Elixir        | Haven't Started | None       | Installed, need a good tutorial project.                                                                  |
| Learn Haskell         | Haskell       | Haven't Started | None       | Installed, need good tutorial project.                                                                    |
| Linux+                | N/A           | In-Progress     | 2026-03-31 | Reading Chapter 4.                                                                                        |
| Cyber Quest 2026      | N/A           | In-Progress     | 2026-02-28 | Finished quiz 1 with 75%. Need to work on ARP poisoning and timestamp adjustments in WireShark.           |
| Operating Systems     | N/A           | In-Progress     | 2026-03-31 | Reading Chapter 4: Abstraction                                                                            |
| Grey-Hat Hacking      | Various       | In-Progress     | 2026-03-31 | Reading Chapter 8: Threat Hunting Lab                                                                     |

## Another Project - HTTP Status Code Reader in C

I was curious about sockets in C, and parsing HTTP responses, so I had ChatGPT whip me up a POC to read the status code from a website. I still wrote this all out by hand, to work on the muscle memory and work through each function individually.

```c
#define _POSIX_C_SOURCE 200112L

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>

#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netdb.h>

#define PORT_HTTP "80"
#define RECV_BUF 4096

static int connect_http(const char *host) {
        struct addrinfo hints;
        struct addrinfo *res = NULL, *p = NULL;

        memset (&hints, 0, sizeof(hints));
        hints.ai_family = AF_UNSPEC;
        hints.ai_socktype = SOCK_STREAM;

        int rc = getaddrinfo(host, PORT_HTTP, &hints, &res);
        if (rc != 0) {
                fprintf(stderr, "getaddrinfo(%s): %s\n", host, gai_strerror(rc));
                return -1;
        }

        int sockfd = -1;

        for (p = res; p != NULL; p = p->ai_next) {
                sockfd = socket(p->ai_family, p->ai_socktype, p->ai_protocol);
                if (sockfd < 0) {
                        continue;
                }
                if (connect(sockfd, p->ai_addr, p->ai_addrlen) == 0) {
                        break;
                }
                close(sockfd);
                sockfd = -1;
        }

        freeaddrinfo(res);

        if (sockfd < 0) {
                fprintf(stderr, "Failed to connect to %s:%s (%s)\n", host, PORT_HTTP, strerror(errno));
                return -1;
        }

        return sockfd;
}

static int send_http_get(int sockfd, const char *host) {
        char req[1024];
        int n = snprintf(req, sizeof(req),
                        "GET / HTTP/1.1\r\n"
                        "Host: %s\r\n"
                        "User-Agent: c-probe/0.1\r\n"
                        "Accept: */*\r\n"
                        "Connection: close\r\n"
                        "\r\n",
                        host);

        if (n<0 || (size_t)n >= sizeof(req)) {
                fprintf(stderr, "Request too large\n");
                return -1;
        }

        size_t total = 0;
        while (total < (size_t)n) {
                ssize_t sent = send(sockfd, req + total, (size_t)n - total, 0);
                if (sent < 0) {
                        fprintf(stderr, "send(): %s\n", strerror(errno));
                        return -1;
                }
                total += (size_t)sent;
        }
        return 0;
}

static int read_status_line(int sockfd, char *out_line, size_t out_sz) {
        char buf[RECV_BUF];
        size_t used = 0;

        for (;;) {
                ssize_t r = recv(sockfd, buf, sizeof(buf), 0);
                if (r < 0) {
                        fprintf(stderr, "recv(): %s\n", strerror(errno));
                        return -1;
                }
                if (r == 0) {
                        fprintf(stderr, "Connection closed before receiving a status line\n");
                        return -1;
                }

                size_t to_copy = (size_t)r;
                if (to_copy > out_sz - 1 - used) {
                        to_copy = out_sz - 1 - used;
                }
                memcpy(out_line + used, buf, to_copy);
                used += to_copy;
                out_line[used] = '\0';

                char *eol = strstr(out_line, "\r\n");
                if (eol) {
                        *eol = '\0';
                        return 0;
                }

                if (used >= out_sz - 1) {
                        fprintf(stderr, "Status line too long (buffer limit)\n");
                        return -1;
                }
        }
}

static int print_code_reason(const char *status_line) {
        char proto[32] = {0};
        int code = 0;
        char reason[256] = {0};

        int matched = sscanf(status_line, "%31s %d %255[^\n]", proto, &code, reason);
        if (matched < 2) {
                fprintf(stderr, "Unexpected status line: %s\n", status_line);
                return -1;
        }
        }

        if (matched == 2) {
                printf("%d\n", code);
        }
        else {
                printf("%d %s\n", code, reason);
        }
        return 0;
}

int main(int argc, char **argv) {
        if (argc != 2) {
                fprintf(stderr, "Usage: %s <host>\nExample: %s www.example.com\n", argv[0], argv[0]);
                return 2;
        }

        const char *host = argv[1];

        int sockfd = connect_http(host);
        if (sockfd < 0) return 1;

        if (send_http_get(sockfd, host) != 0) {
                close(sockfd);
                return 1;
        }

        char status_line[1024];
        if (read_status_line(sockfd, status_line, sizeof(status_line)) != 0) {
                close(sockfd);
                return 1;
        }

        printf("Status line: %s\n", status_line);

        if (print_code_reason(status_line) != 0) {
                close(sockfd);
                return 1;
        }

        close(sockfd);
        return 0;
}
```

Compile it:

```bash
❯ gcc -std=c11 -Wall -Wextra -O2 -o http-status-probe http-status-probe.c
```

Run it:

```bash
❯ ./http-status-probe www.jimdiroffii.com
Status line: HTTP/1.1 308 Permanent Redirect
308 Permanent Redirect
```

And, it works. We parse the argument, send a request, parse the response, and print the status line to stdout. A fun little experiment with sockets.
