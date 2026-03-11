+++
date = '2026-03-10T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 049'
summary = ''
+++

## Project Status

| Project                 | Language      | Status          | Due Date   | Latest Update                                                        |
| :---------------------- | :------------ | :-------------- | :--------- | :------------------------------------------------------------------- |
| Personal Website        | Hugo          | Ongoing         | None       | The site is live. Continuous improvements ongoing.                   |
| Laravel From Scratch    | Laravel (PHP) | In-Progress     | 2026-03-31 | Episode 8                                                            |
| PRM                     | Laravel (PHP) | In-Progress     | 2026-03-31 | Working alongside other Laravel projects.                            |
| Client Website (J.L.)   | Laravel (PHP) | In-Progress     | 2026-03-31 | Working alongside other Laravel projects.                            |
| Project Euler           | C             | Ongoing         | None       | Working on P25. BigInt (AI gen) was a waste of time, need to rewrite |
| Practice Java           | Java          | Paused          | None       | Installed, need to find a good project.                              |
| Practice Python         | Python        | Paused          | None       | Installed, need to find a good project.                              |
| Learn Go                | Go            | Paused          | None       | Installed, work on LDAP Injector from ippsec.                        |
| Learn Rust              | Rust          | Haven't Started | None       | Installed, will try network protocols after finishing in C and Zig.  |
| Learn Elixir            | Elixir        | Haven't Started | None       | Installed, need a good tutorial project.                             |
| Learn Haskell           | Haskell       | Haven't Started | None       | Installed, need a good tutorial project.                             |
| Learn Zig               | Zig           | Haven't Started | None       | Installed, will try network protocols after finishing in C.          |
| Linux+                  | N/A           | In-Progress     | 2026-03-31 | Reading Chapter 4.                                                   |
| Cyber Quest 2026        | N/A           | In-Progress     | 2026-02-28 | Finished quiz 1 with 75%.                                            |
| Operating Systems       | N/A           | In-Progress     | 2026-03-31 | Reading Chapter 4: Abstraction                                       |
| Grey-Hat Hacking        | Various       | In-Progress     | 2026-03-31 | Reading Chapter 8: Threat Hunting Lab                                |
| PHP Time Tracker        | PHP           | Beta Finished   | None       | Working on a basic level.                                            |
| HTTP Status Code Reader | C             | Complete        | 2026-02-18 | Complete.                                                            |
| ZSH Configuration       | bash/zsh      | Complete        | None       | Sort of an ongoing process, but complete for now. Works good.        |
| Network Protocols       | C             | In-Progress     | None       | Working on V3, implementing IPv6.                                    |
| Discinox Website        | HTML, CSS, JS | Complete        | 2026-03-04 | The site is live.                                                    |
| DiroffTech Website      | HTML, CSS, JS | Complete        | 2026-03-05 | The site is live. `git-lfs` needs to be initialized for images.      |
| Automate Backups        | bash          | Complete        | 2026-03-08 | Backups done.                                                        |

## IP (6) Protocol From Scratch

I got back to the network code programming today, with a refactoring of my V1 and V2 code from [IP Protocol From Scratch](https://github.com/jimdiroffii/ip-protocol-from-scratch). In V3, I'm separating the logic into proper header files, and building up a library that is more generalized. I'm also performing my first implementation of [IPv6](https://datatracker.ietf.org/doc/html/rfc8200). At first I was thrown off because the first 4 bytes of the IPv6 header did not align with `uint8` or `uint16`, before I realized that a 32-bit member would perfectly capture the first fields of the header: `uint32_t version_class_flow;`. The IP Version takes the first 4 bits, the Traffic Class takes the middle 8 bits, and the Flow Label takes the last 20 bits. With my experience in packing and shifting bits around in the first two versions, this shouldn't be too bad.

- `ip_stack.h`

```c
/**
 * ip_stack.h
 *
 * @brief RFC implementation of the IP protocol
 * IPv4: RFC 791
 * IPv6: RFC 8200
 */

#ifndef IP_STACK_H
#define IP_STACK_H

#include <stdint.h>

/**
 * @enum ip_version
 * @brief Version identifiers.
 */
enum ip_version
{
    IPV4 = 4,
    IPV6 = 6
};

/**
 * @enum ip_protocol
 * @brief Upper-layer protocol identifiers.
 */
enum ip_protocol
{
    IP_PROTO_ICMP = 1 /** Internet Control Message Protocol */
};

/**
 * @struct ipv4_header
 * @brief 20-byte IPv4 header, packed wire layout, without options.
 *
 * @ref RFC 791
 */
struct ipv4_header
{
    uint8_t version_ihl;     /** IP Version (4 bits) + Internet Header Length (4 bits) */
    uint8_t type_of_service; /** DSCP+ECN - See RFC 2474 (DSCP), RFC 3168 (ECN) and their respective updates */
    uint16_t total_length;   /** Length of complete datagram, in octets. Absolute Max: 65535, Recommended Max: 576 */
    uint16_t id;             /** Aids in reassembly of fragments */
    uint16_t flags_offset;   /** Flags (3 bits) + Fragment Offset (13 bits) */
    uint8_t ttl;             /** Time to Live a.k.a. hop count */
    uint8_t protocol;        /** Upper-layer protocol id */
    uint16_t checksum;       /** Ones' complement checksum of all 16-bit words in the header */
    uint32_t src;            /** Source address */
    uint32_t dst;            /** Destination address */
} __attribute__((packed));

/**
 * @struct ipv6_header
 * @brief 40-byte IPv6 header, packed wire layout, without extensions.
 *
 * @ref RFC 8200
 */
struct ipv6_header
{
    uint32_t version_class_flow; /** IP Version (4 bits) + Traffic Class (8 bits) + Flow Label (20 bits) */
    uint16_t payload_length;     /** Length of the packet following this header (extension headers + payload) */
    uint8_t next_header;         /** ID of the type of header following this header */
    uint8_t hop_limit;           /** Hop limit (TTL in IPv4) */
    uint8_t src[16];             /** Source address (128-bit) */
    uint8_t dst[16];             /** Destination address (128-bit) */
} __attribute__((packed));

#endif /* IP_STACK_H */
```

## A Quick Aside for Doxygen

As you can see, I've also been writing up [Doxygen](https://www.doxygen.nl/index.html)-style comments for everything. I'll be incorporating that into my workflow as well.

```bash
sudo apt install doxygen doxygen-doc doxygen2man
```

The default usage of Doxygen was very simple.

1. Generate a Doxyfile
1. Generate the documentation
1. View the HTML

```bash
doxygen -g
doxygen Doxyfile
cd html
python3 -m http.server 3000
```

Doxygen generally expects the comment to be _before_ the thing to be documented. In the case of in-line comments on struct members, a `<` character must be added for the documentation engine to assign the comment properly.

```c
struct ipv6_header
{
    uint32_t version_class_flow; /**< IP Version (4 bits) + Traffic Class (8 bits) + Flow Label (20 bits) */
    uint16_t payload_length;     /**< Length of the packet following this header (extension headers + payload) */
<snip>
```

## Separate the Protocols

After getting both IP headers in place, I started to think a bit more about the architecture we were developing. ICMP for IPv4 and IPv6 are quite different, and will be placed in their own files. I think it makes sense that if we are developing a two separate stacks for ICMP, we should do the same for IP. There is no reason why the IPv4 and IPv6 protocols cannot exist in their own header files. There is only one issue, which is easily rectified. There are some shared parameters between IPv4 and IPv6, such as the [protocol identifiers](https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml). The IANA has created a list of _assigned internet protocol numbers_ that both protocols use. To avoid duplicating an `enum`, another file, `ip_common.h` is added, which holds shared data.

- `ip_common.h`

```c
/**
 * ip_common.h
 *
 * @brief Shared components and parameters for IPv4 and IPv6 protocols
 * IPv4: RFC 791
 * IPv6: RFC 8200
 */

#ifndef IP_COMMON_H
#define IP_COMMON_H

enum ip_version
{
    IPV4 = 4,
    IPV6 = 6
};

enum ip_protocol
{
    IP_PROTO_ICMPV4 = 1,
    IP_PROTO_ICMPV6 = 58
};

#endif /* IP_COMMON_H */
```

- `ipv4.h`

```c
/**
 * ipv4.h
 *
 * @brief RFC implementation of the IP protocol
 * IPv4: RFC 791
 */

#ifndef IPV4_H
#define IPV4_H

#include <stdint.h>
#include "ip_common.h"

/**
 * @brief Absolute max IPv4 datagram length (header + payload) in octets.
 */
#define IPV4_MAX_PACKET_SIZE 65535

/**
 * @brief Minimum datagram size all hosts must be prepared to accept.
 */
#define IPV4_RECOMMENDED_MTU 576

/**
 * @brief Minimum valid Internet Header Length in 32-bit words (20 bytes).
 */
#define IPV4_MIN_IHL 5

/**
 * @struct ipv4_header
 * @brief 20-byte IPv4 header, packed wire layout, without options.
 *
 * @note RFC 791
 */
struct ipv4_header
{
    uint8_t version_ihl;     /**< IP Version (4 bits) + Internet Header Length (4 bits) */
    uint8_t type_of_service; /**< DSCP+ECN - See RFC 2474 (DSCP), RFC 3168 (ECN) and their respective updates */
    uint16_t total_length;   /**< Length of complete datagram, in octets. Absolute Max: 65535, Recommended Max: 576 */
    uint16_t id;             /**< Aids in reassembly of fragments */
    uint16_t flags_offset;   /**< Flags (3 bits) + Fragment Offset (13 bits) */
    uint8_t ttl;             /**< Time to Live a.k.a. hop count */
    uint8_t protocol;        /**< Upper-layer protocol id */
    uint16_t checksum;       /**< Ones' complement checksum of all 16-bit words in the header */
    uint32_t src;            /**< Source address */
    uint32_t dst;            /**< Destination address */
} __attribute__((packed));

#endif /* IPV4_H */
```

- `ipv6.h`

```c
/**
 * ipv6.h
 *
 * @brief RFC implementation of the IPv6 protocol
 * IPv6: RFC 8200
 */

#ifndef IPV6_H
#define IPV6_H

#include <stdint.h>
#include "ip_common.h"

/**
 * @brief The absolute minimum link MTU required for any IPv6 network.
 */
#define IPV6_MIN_LINK_MTU 1280

/**
 * @brief The minimum fragment reassembly size all IPv6 nodes must support.
 */
#define IPV6_MIN_REASSEMBLY_SIZE 1500

/**
 * @brief The fixed length of the base IPv6 header in octets (40 bytes).
 */
#define IPV6_BASE_HEADER_LENGTH 40

/**
 * @struct ipv6_header
 * @brief 40-byte IPv6 header, packed wire layout, without extensions.
 *
 * @note RFC 8200
 */
struct ipv6_header
{
    uint32_t version_class_flow; /**< IP Version (4 bits) + Traffic Class (8 bits) + Flow Label (20 bits) */
    uint16_t payload_length;     /**< Length of the packet following this header (extension headers + payload) */
    uint8_t next_header;         /**< ID of the type of header following this header */
    uint8_t hop_limit;           /**< Hop limit (TTL in IPv4) */
    uint8_t src[16];             /**< Source address (128-bit) */
    uint8_t dst[16];             /**< Destination address (128-bit) */
} __attribute__((packed));

#endif /* IPV6_H */
```
