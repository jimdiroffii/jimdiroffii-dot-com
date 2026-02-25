+++
date = '2026-02-23T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 034'
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

I'm working through the checksum calculation today. I've read up on RFC 1071, RFC 1141 and RFC 1624, which all have to do with implementing checksum calculations for the Internet Protocol. The process seems relatively simple, but I needed some refreshment on terminology since I'm not well versed in binary math and manipulation.

### The 1's Complement and 2's Complement

The term _complement_ is thrown around quite a bit when reading about checksum calculation, and I had to refresh myself on what this actually means.

In decimal math, the opposite of a positive number is the same number in negative. So, \(5\) and \(-5\).

Binary doesn't have a negative sign, to opposites are represented by the complement. A flipping of every bit. So, \(0000 1111\) has a one's complement of \(1111 0000\). This is equivalent to a bitwise `NOT` operation. Why is this the case?

#### Boolean Algebra

I had to bust out a text book to help understand this a bit deeper. I'm not satisfied with knowing something is true without digging into **why** it is true. I have a copy of _Discrete Mathematics with Applications_ by Susanna S. Epp at my desk for purposes such as this. I figured there was likely some information on binary complements in the book. The index of terms led me to Chapter 6.4 on _Boolean Algebra, Russell's Paradox, and the Halting Problem_. Here we get the _Complement Law_ and _Double Complement Law_ for boolean algebra, with associated proofs. These proofs lead directly into _Russell's Paradox_, _The Barber Puzzle_, and Turing's _Halting Problem_. Which are all interesting reads on their own. I'm starting to get into the weeds here though, so I did a little research online and found an explanation on the [Electrical and Computer Engineering subreddit](https://www.reddit.com/r/ECE/). [This post](https://www.reddit.com/r/ECE/comments/xyyju8/comment/irjbt11/) explains both 1's and 2's complements with some examples with the number \(4\). I'm going to repost an expanded summary and minor excerpts of the explanation, should the reddit post ever become unavailable.

#### Complements Explainer Example

The number \(4\) in binary, represented in 5 bits, is \(00100\). The 1's complement of \(4\) is therefore \(11011\). Taken as a decimal number, this would equal \(27\). But, that isn't how it works in the complement system.

For a 1's complement, the complement of \(4\) (\(-4\)) is a straight inverse (`NOT`) operation, as shown in the previous sentence.

For a 2's complement, a 1's complement is taken, and then \(1\) is added to the binary value. The 2's complement of \(4\) is therefore \(11100\). In decimal, this equals \(28\).

One of the key insights here, is that we have to decide how we are going to interpret the binary value. Not all representations mean the same thing in every context. There are at least 3 representations of the binary values that must be considered:

- Unsigned
- 1's complement
- 2's complement

Each representation differs in how the binary is going to interpreted. 1's and 2's complements are called a **signed encoding scheme**.

##### Unsigned

- \(00100\) = \(4\)
- \(11011\) = \(27\)
- \(11100\) = \(28\)

##### 1's Complement

In a 1's complement encoding, a negative value is represented by inverting all bits of the corresponding positive value. This means the inverse of \(00100\) (which is \(11011\)) is interpreted as \(-4\), not \(27\).

- \(00100\) = \(4\)
- \(11011\) = \(-4\)
- \(11100\) = \(-3\)

To see why \(11100\) is \(-3\) in 1's complement, invert it:

- \(11100 \xrightarrow{\text{NOT}} 00011 = 3\)

Since the original value started with a leading \(1\), it is interpreted as a negative value in this encoding, so the result is \(-3\).

A major drawback of 1's complement is that it has **two representations of zero**:

- \(00000\) = \(+0\)
- \(11111\) = \(-0\)

This duplicate zero is one of the reasons 1's complement is not commonly used in modern systems.

##### 2's Complement

In a 2's complement encoding, a negative value is represented by inverting all bits and then adding \(1\). This is why \(11100\) is interpreted as \(-4\) in 2's complement.

- \(00100\) = \(4\)
- \(11011\) = \(-5\)
- \(11100\) = \(-4\)

To verify \(11100\) as \(-4\), reverse the process:

1. Invert the bits: \(11100 \to 00011\)
2. Add \(1\): \(00011 + 1 = 00100\)
3. Apply the negative sign: \(-4\)

Likewise, \(11011\) in 2's complement is:

1. Invert the bits: \(11011 \to 00100\)
2. Add \(1\): \(00100 + 1 = 00101\)
3. Therefore: \(-5\)

##### Why the Same Bits Mean Different Things

This is the part that usually feels strange at first: the bit pattern itself does **not** inherently contain a sign. The meaning comes from the encoding scheme you choose.

For example, the same 5-bit pattern \(11100\) can mean:

- \(28\) (unsigned)
- \(-3\) (1's complement)
- \(-4\) (2's complement)

So when working with binary, you are never just asking, "What number is this?" You are asking:

- "What number is this, **under this encoding scheme**?"

##### A Quick Intuition for 2's Complement

A helpful way to think about 2's complement is **wraparound arithmetic**.

With 5 bits, there are \(2^5 = 32\) total bit patterns, so arithmetic wraps around modulo \(32\). In that system, the value that behaves like \(-4\) is the one that adds with \(4\) to produce \(0\) (mod \(32\)).

\[
4 + 28 = 32 \equiv 0 \pmod{32}
\]

Since \(28\) in binary is \(11100\), the pattern \(11100\) is used to represent \(-4\) in 2's complement.

This is why the unsigned value \(28\) and the signed value \(-4\) can share the same bit pattern.

##### Summary

Using the 5-bit value for \(4\), \(00100\):

- **1's complement of \(4\)**: \(11011\) (represents \(-4\) in 1's complement)
- **2's complement of \(4\)**: \(11100\) (represents \(-4\) in 2's complement)

The key concept is that **binary patterns are interpreted according to a representation scheme**. Without specifying whether the value is unsigned, 1's complement, or 2's complement, the bit pattern alone is ambiguous.

### The Carry Bit

The IP Header checksum relies on adding numbers together in 16-bit chunks. 16-bits has a maximum decimal value of \(65535\) and a max binary value of `0xFFFF`. If you add two values and the result exceeds `0xFFFF`, the extra bits overflow and would be lost.

```math
0x8000 + 0x8000 = 0x10000
```

The \(1\) in the 17th bit would be lost and the result would be `0x0000`. The 17th bit in this example is the **carry bit**.

Standard binary addition ignores the carry bit (this is called 2's complement arithmetic, which is how standard CPU addition works). However, 1's Complement Addition has a special rule: You must never lose the carry bit. If an addition causes an overflow (a carry), you take that carry bit from the 17th position and add it back into the lowest bit (the 1st position) of your sum. This is formally called "end-around carry."

#### Example of 1's Complement Addition

- Add `0xFFFF` and `0x0001`.
- Standard addition: `0xFFFF` + `0x0001` = `0x10000`.
- End-around carry: Take that \(1\) from the 17th position, erase it, and add it to the bottom.
- Result: `0x0000` + `0x0001` = `0x0001`.

### The RFC Requirement for 1's Complement

RFC 791 states that the checksum is:

> The checksum field is the 16 bit one's complement of the one's complement sum of all 16 bit words in the header. For purposes of computing the checksum, the value of the checksum field is zero.

With this information, we can determine that the checksum calculation will require three steps:

#### Step A: Accumulate (The One's Complement Sum)

We read our IP header in 16-bit chunks. Because standard CPUs do not automatically perform "end-around carry" for us, we cheat. We create a 32-bit bucket (variable) to hold our sum. Because the bucket is 32 bits wide, the 17th-bit carries never overflow and disappear; they simply accumulate safely in the upper 16 bits of our 32-bit bucket.

#### Step B: Fold (End-Around Carry)

Once we have added every 16-bit word of the header into our 32-bit bucket, we look at the upper 16 bits. If there is anything up there, we shift it down and add it to the lower 16 bits. We have now manually performed the "end-around carry."

#### Step C: Invert (The One's Complement)

Finally, we take our folded 16-bit sum and flip all the bits (the one's complement). This final, flipped value is the checksum we write into the IP header.

## Conclusion

All of this time spent on researching the checksum, history and mathematics ate up most of my time today. The actual checksum code will have to wait until tomorrow.
