+++
date = '2026-02-24T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 035'
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
| Network Protocols       | C             | In-Progress     | None       | IPv4 Datagram Header built, working on checksum calculation                                               |

## Network Protocols - Calculating the IP Header Checksum

Yesterday, I spent a great deal of time working on understanding the IP header checksum, and how complements work in binary. Today, we implement the algorithm to calculate the checksum, and further our IP protocol development work.

### Implementing The Math: Accumulate, Fold, and Invert

It can be helpful to simplify a process before carrying it out to facilitate a better level of understanding. We determined yesterday that performing the checksum calculation requires a 3-step process: accumulate, fold and invert.

Let's imagine this process using only 3 16-bit words, summed and then stored in a 32-bit variable.

- Word 1: `0xFF00`
- Word 2: `0x01FF`
- Word 3: `0x0002`

The accumulation step is adding all of these words together. Adding `0xFF00` and `0x01FF` to each other equals `0x100FF`. We can see the result is 17-bits long. The extra bit is a considered a carry bit. This is why a 32-bit variable is required when adding these 16-bit words together.

Adding the third word to our previous result: `0x100FF` plus `0x0002` equals `0x10101`. The end result in the 32-bit variable is `0x00010101`.

The next step is the folding, otherwise known as the _end-around carry_. The 32-bit double word is split into two 16-bit words.

- Upper (Carry Bits): `0x0001`
- Lower (Base Sum): `0x0101`

To perform _one's complement addition_, the carries are added back into the base sum. `0x0001` + `0x0101` = `0x0102`. Note that if this summation resulted in another carry bit, the folding process would just happen again.

The last step is to perform the inversion, or one's complement. Here, each bit is flipped.

- Hex: `0x0102`
- Binary: `0000 0001 0000 0010`
- One's Complement: `1111 1110 1111 1101`
- Hex: `0xFEFD`

The value `0xFEFD` is the final checksum value, for this example with 3 16-bit words.

### Implementing The Header Checksum

The checksum function we are writing is specifically calculating the checksum for the header. Later on, if we implement ICMP, this same checksum function will be used, but additional functionality to deal with odd byte situations would need to be added. In an effort to reduce premature complexity, we are going with only the functionality required **right now**. Which is to calculate the checksum for an IP header that is exactly 20 bytes.

```c
/***
 * compute_checksum()
 *
 * This function takes an IP header, and calculates the checksum using one's complement addition.
 */
uint16_t compute_checksum(const void *data, size_t length) {
  // Declare a 16-bit pointer that will walk over the IP packet, 16-bits at a time
  const uint16_t *word_ptr = (const uint16_t *)data;
  // The sum must be a 32-bit value, to handle one's complement addition and the carry bits
  uint32_t sum = 0;

  while (length > 1) {
    sum += *word_ptr++; /* add the 16-bits of data to the sum and increment the pointer */
    length -= 2;        /* we moved 2 bytes forward, so we must decrement by 2 */
  }

  // Accumulate and Fold (carry)
  // `sum >> 16` is a bitwise shift that pulls the top 16 bits down to the bottom, isolating the carries
  // `sum & 0xFFFF` is a bitwise AND which isolates the bottom 16 bits, masking out the top
  // The top 16 and the bottom 16 are added together and stored in `sum`
  // If there are no carries, the shift evaluates to 0, and the loop breaks
  while (sum >> 16) {
    sum = (sum & 0xFFFF) + (sum >> 16);
  }

  // Invert
  // Finally, `~sum` is a bitwise NOT operation that inverts every bit, completing the checksum calculation
  return (uint16_t)~sum;
}
```

### Testing and Validation of Checksum

With the header checkup calculation complete, we can put it into use. First, we should test it with known good data that has been manually calculated. We can use the 3 word example from the explanation above. An array of bytes is used here since it just creates a contiguous block of bytes of memory that we can step over using any size pointer we choose (see the `void *` in compute_checksum). We may be creating an array of values that 1 byte each, but we are going to read them 2 bytes at a time. This is part of the magic, and danger, of working with C. If we were to read that array with a 32-bit pointer, and try to read 4 bytes, when our data only contains 3 bytes, we would be reading additional memory that we did not explicitly set, leading to undefined behavior.

When our checksum reads this data back, it will be split like this: `[FF00] [01FF] [0002]`.

```c
// Validate Checksum with Dummy Data
uint8_t dummy_data[] = { 0xFF, 0x00, 0x01, 0xFF, 0x00, 0x02 };
uint16_t dummy_checksum = compute_checksum(dummy_data, sizeof(dummy_data));
assert(dummy_checksum == htons(0xFEFD));
printf("Test 12 Passed: Checksum validation with dummy data.\n");
```

Due to endianness, it is **NOT** equivalent to write:

```c
uint16_t dummy_data[] = { 0xFF00, 0x01FF, 0x0002 };
```

Modern processors are _Little-Endian_. So, by using a 2-byte word, the order of the bits would be switched by the compiler. We would end up with these values in the checksum function: `[00FF] [FF01] [0200]`. This would result in a totally different computation. It would have been possible to write the array in 16-bit words, but it would require using the `htons()` function to set Network Byte Order.

```c
uint16_t dummy_data[] = { htons(0xFF00), htons(0x01FF), htons(0x0002) };
```

It is just simpler to declare the array with single byte values.

With the output validated, we can test our packet header that we constructed.

```c
// Calculate and store packet header checksum
packet.header_checksum = compute_checksum(&packet, sizeof(packet));
assert(packet.header_checksum == htons(0xBDF7));
printf("Test 13 Passed: Checksum validation with constructed packet header.\n");
```

## Print The Raw Byte Array in Wire Format

The header has been constructed, and validated, so we can print out all the bytes and see what they look like.

```c
// Print the raw byte array of the IPv4 header in hexadecimal
const uint8_t *raw_bytes = (const uint8_t *)&packet;
printf("\nRaw IPv4 Header (Wire Format):\n");
for (size_t i = 0; i < sizeof(packet); ++i) {
  printf("%02X ", raw_bytes[i]);
  if ((i + 1) % 4 == 0) printf("\n");
}
```

Result:

```plaintext
Raw IPv4 Header (Wire Format):
45 00 00 14
BE EF 00 00
40 01 BD F7
7F 00 00 01
7F 00 00 01
```

And now it is beginning to really make intuitive sense. The data always seen in WireShark is really beginning to take shape.

The complete code can be found in [this Github repo](https://github.com/jimdiroffii/ip-protocol-from-scratch).
