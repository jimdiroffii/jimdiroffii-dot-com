+++
date = '2026-02-26T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 037'
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
| Network Protocols       | C             | In-Progress     | None       | IPv4 Datagram Header built. Need to work on payload and ICMP.                                             |

## Bug Fix - zshrc

I ran into an issue with my zshrc file today. Once again, related to the ssh agent. I use [Linux Mint Debian Edition](https://linuxmint.com/download_lmde.php) with the Cinnamon DE. In an effort to be "helpful," Cinnamon launches an SSH Agent for you when you boot up. This conflicted with my script, as my script was overriding the `$SSH_AUTH_SOCK` with a stale agent. The fix was relatively simple, just check if the `$SSH_AUTH_SOCK` has already been set.

```zsh
###############################################################################
# Configure SSH Agent
###############################################################################
case "$OSTYPE" in
    darwin*)
        # macOS native launchd handles ssh-agent automatically.
        # Just ensure you have `AddKeysToAgent yes` and `UseKeychain yes` in your ~/.ssh/config
        ;;

    linux*)
        # 1. If a valid socket already exists (e.g., provided by Cinnamon), do nothing!
        if [ ! -S "$SSH_AUTH_SOCK" ]; then
            # Setup a persistent SSH agent to prevent zombie processes
            SSH_ENV="$HOME/.ssh/agent-environment"

            function start_agent {
                # Start ssh-agent and write the environment variables to a file
                ssh-agent | sed 's/^echo/#echo/' > "$SSH_ENV"
                chmod 600 "$SSH_ENV"
                . "$SSH_ENV" > /dev/null
            }

            # If the environment file exists, load it
            if [ -f "$SSH_ENV" ]; then
                . "$SSH_ENV" > /dev/null
                # Check if the PID is alive AND if the socket file actually exists
                if ! kill -0 "$SSH_AGENT_PID" 2>/dev/null || ! [ -S "$SSH_AUTH_SOCK" ]; then
                    start_agent
                fi
            else
                start_agent
            fi
        fi
        ;;
esac
```

## Network Protocols - ICMP in C

The ICMP messaging protocol is extremely simplistic. It still blows my mind how these structures and paradigms defined decades ago still underpin so much technology that we take for granted. I use pings all the time. It is a critical tool in the toolbelt for network troubleshooting.

Many new pieces were added to my program today.

First, an enum for message types:

```c
// ICMP Message Identifiers
enum icmp_message_type
{
  ECHO_REPLY = 0,
  ECHO = 8
};
```

Second, the ICMP header and ICMP Echo payload structs:

```c
// The ICMP Header, modeled from RFC 792
// https://datatracker.ietf.org/doc/html/rfc792
// Every ICMP packet, irregardless of message type, must contain this 4 byte header first
struct icmp_header
{
  uint8_t type;     /* The type of ICMP message, such as `8` for echo, or `0` for echo reply */
  uint8_t code;     /* The code relayed by the message type, varies according to message type */
  uint16_t checksum; /* A ones's complement checksum for the ICMP message */
} __attribute__((packed));

// The ICMP Echo specific data, appended after the baseline ICMP header
struct icmp_echo
{
  uint16_t identifier;
  uint16_t sequence;
} __attribute__((packed));
```

Third, the checksum was modified to support odd bytes:

```c
  // If there is 1 byte remaining, logically pad it with a zero and add it
  if (length == 1)
  {
    uint16_t padded_word = 0;
    // Safely copy the final byte into the first physical byte of our 16-bit word
    ((uint8_t *)&padded_word)[0] = *(const uint8_t *)word_ptr;
    sum += padded_word;
  }
```

Lastly, the ICMP packet was built, and the IPv4 header modified as needed:

```c
  // IPv4 Header Testing is complete
  // ICMP Testing begins

  // The previous packet for testing the IP header is replaced with a packet buffer, as an array
  // Pointer casting will be used to overlay the structs in the correct places
  uint8_t packet_buffer[1024] = {0};

  // Map the IPv4 Header to the start of the buffer
  struct ipv4_header *ip = (struct ipv4_header *)packet_buffer;

  // Map the ICMP Header to the end of the ipv4 header
  struct icmp_header *icmp = (struct icmp_header *)(packet_buffer + sizeof(struct ipv4_header));

  // Build up the IPv4 header, using the predefined values from the IPv4 header testing
  version = 4;
  ihl = 5;
  ip->version_ihl = (version << 4) | ihl;
  assert(ip->version_ihl == 0x45);

  ip->type_of_service = 0x00;
  ip->total_length = htons(20);
  assert(ip->type_of_service == 0x00);
  assert(ntohs(ip->total_length) == 20);

  populated_bytes = (uint8_t *)&ip->identification - (uint8_t *)ip;
  assert(populated_bytes == 4);

  ip->identification = htons(0xBEEF);
  ip->flags_frag_offset = htons(0x0000);
  assert(ntohs(ip->identification) == 0xBEEF);
  assert(ntohs(ip->flags_frag_offset) == 0x0000);

  populated_bytes = (uint8_t *)&ip->time_to_live - (uint8_t *)ip;
  assert(populated_bytes == 8);

  ip->time_to_live = 64;
  ip->protocol = IP_PROTO_ICMP;
  ip->header_checksum = htons(0x0000);
  assert(ip->time_to_live == 64);
  assert(ip->protocol == IP_PROTO_ICMP);
  assert(ntohs(ip->header_checksum) == 0x0000);

  populated_bytes = (uint8_t *)&ip->src_addr - (uint8_t *)ip;
  assert(populated_bytes == 12);

  inet_pton(AF_INET, "127.0.0.1", &ip->src_addr);
  inet_pton(AF_INET, "127.0.0.1", &ip->dst_addr);
  assert(ntohl(ip->src_addr) == 0x7F000001);
  assert(ntohl(ip->dst_addr) == 0x7F000001);

  populated_bytes = (uint8_t *)(ip + 1) - (uint8_t *)ip;
  assert(populated_bytes == 20);

  ip->header_checksum = compute_checksum(ip, sizeof(struct ipv4_header));
  assert(ip->header_checksum == htons(0xBDF7));

  raw_bytes = (const uint8_t *)ip;
  printf("Raw IPv4 Header (Wire Format) | Packet 2:\n");
  for (size_t i = 0; i < sizeof(struct ipv4_header); ++i)
  {
    printf("%02X ", raw_bytes[i]);
    if ((i + 1) % 4 == 0)
      printf("\n");
  }
  printf("\n");

  // New IPv4 Header complete
  // Build the ICMP Header

  icmp->type = ECHO;
  icmp->code = 0;          /* Echo and Echo Reply always use 0 */
  icmp->checksum = htons(0x0000); /* Always use a 0 checksum value for calculation */

  assert(icmp->type == ECHO);
  assert(icmp->code == 0);
  assert(ntohs(icmp->checksum) == 0x0000);

  // The ICMP header should be placed immediately after the IPv4 Header
  size_t icmp_offset = (uint8_t *)icmp - packet_buffer;
  assert(icmp_offset == 20);

  printf("Test 14 Passed: ICMP header set and offset is exactly 20 bytes.\n");

  // Our constructed packet now includes an IPv4 header, and ICMP header
  // This means that our total length has now changed, and must be updated
  // And, since the header will change, so will the checksum
  // The checksum must be set to 0 before calculation
  ip->total_length = htons(sizeof(struct ipv4_header) + sizeof(struct icmp_header));
  ip->header_checksum = 0;
  ip->header_checksum = compute_checksum(ip, sizeof(struct ipv4_header));

  printf("New IPv4 Header Checksum: %04X\n", ip->header_checksum);

  assert(ntohs(ip->total_length) == 24);
  assert(ip->header_checksum != htons(0xBDF7));
  printf("Test 15 Passed: Total length updated and checksum recalculated.\n");

  // Map the Echo struct immediately after the ICMP baseline header
  struct icmp_echo *echo = (struct icmp_echo *)(packet_buffer + sizeof(struct ipv4_header) + sizeof(struct icmp_header));

  // Populate the Echo specific fields
  // Using arbitrary values for our ping session
  echo->identifier = htons(0x1234);
  echo->sequence = htons(0x0001);

  // Test 16: Verify the Echo struct mapping
  assert(ntohs(echo->identifier) == 0x1234);
  assert(ntohs(echo->sequence) == 0x0001);

  // Verify the exact memory offset (20 bytes IP + 4 bytes ICMP base = 24)
  size_t echo_offset = (uint8_t *)echo - packet_buffer;
  assert(echo_offset == 24);
  printf("Test 16 Passed: ICMP Echo specific fields mapped precisely at offset 24.\n");

  // 4 more bytes were appended, so the IPv4 header must be updated
  ip->total_length = htons(sizeof(struct ipv4_header) + sizeof(struct icmp_header) + sizeof(struct icmp_echo));
  ip->header_checksum = 0;
  ip->header_checksum = compute_checksum(ip, sizeof(struct ipv4_header));

  printf("New IPv4 Header Checksum: %04X\n", ip->header_checksum);

  assert(ntohs(ip->total_length) == 28);
  assert(ip->header_checksum != htons(0xF3BD)); /* F3BD is the checksum calculated with the ICMP header attached */
  printf("Test 17 Passed: Total length updated and checksum recalculated.\n");

  // Calculate the ICMP checksum over the entire ICMP message (NOT including the IPv4 Header)
  // Currently, this is just the baseline header + the echo struct (8 bytes total)
  size_t icmp_length = sizeof(struct icmp_header) + sizeof(struct icmp_echo);
  icmp->checksum = compute_checksum(icmp, icmp_length);

  // Test 18: Verify the ICMP checksum is calculated
  assert(icmp->checksum != htons(0x0000));
  printf("Test 18 Passed: ICMP Checksum calculated as %04X\n", ntohs(icmp->checksum));

  // Test 19: Odd-byte Checksum Validation
  // 5 bytes total. Logically padded to 6 bytes: [FF, 00, 01, FF, 48, 00]
  uint8_t odd_dummy[] = {0xFF, 0x00, 0x01, 0xFF, 0x48};
  uint16_t odd_checksum = compute_checksum(odd_dummy, sizeof(odd_dummy));
  assert(odd_checksum == htons(0xB6FF));
  printf("Test 19 Passed: Checksum algorithm now handles odd-byte payloads.\n");

  // Now we must construct an arbitrary payload for the ICMP packet
  // This payload will be returned in the Echo Reply

  // Define the payload
  const char *payload_data = "HELLO";
  size_t payload_len = 5; /* Exactly 5 bytes (odd-length), no null-terminator needed for the wire */

  // Map a pointer to exactly where the payload should start
  uint8_t *payload_ptr = packet_buffer + sizeof(struct ipv4_header) + sizeof(struct icmp_header) + sizeof(struct icmp_echo);

  // Copy the payload into the packet buffer
  memcpy(payload_ptr, payload_data, payload_len);

  // 1. Update the IPv4 Header (Total Length & Checksum)
  ip->total_length = htons(sizeof(struct ipv4_header) + sizeof(struct icmp_header) + sizeof(struct icmp_echo) + payload_len);
  ip->header_checksum = 0;
  ip->header_checksum = compute_checksum(ip, sizeof(struct ipv4_header));

  // 2. Update the ICMP Checksum (Baseline + Echo Struct + Payload)
  icmp->checksum = 0; /* MUST zero out the old checksum before recalculating! */
  size_t final_icmp_len = sizeof(struct icmp_header) + sizeof(struct icmp_echo) + payload_len;
  icmp->checksum = compute_checksum(icmp, final_icmp_len);

  // Test 20: Final packet validations
  assert(ntohs(ip->total_length) == 33); // 20 + 4 + 4 + 5
  assert(ip->header_checksum != 0);
  assert(icmp->checksum != 0);
  printf("Test 20 Passed: Payload attached. IP Total Length: 33. Checksums updated.\n");

  // Final Validation: Print the completed, wire-ready 33-byte datagram
  printf("\nRaw IPv4 + ICMP Datagram (Wire Format):\n");
  for (size_t i = 0; i < ntohs(ip->total_length); ++i)
  {
    printf("%02X ", packet_buffer[i]);
    if ((i + 1) % 4 == 0)
      printf("\n");
  }
  printf("\n");
```

Complete source code can be found on the [repo](https://github.com/jimdiroffii/ip-protocol-from-scratch).
