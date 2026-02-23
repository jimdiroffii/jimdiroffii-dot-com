+++
date = '2026-02-22T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 033'
summary = ''
+++

## Project Status

Going to start including the project status table moving forward. This should help better track progress over the year.

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
| Learn Rust              | Rust          | Haven't Started | None       | Installed, need a good tutorial project.                                                                  |
| Learn Elixir            | Elixir        | Haven't Started | None       | Installed, need a good tutorial project.                                                                  |
| Learn Haskell           | Haskell       | Haven't Started | None       | Installed, need a good tutorial project.                                                                  |
| Linux+                  | N/A           | In-Progress     | 2026-03-31 | Reading Chapter 4.                                                                                        |
| Cyber Quest 2026        | N/A           | In-Progress     | 2026-02-28 | Finished quiz 1 with 75%. Need to work on ARP poisoning and timestamp adjustments in WireShark.           |
| Operating Systems       | N/A           | In-Progress     | 2026-03-31 | Reading Chapter 4: Abstraction                                                                            |
| Grey-Hat Hacking        | Various       | In-Progress     | 2026-03-31 | Reading Chapter 8: Threat Hunting Lab                                                                     |
| PHP Time Tracker        | PHP           | Beta Finished   | None       | Working on a basic level. Could use a couple more updates to make it fully functional.                    |
| HTTP Status Code Reader | C             | Complete        | 2026-02-18 | Complete. Could potentially upgrade for more advanced functions or follow redirects.                      |
| ZSH Configuration       | bash/zsh      | Complete        | None       | Sort of an ongoing process, but complete for now. Works good.                                             |
| Network Protocols       | C             | In-Progress     | None       | IPv4 Datagram Header complete in C.                                                                       |

## Project Euler... Thoughts on AI

I came back to Project Euler today, to complete the work on p25. It was about a week ago that I had ChatGPT generate a `BigInt` library for me to calculate extremely large numbers. I was able to one shot the package with ChatGPT, and the library and testing code worked fine with numbers that had 1000+ digits. It was a cool exercise, where I learned absolutely nothing. Furthermore, I came back to the problem today to try and use this new library to solve the Euler problem, and the code is useless. Not only do I have no true understanding of how the library works, but I can't iterate on it without reaching back out to AI for help.

Without deeply statically and dynamically analyzing the functions within the new `BigInt` library, I have no hope of actually knowing how to use it in general programs. I might as well just use the GMP library, which is guaranteed to work faster and be far more feature complete than a package AI writes for me. The effort put into this package was worse than useless, it was a waste of time. A cool toy that does one thing well, but can't be abstracted to anything else.

I really enjoy using the AI chatbots for all kinds of tasks. Like most people, I saw the capabilities of GPT-3 several years ago and was blown away. I've been using ChatGPT, Claude or Gemini practically every day since. Over this time, I've learned when to use AI and, more importantly, when not to. For example, I have practically stopped using AI for writing altogether. AI writing is very easy to detect by people that read a lot of AI generated prose. Writing used to be distinctly human, and now writing is being outsourced to the robots, and we are not better for it. LinkedIn has become a trashbin of AI slop content.

I also stopped trying to "vibe-code" my way through programming an application. It is true that you can come up with an MVP for an idea very fast by letting AI generate the code for you. It has never been faster or easier to build up a prototype of practically anything. But, I have yet to see anyone actually finish a production application through AI generated code. Recently Claude boasted about [creating a C compiler in Rust](https://www.anthropic.com/engineering/building-c-compiler) using only AI agents. Turns out, that compiler couldn't compile "Hello, World", despite being able to compile the Linux kernel and Doom. And that is the thing, the AI code will only do what you asked for. Even the human creator of the project, Nicholas Carlini, remarked this on trying to improve the compiler, "New features and bugfixes frequently broke existing functionality." As with any large software project, that remark is an expectation of large codebases. But, this time, **no one** understands the code, not even the AI agents, because the AI agents don't have **understanding**. We are not dealing with [AGI](https://en.wikipedia.org/wiki/Artificial_general_intelligence), we are dealing with _very_ advanced text prediction engines. It is extremely unlikely that this compiler Claude created will ever be improved or see real production use. Anyone with the time, ability and expertise to actually review and improve this compiler would likely be better off writing one themselves. At least then someone in the world would understand it.

That said, AI tools (and that is all they are, tools) can be very, very helpful at learning something new, troubleshooting a bug, writing something very specific, or working on a very small section of code. Say you need a bunch of random input strings, of variable lengths, one time, to run some test cases. AI is perfect for this, because it takes about 10 seconds to generate exactly what you need, rather than spending a half hour doing it by hand or creating a small application to do it for you. I've found AI very good for helping me improve my dot files such as `.zshrc`. I could spend hours going over details, reading documentation, testing and refining these scripts. Or, I can work with AI to generate one thing at time, iterating constantly, in a back and forth fashion until I get what I want. The big difference here, is that I know exactly what I'm doing, what I'm getting, and how it will be used. I can also abstract the AI output more generally into later functionality without having to reach for AI or documentation again.

To conclude, I felt like I had to get these thoughts out. I was so disappointed in the `BigInt` project code once I tried to actually use it. I have to come back to this project later and try again, this time actually writing out the functionality from scratch. That is the only way to learn something useful.

## IP From Scratch Project

I was doing some research on network protocols, and thought an interesting project could be building up the protocols from scratch using different programming languages, such as C, Rust and Go. I have a lot of network experience, and am familiar with the packet headers for IPv4, but not IPv6. I looked up the RFC for [IPv4](https://www.rfc-editor.org/rfc/pdfrfc/rfc791.txt.pdf) and [IPv6](https://www.rfc-editor.org/rfc/pdfrfc/rfc8200.txt.pdf), and got to work recreating them from scratch. Today's work was focused entirely on the IPv4 packet (datagram) Header.

After my rant on AI code, I actually used Gemini to help me with this project. The point is to learn, and that I what I used the agent for. I wrote all of this code by hand, but had some help from Gemini on understanding exactly what I was doing. It was particularly helpful at understanding compiler options such as `__attribute__((packed))`, endianness, and pointer arithmetic. I think the final result came out pretty good, and I have a much better understanding of how an IP packet is constructed based off the RFC specification. Obviously the comments are extremely verbose, and this was on purpose. I needed to explain each section to myself, and future self, to ensure I could explain every single line of code and why it existed.

```c
#include <stdio.h>
#include <stdint.h>    // fixed type sizes (uint8_t, etc)
#include <assert.h>    // turn assumptions into assertions
#include <stddef.h>    // offsetof()
#include <arpa/inet.h> // htons(), ntohs(), inet_pton(), AF_INET

// Layer 4 Protocol Identifiers
enum ip_protocol {
  IP_PROTO_ICMP = 1,
  IP_PROTO_TCP  = 6,
  IP_PROTO_UDP  = 17
};

// The IPv4 Header, modeled from RFC 791
// The header is laid out in 32-bit (4-byte) words
// To guarantee the compiler does not add any padding to align the struct
// to memory boundries, the __attribute__((packed)) directive is added
struct __attribute__((packed)) ipv4_header {
  // First 32 bits of an IPv4 Header
  uint8_t  version_ihl;      /* 8 bits: Version (4) + Internet Header Length (4) */
  uint8_t  type_of_service;  /* 8 bits: Type of Service */
  uint16_t total_length;     /* 16 bits: Total Length */

  // Second 32 bits contain information regarding packet fragmentation
  // `flags_frag_offset` uses 16 bits to represent two different fields
  // These fields are modified using bitwise shifting masking
  // Identification: Assigned by sender to assist in reassembly of fragments
  // Flags: Bit 0 - (Reserved), Bit 1 - Don't Fragment (DF), Bit 2 - More Fragments (MF)
  // Fragment Offset: The location in the datagram where this fragment belongs
  uint16_t identification;    /* 16 bits: Identification */
  uint16_t flags_frag_offset; /* 16 bits: Flags (3) + Fragment Offset (13) */

  // Third 32 bits contain information on the lifetime, layer 4 protocol, and an integrity check
  // Time to Live (TTL): Originally designed for seconds, this de facto became number of hops
  // If TTL hits zero, the datagram is destroyed
  // Protocol: Layer 4 protocol in use: TCP, UDP or ICMP
  // Header Checksum: Checksum of the IP header only, verified at every hop
  uint8_t  time_to_live;    /* 8 bits: Time to Live (TTL) */
  uint8_t  protocol;        /* 8 bits: Protocol */
  uint16_t header_checksum; /* 16 bits: Header Checksum */

  // Fourth and Fifth sets of 32 bits contain the addressing for source and destination
  // These are the typical IPv4 addresses we are used to: 111.111.111.111
  // Each octet ranges from 0 to 255
  uint32_t src_addr;  /* 32 bits: Source Address */
  uint32_t dst_addr;  /* 32 bits: Destination Address */
};

int main(void) {
  // Test 1: Verify the offsets of individual fields by byte order
  assert(offsetof(struct ipv4_header, version_ihl)        == 0);
  assert(offsetof(struct ipv4_header, type_of_service)    == 1);
  assert(offsetof(struct ipv4_header, total_length)       == 2);
  assert(offsetof(struct ipv4_header, identification)     == 4);
  assert(offsetof(struct ipv4_header, flags_frag_offset)  == 6);
  assert(offsetof(struct ipv4_header, time_to_live)       == 8);
  assert(offsetof(struct ipv4_header, protocol)           == 9);
  assert(offsetof(struct ipv4_header, header_checksum)    == 10);
  assert(offsetof(struct ipv4_header, src_addr)           == 12);
  assert(offsetof(struct ipv4_header, dst_addr)           == 16);
  printf("Test 1 Passed: ipv4_header offsets are correctly positioned.\n");

  // Test 2: Verify the total size of the struct
  assert(sizeof(struct ipv4_header) == 20);
  printf("Test 2 Passed: ipv4_header is exactly 20 bytes.\n");

  // The packet is valid, and construction can begin
  struct ipv4_header packet = {0};

  /***
   * First 32 bits
   */

  // Set Version (4) and IHL (5)
  // The version is simply the IP version we are using
  // The Internet Header Length is based on the size of the IP header in 32-bit (4-byte) words
  // The header is exactly 20 bytes
  // 20 / 4 = 5
  // 5 is the minimum value for a correctly formatted IPv4 header
  // Additionally, version and IHL are sharing the same byte.
  // Therefore, the version must be packed into the high-order (left) bits,
  // and IHL into the low-order (right) bits
  // Take the version number (4), and shift it left by 4 bits using the left-shift operator (<<)
  // IHL is applied by using the OR operator (|)
  uint8_t version = 4;
  uint8_t ihl = 5;
  packet.version_ihl = (version << 4) | ihl;

  // Test 3: Verify the first byte using hexidecimal
  assert(packet.version_ihl == 0x45);
  printf("Test 3 Passed: version_ihl packed correctly (0x45)\n");

  // Set the Type of Service. This is used for things like Quality of Service.
  // Our Type of Service will be "routine" or `00`
  packet.type_of_service = 0x00;

  // Set the Total Length (20 byte header + 0 byte payload)
  // An important point here is that networks always use Big-Endian.
  // This is also known as Network Byte Order.
  // Big-Endian means the most significant octet is transmitted first.
  // However, many computers (such as x86), use Little-Endian
  // Also known as Host Byte Order
  // It is critical that network packets are sent in Network Byte Order
  // htons() is used to guarantee this: Host To Network Short = htons
  // Additionally, htons only matters when a piece of data spans multiple bytes.
  // Since total_length is 16 bits, or 2 bytes, the order must be strictly maintained.
  // This is why htons() is not required on single byte values, such as type_of_service.
  packet.total_length = htons(20);

  // Test 4: Verify TOS and Total Length are correctly populated
  assert(packet.type_of_service == 0x00);
  assert(ntohs(packet.total_length) == 20);
  printf("Test 4 Passed: Type of Service and Total Length are correct.\n");

  // Test 5: Verify that our data is exactly the size we expect using pointer arithmetic
  size_t populated_bytes = (uint8_t *)&packet.identification - (uint8_t *)&packet;
  assert(populated_bytes == 4);
  printf("Test 5 Passed: Exactly 4 contiguous bytes have been populated.\n");

  /***
   * Second 32 bits
   */

  // The fragmentation headers assist with fragmenting packets that are too large
  // to fit on a network segment.
  // The Identification field is assigned by the sender and must be unique to this
  // source-destination-protocol combination for the time the datagram is active
  // We set this test packet to an arbitrary value between 0000 to FFFF
  packet.identification = htons(0xBEEF);

  // The control flags have 3 values:
  // First bit: Reserved, must be 0
  // Second bit: DF flag, 0 = May Fragment, 1 = Don't Fragment
  // Third bit: MF flag, 0 = Last Fragment, 1 = More Fragments
  // The Fragment Offset shares 13 of the 16 bits allocated here, the other 3 are the flags
  // The fragment offset indicates where in the datagram this fragment belongs
  // It is measured in units of 8 octets (64 bits)
  // The fragment offset is a brilliant bit of binary engineering.
  // The Total Length field is 16 bits. This gives a maximum size of a datagram of 65,535 bytes.
  // The Fragment Offset doesn't point to a specific set of bytes, it points to a block of 8 bytes.
  // If the datagram is fragmented, it must be done on an 8 octet boundary.
  // When reassembled, the network device takes the offset and multiplies it by 8 (bitwise left shift 3)
  // This allows 2^13 = 8192 fragments of 8 octets each for a total of 65,536 octets
  // One more than the maximum allowable size of a datagram
  packet.flags_frag_offset = htons(0x0000);

  assert(ntohs(packet.identification) == 0xBEEF);
  assert(ntohs(packet.flags_frag_offset) == 0x0000);
  printf("Test 6 Passed: Identification, Flags and Fragment Offset are correct.\n");

  populated_bytes = (uint8_t *)&packet.time_to_live - (uint8_t *)&packet;
  assert(populated_bytes == 8);
  printf("Test 7 Passed: Exactly 8 contiguous bytes have been populated.\n");

  /***
   * Third 32 bits
   */
  // The Time To Live (TTL) of the packet is essentially a hop count, as every
  // intermediary device the datagram hits decrements the TTL by one. When the TTL
  // is zero, the datagram is destroyed. 64 is the default value.
  packet.time_to_live = 64;

  // The protocol determines the next level protocol in use for this datagram.
  // ICMP = 1, TCP = 6, UDP = 17
  packet.protocol = IP_PROTO_ICMP;

  // Header checksum validate that the datagram is not corrupted in transit.
  // The values of the header change at every hop, so the checksum is constantly
  // being recalculated. Interestingly, the checksum is part of the header, so
  // there is a "chicken and egg" problem. The specification states that for the
  // purposes of the computing the checksum, the checksum field is zero.
  packet.header_checksum = htons(0x0000);

  assert(packet.time_to_live == 64);
  assert(packet.protocol == IP_PROTO_ICMP);
  assert(ntohs(packet.header_checksum) == 0x0000);
  printf("Test 8 Passed: TTL, Protocol, and Checksum correctly set\n");

  populated_bytes = (uint8_t *)&packet.src_addr - (uint8_t *)&packet;
  assert(populated_bytes == 12);
  printf("Test 9 Passed: Exactly 12 contiguous bytes have been populated.\n");

  /***
   * Fourth and Fifth 32 bits
   */
  // inet_pton (Pointer to Network) converts a string IP to a network byte order
  // 32-bit integer
  // Valid range for IPv4 is 0.0.0.0 to 255.255.255.255
  // AF_INET specifies that we are working with IPv4 addresses
  inet_pton(AF_INET, "127.0.0.1", &packet.src_addr);
  inet_pton(AF_INET, "127.0.0.1", &packet.dst_addr);

  // 127.0.0.1 in hex: 0x7F (127), 0x00 (0), 0x00 (0), 0x01 (1)
  // ntohl is Network to Host Long
  assert(ntohl(packet.src_addr) == 0x7F000001);
  assert(ntohl(packet.dst_addr) == 0x7F000001);
  printf("Test 10 Passed: SRC and DST correctly set to 127.0.0.1\n");

  populated_bytes = (uint8_t *)(&packet + 1) - (uint8_t *)&packet;
  assert(populated_bytes == 20);
  printf("Test 11 Passed: Exactly 20 contiguous bytes have been populated.\n");

  printf("Header complete.\n");


  return 0;
}
```
