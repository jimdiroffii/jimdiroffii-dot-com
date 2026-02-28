+++
date = '2026-02-27T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 038'
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
| Cyber Quest 2026        | N/A           | In-Progress     | 2026-02-28 | Finished quiz 1 with 75%. Need to work on ARP poisoning and timestamp adjustments in WireShark.           |
| Operating Systems       | N/A           | In-Progress     | 2026-03-31 | Reading Chapter 4: Abstraction                                                                            |
| Grey-Hat Hacking        | Various       | In-Progress     | 2026-03-31 | Reading Chapter 8: Threat Hunting Lab                                                                     |
| PHP Time Tracker        | PHP           | Beta Finished   | None       | Working on a basic level. Could use a couple more updates to make it fully functional.                    |
| HTTP Status Code Reader | C             | Complete        | 2026-02-18 | Complete. Could potentially upgrade for more advanced functions or follow redirects.                      |
| ZSH Configuration       | bash/zsh      | Complete        | None       | Sort of an ongoing process, but complete for now. Works good.                                             |
| Network Protocols       | C             | In-Progress     | None       | IPv4 header, ICMP header and payload complete. Working on sockets.                                        |

## The POSIX Standard, Transitive Dependencies, and Networking Code

While getting started on the socket configuration to send the newly constructed ICMP packet, I ran into a question about the header files in C and the things these files include. This led me down the rabbit hole of reading the [POSIX standard](https://pubs.opengroup.org/onlinepubs/9799919799/nframe.html).

This arose due to my usage of `AF_INET` macro. Especially on programs where I am learning or practicing, I like to include the specific functionality I'm using from each header file in a comment.

```c
#include <stdio.h>
#include <stdint.h>      // fixed type sizes (uint8_t, etc)
#include <assert.h>      // turn assumptions into assertions
#include <stddef.h>      // offsetof()
#include <arpa/inet.h>   // htons(), ntohs(), inet_pton(), AF_INET
#include <string.h>      // memcpy()
```

Prior to today, I used the header `arpa/inet.h` to get access to the `AF_INET` macro for defining the IPv4 addresses. However, I was reading up on `sys/socket.h`, which I'll be including today, and I noticed that it also can include `AF_INET`. This immediately caught my eye, because I would only expect a single implementation of functions or macros from core libraries. As it turns out, `AF_INET` is part of a transitive dependency involving several libraries. On Ubuntu Linux 24.04 at least, this dependency chain is as follows:

- `arpa/inet.h` includes
- `netinet/in.h` includes
- `sys/socket.h` includes
- `bits/socket.h` defines `AF_INET`
- `AF_INET` is defined by `PF_INET`
- `PF_INET` is equal to `2`

`AF` stands for _Address Family_ and `PF` stands for `Protocol Family`.

Per [Beej's Guide to Network Programming](https://beej.us/guide/bgnet/html/) section 5.2:

> This PF_INET thing is a close relative of the AF_INET that you can use when initializing the sin_family field in your struct sockaddr_in. In fact, they’re so closely related that they actually have the same value, and many programmers will call socket() and pass AF_INET as the first argument instead of PF_INET. Now, get some milk and cookies, because it’s time for a story. Once upon a time, a long time ago, it was thought that maybe an address family (what the “AF” in “AF_INET” stands for) might support several protocols that were referred to by their protocol family (what the “PF” in “PF_INET” stands for). That didn’t happen. And they all lived happily ever after, The End. So the most correct thing to do is to use AF_INET in your struct sockaddr_in and PF_INET in your call to socket().

Note: The above advice is outdated, as the [Linux man pages](https://man7.org/linux/man-pages/man2/socket.2.html) states:

> The manifest constants used under 4.x BSD for protocol families are PF*UNIX, PF_INET, and so on, while AF_UNIX, AF_INET, and so on are used for address families. However, already the BSD man page promises: "The protocol family generally is the same as the address family", and subsequent standards use AF*\* everywhere.

Researching the discussions above in Beej's book led me to [Vint Cerf](https://en.wikipedia.org/wiki/Vint_Cerf), one of the _fathers of the internet_. I always knew of [Tim Berners-Lee](https://en.wikipedia.org/wiki/Tim_Berners-Lee) but Sir Timothy wouldn't have been able to create the _world wide web_ without the prerequisite work performed by Mr. Cerf. Vint Cerf wrote some of the original RFCs back in the 60s, such as [RFC 20 - ASCII format for Network Interchange](https://www.rfc-editor.org/rfc/rfc20). He has contributed to much more than this, and is still active in the community as of February 2026.

But I digress, back to the `AF_INET`/`PF_INET` macro.

`PF_INET` gets referenced in a network handler, such as the one that can be seen in the Linux kernel source code. `af_inet.c` is named in the source comments as the `PF_INET protocol family socket handler`. Here is one excerpt of its usage.

- `net/ipv4/af_inet.c`

```c
const struct proto_ops inet_stream_ops = {
  .family = PF_INET,
  // ...
}
```

In this example code, we know the `.family` is being set to `2`, meaning _this ops table is for sockets in the IPv4 family_.

So, that is all very interesting. But, if `sys/socket.h` is transitively included by `arpa/inet.h`, why would we need to add a specific include statement for `sys/socket.h`? Technically, our program should work without it. But, our program becomes less **portable**. To write a strictly POSIX-conforming application, you must explicitly include the specific header file that the POSIX standard mandates for each function or macro used. The POSIX standard states that the [socket functions](https://pubs.opengroup.org/onlinepubs/9799919799/nframe.html) are _owned_ by `sys/socket.h`. Therefore, this file should be explicitly included as a best practice when working with sockets.

The goal of this project isn't necessarily portability, as the network code I'm writing is purely for educational purposes, and not intended to be used in a production application. However, going down rabbit holes such as the POSIX standard happens to be very educational. I'll include the socket header as a defined best practice.

## Raw Sockets

I completed the socket programming today, and successfully sent an echo request and received an echo reply using my custom ip/icmp packet. It was all pretty satisfying. This required the use of raw sockets, which is a root level permission on Linux. This is due to the fact that typically the kernel would provide the headers and help prevent packet spoofing.

```c
  // Building a socket, transmit the packet

  // Why is root required to run this code now? Short answer, because we are using raw sockets
  // In standard network programs, the kernel abstracts away the IP layer, and generates the headers
  // This prevents spoofing or other unsafe operations
  // In this instance, we are specifically telling the kernel that we will provide all header information
  // Standard users cannot do this, and root privileges must be used to perform these operations

  // Create a raw socket explicitly bound to the ICMP protocol (so we can receive replies)
  int raw_socket = socket(AF_INET, SOCK_RAW, IPPROTO_ICMP);
  if (raw_socket < 0)
  {
    perror("Socket creation failed. Are you running as root?");
    return -1;
  }

  // Manually instruct the kernel that we are providing our own IPv4 Header (IP_HDRINCL)
  int hdr_incl = 1;
  if (setsockopt(raw_socket, IPPROTO_IP, IP_HDRINCL, &hdr_incl, sizeof(hdr_incl)) < 0)
  {
    perror("Failed to set IP_HDRINCL");
    close(raw_socket);
    return -1;
  }

  printf("Phase 4: Raw socket successfully created with IP_HDRINCL (fd: %d).\n", raw_socket);

  // Construct the targeting structure for the kernel's routing table
  struct sockaddr_in dest_info = {0};

  dest_info.sin_family = AF_INET;
  dest_info.sin_port = htons(0); // ICMP does not use Layer 4 ports
  inet_pton(AF_INET, "127.0.0.1", &dest_info.sin_addr.s_addr);

  // Test 21: Validate the kernel routing structure
  assert(dest_info.sin_family == AF_INET);
  assert(dest_info.sin_port == 0);
  assert(ntohl(dest_info.sin_addr.s_addr) == 0x7F000001);
  printf("Test 21 Passed: Kernel routing structure (sockaddr_in) populated.\n");

  // Inject the packet_buffer onto the wire
  ssize_t bytes_sent = sendto(raw_socket, packet_buffer, ntohs(ip->total_length), 0,
                (struct sockaddr *)&dest_info, sizeof(dest_info));

  if (bytes_sent < 0)
  {
    perror("Failed to send packet");
    close(raw_socket);
    return -1;
  }

  // Test 22: Validate transmission size
  assert(bytes_sent == ntohs(ip->total_length));
  printf("Test 22 Passed: Successfully injected %zd bytes onto the wire.\n", bytes_sent);
  printf("Use `sudo tcpdump -vv -i lo -n icmp` to see the results.\n");

  uint8_t recv_buffer[1024] = {0};
  struct sockaddr_in sender_info;
  socklen_t sender_len = sizeof(sender_info);

  struct ipv4_header *recv_ip = NULL;
  struct icmp_header *recv_icmp = NULL;

  printf("Listening for Echo Reply...\n");

  while (1)
  {
    ssize_t bytes_received = recvfrom(raw_socket, recv_buffer, sizeof(recv_buffer), 0,
                      (struct sockaddr *)&sender_info, &sender_len);
    if (bytes_received < 0)
      continue; // Skip socket read errors

    recv_ip = (struct ipv4_header *)recv_buffer;

    // Ensure it's ICMP and from 127.0.0.1
    if (recv_ip->protocol != IP_PROTO_ICMP || ntohl(recv_ip->src_addr) != 0x7F000001)
    {
      continue;
    }

    uint8_t recv_ihl = recv_ip->version_ihl & 0x0F;
    size_t ip_header_bytes = recv_ihl * 4;
    recv_icmp = (struct icmp_header *)(recv_buffer + ip_header_bytes);

    // If it is our Echo Request reflecting back, ignore it. We only want the Reply.
    if (recv_icmp->type == ECHO_REPLY)
    {
      printf("Test 25 Passed: Ignored our own request and caught the true Echo Reply!\n");
      break; // We found the target packet, exit the loop!
    }
  }

  // Map the Echo-specific fields immediately after the baseline ICMP header
  struct icmp_echo *recv_echo = (struct icmp_echo *)((uint8_t *)recv_icmp + sizeof(struct icmp_header));

  // Test 26: Validate the Identifier and Sequence
  assert(ntohs(recv_echo->identifier) == 0x1234);
  assert(ntohs(recv_echo->sequence) == 0x0001);
  printf("Test 26 Passed: Echo Reply Identifier and Sequence match our Request.\n");

  // Map a pointer to the start of the returned payload
  uint8_t *recv_payload = (uint8_t *)recv_echo + sizeof(struct icmp_echo);

  // Test 27: Validate the payload content
  // memcmp returns 0 if the memory blocks are identical
  assert(memcmp(recv_payload, "HELLO", 5) == 0);
  printf("Test 27 Passed: Payload successfully extracted and verified as 'HELLO'.\n");
```

I'm now working on a second version that is a bit more dynamic, and a little less loaded with useless comments and asserts. The complete source code is available at [Github](https://github.com/jimdiroffii/ip-protocol-from-scratch).
