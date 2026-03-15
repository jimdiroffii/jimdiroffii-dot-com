+++
date = '2026-03-13T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 052'
summary = ''
tags = ["365-days-of-code-2026", "ip-protocol-from-scratch", "network-programming", "c", "make"]
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

## Pushing Raw Packets: Bridging User Space and the Wire

_The following post was AI-generated, with my notes and input. It is 2:30 AM when I wrapped up and I'm tired today..._

Today was a massive milestone for my "IP Protocol From Scratch" project. After spending a good amount of time carefully designing data structures and parsing command-line arguments, I finally bridged the gap between user space and the physical network wire.

My goal was to build a tool that generates and sends custom IPv4 and ICMP packets entirely from scratch, bypassing the Linux kernel's default network stack. Today, I actually saw my handcrafted packet fly across the network. Here’s how it went down.

### Nailing the Application State

I started the session by finalizing `main.c`. The focus here was on building a bulletproof consumer for the CLI inputs. When you're dealing with protocol headers, data types and boundaries are everything. For example, the IPv4 TTL (Time To Live) is strictly an 8-bit field, while an ICMP Sequence number is 16 bits.

I used `strtol()` with a strict `base 10` to parse the user input, paired with limits from `<stdint.h>` (`UINT8_MAX` and `UINT16_MAX`) to prevent integer overflows. One fun realization during this phase: I didn't actually need to write conditional logic to handle sequence number rollovers. By casting the loop index and starting sequence to a `uint16_t`, C's natural unsigned integer modulo arithmetic perfectly handles wrapping the sequence back to `0` when it hits `65535`, exactly as the RFC expects.

### The Pyramid Architecture

With `main.c` finished, I had to decide how to structure the actual packet generation. I ended up settling on what I call the "Pyramid Architecture" to separate the concerns cleanly:

- **The Base (Data Definitions):** Just the structs and macros representing the RFCs (`ip_v4.h`, `icmp_v4.h`).
- **The Middle (The Math Domain):** A packet_builder module. It knows nothing about Linux or sockets; it just takes a memory buffer and formats it with correct byte-ordering (`htons`) and checksums.
- **The Top (The OS Domain):** An `icmp_executor` module that handles root privileges, opens the raw socket, and pushes the bytes to the kernel.

This strict separation ensures that if I ever want to port this tool to macOS or Windows, the core packet-building math remains untouched.

### Constructing the Payload (and an RFC 792 Catch)

While writing the `packet_builder`, I caught an interesting protocol nuance. Originally, I had a single ICMP header struct. But RFC 792 dictates that the first 4 bytes (Type, Code, Checksum) apply to all ICMP packets, while the next 4 bytes (Identifier, Sequence) are specific only to Echo Requests and Replies.

I split the structures to reflect this reality, which meant doing some careful pointer math to map both headers sequentially into the buffer before copying over the payload data:

```c
// 1. Map the base ICMP header (Type, Code, Checksum)
struct icmp_v4_header _icmp_base = (struct icmp_v4_header _)buffer;
// ... fill type, code, etc.

// 2. Map the Echo-specific header right after the base header
struct icmp_v4_echo_header _icmp_echo = (struct icmp_v4_echo_header _)(buffer + sizeof(struct icmp_v4_header));
// ... fill identifier and sequence using htons()

// 3. Copy the payload immediately following the echo header
memcpy(buffer + header_len, payload, payload_len);
```

After that, I prepended the IPv4 header to the same buffer, calculating the total length and checksums for both layers.

### Hitting the Wire

The final piece of the puzzle was `icmp_executor.c`. To send a custom IP header, you need root privileges and a raw socket (`SOCK_RAW`).

The trickiest part here is that if you just send a packet to a raw socket, Linux will try to be helpful and slap another IPv4 header on top of it. To prevent this, I had to tell the kernel to stand down using the `IP_HDRINCL` (IP Header Included) socket option:

```c
int sockfd = socket(AF_INET, SOCK_RAW, IPPROTO_ICMP);

// Tell the kernel we are providing our own IPv4 header
int hincl = 1;
setsockopt(sockfd, IPPROTO_IP, IP_HDRINCL, &hincl, sizeof(hincl));

// ... Ask packet_builder for the byte array ...

// Inject the raw bytes onto the wire
sendto(sockfd, packet, total_packet_len, 0, (struct sockaddr \*)&dest_addr, sizeof(dest_addr));
```

### Build Automation and First Flight

After hitting a quick linker error (because I forgot to include my new `.c` files in the `gcc` command), I wrote a quick `Makefile` to compile everything cleanly into a `build/` directory.

Then came the moment of truth. I fired up `tcpdump` in one terminal window and ran my executable with `sudo` in the other.

It worked. I saw my handcrafted ICMP Echo Request leave the interface, completely intact, and the remote machine actually sent an Echo Reply back!

Of course, my program currently just fires the packet and closes the socket, so it didn't catch the reply. But proving that the memory alignment, network byte ordering, and checksum math were all perfect was an incredible feeling.

Next up: building the Rx (Receive) pipeline to catch that reply off the wire, unpack it, and calculate the round-trip time.
