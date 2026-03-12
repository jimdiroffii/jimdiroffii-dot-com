+++
date = '2026-03-11T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 050'
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

## Ambiguities in RFC Language

While reimplementing my ICMP code for [IP Protocol From Scratch](https://github.com/jimdiroffii/ip-protocol-from-scratch), I spent some time (re)reading [RFC 792](https://datatracker.ietf.org/doc/html/rfc792) for ICMP. I came across some interesting language used in the _Echo or Echo Reply Message_ section.

```plaintext
<snip>
Code

      0
<snip>
Identifier

      If code = 0, an identifier to aid in matching echos and replies,
      may be zero.

Sequence Number

      If code = 0, a sequence number to aid in matching echos and
      replies, may be zero.
```

The specification clearly states that the `code` value for an Echo request or Echo Reply message is `0`. However, both the `Identifier` and `Sequence Number` fields clearly state, "**If** code = 0...". Which implies that the code doesn't have to be 0. Since the code field is 8 bits, we could potentially have values from 0 to 255.

I did some research on this, first with Gemini:

> Jon Postel likely included "If code = 0" as a defensive programming note, leaving the door cracked open for future protocol expansions that never ended up happening. In the 40+ years since RFC 792 was published, the Internet Assigned Numbers Authority (IANA) has never assigned a code other than 0 for ICMP Type 8 (Echo) or Type 0 (Echo Reply). Mathematically, you could fit 255 other values in that 8-bit space, but mathematically they mean absolutely nothing to the protocol. Because no valid Echo message ever uses a code other than 0, hackers and malware authors historically realized they could use codes 1-255 to secretly pass data past firewalls in a technique known as ICMP Tunneling. Today, if you send an ICMP Echo packet with Code = 9 (or anything other than 0), modern Intrusion Detection Systems (like Snort or Suricata) and strict OS kernels will instantly flag it as a covert channel or a malformed packet, and drop it.

### ICMP Tunneling

This is an interesting concept. Because ICMP is typically not blocked or inspected deeply, you can encapsulate data into the ICMP payload to infiltrate a network or exfiltrate data out of a network. I think this is most easily shown by the application [icmptunnel](https://github.com/DhavalKapil/icmptunnel). `icmptunnel` has been successfully used to bypass captive portals, bypass firewalls and establish an encrypted communication channel.

> 'icmptunnel' works by encapsulating your IP traffic in ICMP echo packets and sending them to your own proxy server. The proxy server decapsulates the packet and forwards the IP traffic. The incoming IP packets which are destined for the client are again encapsulated in ICMP reply packets and sent back to the client. The IP traffic is sent in the 'data' field of ICMP packets.

## ICMP Header

To preserve the default condition for the ICMP code value, I will be defining a macro that is 0. However, this value will be configurable by the user.

- `icmpv4.h`

```c
/***
 * @file icmpv4.h
 * @brief RFC implementation of the ICMP protocol
 *
 * @note ICMP is the historical name. ICMPv4 is a retronym. Modified to make it
 * distinct from ICMPv6.
 *
 * ICMP: RFC 792
 *
 * @todo Add additional ICMP message types and fields (i.e. Destination Unreachable)
 */
#ifndef ICMPV4_H
#define ICMPV4_H

#include <stdint.h>

/**
 * @brief Standard code for Echo Request/Reply.
 * @note May be overridden by the user for security auditing (e.g., ICMP tunneling).
 */
#define ICMP_V4_ECHO_CODE 0

/**
 * @enum icmp_v4_message_type
 * @brief ICMPv4 message type field identifiers
 */
enum icmp_v4_message_type
{
    ICMPV4_ECHO_REPLY = 0,
    ICMPV4_ECHO = 8
};

/**
 * @struct icmp_v4_header
 * @brief ICMPv4 header (type/code/checksum), packed wire layout. Required for all ICMPv4 packets.
 */
struct icmp_v4_header
{
    uint8_t type;      /**< Message type */
    uint8_t code;      /**< Message code */
    uint16_t checksum; /**< ICMP checksum of ICMP header + ICMP data (ones' complement) */
} __attribute__((packed));

/**
 * @struct icmp_v4_echo
 * @brief ICMPv4 Echo message fixed fields, packed wire layout.
 */
struct icmp_v4_echo
{
    uint16_t id;       /**< Session identifier */
    uint16_t sequence; /**< Sequence number */
} __attribute__((packed));

#endif /* ICMPV4_H */
```
