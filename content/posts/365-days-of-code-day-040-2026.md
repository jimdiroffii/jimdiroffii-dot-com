+++
date = '2026-03-01T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 040'
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
| Cyber Quest 2026        | N/A           | In-Progress     | 2026-02-28 | Finished quiz 1 with 75%.                                                                                 |
| Operating Systems       | N/A           | In-Progress     | 2026-03-31 | Reading Chapter 4: Abstraction                                                                            |
| Grey-Hat Hacking        | Various       | In-Progress     | 2026-03-31 | Reading Chapter 8: Threat Hunting Lab                                                                     |
| PHP Time Tracker        | PHP           | Beta Finished   | None       | Working on a basic level. Could use a couple more updates to make it fully functional.                    |
| HTTP Status Code Reader | C             | Complete        | 2026-02-18 | Complete. Could potentially upgrade for more advanced functions or follow redirects.                      |
| ZSH Configuration       | bash/zsh      | Complete        | None       | Sort of an ongoing process, but complete for now. Works good.                                             |
| Network Protocols       | C             | In-Progress     | None       | Custom ICMP packet sent on the wire. Working on V2.                                                       |

## Network Protocols Version 2

With the introductory network programming completed, and a packet successfully built and sent out of the local interface, it is time to clean up the program, and expand the functionality a bit. I'm still sticking with simple ICMP packets, but refactoring the code to be a bit more dynamic. Pulling functionality into functions, setting up boundaries and defensive programming for data, using smarter placement of `assert`, more useful `enum` values, and defining some magic numbers. The goal now is to get a bit closer to `ping` functionality. Sending an arbitrary number of packets to another host on the wire, and processing the responses.

I've begun the programming, but it is far from complete. Here is the partial version 2:

```c
/***
 * IP / ICMP Stack V2
 *
 * This program is built using the lessons from V1, but completely refactored
 * to be more dynamic.
 */

#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <arpa/inet.h>

#define PACKET_MAX_SIZE 65535
#define IP_HEADER_LENGTH 5
#define STANDARD_TTL 64

// IP Version
enum ip_version
{
  V4 = 4,
  V6 = 6
};

// Protocol Identifiers
enum ip_protocol
{
  IP_PROTO_ICMP = 1
};

// ICMP Message Identifiers
enum icmp_message_type
{
  ECHO_REPLY = 0,
  ECHO = 8
};

// IPv4 Header
struct ipv4_header
{
  uint8_t version_ihl;    /* IP Version (4 bits) + Internet Header Length (4 bits)*/
  uint8_t type_of_service;  /* Quality of Service Identifier */
  uint16_t total_length;    /* Total Length of Header */
  uint16_t identification;  /* Fragment ID */
  uint16_t flags_frag_offset; /* Flags (3 bits) + Fragment Offset (13 bits) */
  uint8_t time_to_live;    /* Time to Live (TTL) */
  uint8_t protocol;      /* Protocol Identifier */
  uint16_t checksum;      /* Ones' Complement Checksum */
  uint32_t src_addr;      /* Source Address: x.x.x.x */
  uint32_t dst_addr;      /* Destination Address: x.x.x.x */
} __attribute__((packed));

// ICMP Header
struct icmp_header
{
  uint8_t type;     /* Message Identifier */
  uint8_t code;     /* Message Code */
  uint16_t checksum; /* Ones' Complement Checksum */
} __attribute__((packed));

/***
 * icmp_echo
 *
 * Required header information for an echo / echo reply request. Not payload data.
 *
 * @field identifier  Session ID, may be 0
 * @field sequence    Sequence number, may be 0
 */
struct icmp_echo
{
  uint16_t identifier; /* Session ID, may be 0 */
  uint16_t sequence;   /* Sequence Number, may be 0 */
} __attribute__((packed));

/***
 * compute_checksum
 *
 * Computes a ones' complement checksum on an arbitrary number of bytes
 *
 * @param data    The data to compute a checksum for
 * @param length  The size of the data in bytes
 * @return        A 2 byte checksum value
 */
uint16_t compute_checksum(const void *data, size_t length)
{
  const uint16_t *word_ptr = (const uint16_t *)data;
  uint32_t sum = 0;

  while (length > 1)
  {
    sum += *word_ptr++;
    length -= 2;
  }

  if (length == 1)
  {
    uint16_t padded_word = 0;
    ((uint8_t *)&padded_word)[0] = *(const uint8_t *)word_ptr;
    sum += padded_word;
  }

  while (sum >> 16)
  {
    sum = (sum & 0xFFFF) + (sum >> 16);
  }

  return (uint16_t)~sum;
}

/***
 * construct_packet
 *
 * Builds an IPv4 packet.
 *
 * @param buffer           Pointer to packet buffer to populate
 * @param buffer_capacity  Total size of packet buffer
 * @param src              Pointer to IPv4 source address string
 * @param dst              Pointer to IPv4 destination address string
 * @param data             Pointer to packet payload string
 * @param seq              Integer of packet sequence number
 * @return                 void
 */
void construct_packet(uint8_t *buffer, size_t buffer_capacity, const char *src, const char *dst, const char *data, int seq)
{
  construct_ipv4_header(buffer, buffer_capacity, src, dst);
  return;
}

void construct_ipv4_header(uint8_t *buffer, size_t buffer_capacity, const char *src, const char *dst)
{
  struct ipv4_header *iphdr = (struct ipv4_header *)buffer;
  uint8_t version = V4;
  iphdr->version_ihl = (version << 4) | IP_HEADER_LENGTH;
  iphdr->type_of_service = 0x00;
  iphdr->total_length = htons(20);
  iphdr->identification = htons(0xBEEF); // this should be dynamic
  iphdr->flags_frag_offset = htons(0x0000);
  iphdr->time_to_live = STANDARD_TTL;
  iphdr->protocol = IP_PROTO_ICMP;
  iphdr->checksum = htons(0x0000);
  inet_pton(AF_INET, src, &iphdr->src_addr);
  inet_pton(AF_INET, dst, &iphdr->dst_addr);
  iphdr->checksum = compute_checksum(iphdr, sizeof(struct ipv4_header));
  return;
}

/***
 * execute
 *
 * Generates, sends and receives n packets
 *
 * @param src   Pointer to IPv4 source address string
 * @param dst   Pointer to IPv4 destination address string
 * @param data  Pointer to packet payload string
 * @param n     Integer of number of packets to send
 */
void execute(const char *src, const char *dst, const char *data, int n)
{
  uint8_t packet_buffer[PACKET_MAX_SIZE] = {0};
  for (int i = 0; i < n; ++i)
  {
    memset(packet_buffer, 0, sizeof(packet_buffer));
    construct_packet(packet_buffer, sizeof(packet_buffer), src, dst, data, i);
  }
  return;
}

int main(void)
{
  printf("** ICMP Echo Sender **\n");

  char *src_addr = "192.168.50.128";
  printf("Source Address: %s\n", src_addr);

  char *dst_addr = "192.168.50.230";
  printf("Destination Address: %s\n", dst_addr);

  char *payload = "HELLO";
  printf("Payload: %s\n", payload);

  int num_to_send = 1;
  printf("Number of packets: %i\n", num_to_send);

  execute(src_addr, dst_addr, payload, num_to_send);

  return 0;
}
```

As we can see, much cleaner than version 1. Still have a little ways to go before it is complete, but this is a good start.
