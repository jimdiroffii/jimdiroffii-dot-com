+++
date = '2026-03-12T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 051'
summary = ''
tags = ["365-days-of-code-2026", "c"]
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

## Code Conventions and Style

While working on the new IP library for [IP Protocol From Scratch](https://github.com/jimdiroffii/ip-protocol-from-scratch), I started to need to include header files from source code that I wrote, rather than only the standard libraries. I did some research on modern conventions, and came across [this StackExchange post](https://softwareengineering.stackexchange.com/a/325565). To summarize the modern ordering for `include`:

1. The header file that declares the functions being defined in the source file is the very first that is included.
1. Other header files from the same project are included next.
1. Header files from non-standard projects (e.g., eigen, boost, Qt) are included after local headers.
1. Finally, standard header files are included last.
1. Out of order inclusions need to be clearly documented with regard to why the header was not included in the above order.

> Ideally, all header files should be self-contained, and inclusion order should not matter. In practice, people often write header files that are not self-contained, and sometimes inclusion order does matter. To combat the first problem, that the first included file is the header file that declares the functions that are being defined in a source file creates a nice test that a header file is indeed self-contained. Compilation errors that result from that very first included file means there's a bug in that header.

Hey, that is a good enough explanation for me. Primarily, I like the fact that if we include our custom headers first, any issues with those headers will be flagged by the compiler, rather than being supported or avoided by a previous include statement. Other than that comment on StackExchange, I couldn't find another authoritative source on the order of includes for C. There are many style guides, and they all differ a little bit.

### Style Guides

I use a the Microsoft C/C++ Intellisense extension to provide syntax formatting in my code. But, syntax formatting isn't everything, and there are a number of different style guides available for C. By far, it seems the most important aspect of style is **consistency**. Second to consistency is readability. Readability can mean many things, but I think one of the most important aspects of readability is proper white space usage. I've read through many different style guides, and will try to incorporate some of the best features (in my opinion) from each.

#### Condition Formatting

From the [C Code Standard by Carnegie Mellon University](https://users.ece.cmu.edu/~eno/coding/CCodingStandard.html):

> Always put the constant on the left hand side of an equality/inequality comparison. For example: `if ( 6 == errorNum ) ...`. One reason is that if you leave out one of the = signs, the compiler will find the error for you. A second reason is that it puts the value you are looking for right up front where you can find it instead of buried at the end of your expression. It takes a little time to get used to this format, but then it really gets useful.

I've certainly always used the opposite approach, which I think is why this is even mentioned in the style guide, because it is very common. I agree with the reasoning, and will try to incorporate this rule into my code.

#### Enums vs Constants (macros)

Also from Carnegie Mellon, this is an interesting note that I haven't seen before, but makes perfect sense. I always noticed that when setting up a standard enum or `#define`, there was no type information for the value.

> C allows constant variables, which should deprecate the use of enums as constants. Unfortunately, in most compilers constants take space. Some compilers will remove constants, but not all. Constants taking space precludes them from being used in tight memory environments like embedded systems. Workstation users should use constants and ignore the rest of this discussion. In general enums are preferred to #define as enums are understood by the debugger. Be aware enums are not of a guaranteed size. So if you have a type that can take a known range of values and it is transported in a message you can't use an enum as the type. Use the correct integer size and use constants or #define. Casting between integers and enums is very error prone as you could cast a value not in the enum.

Specifically, the note on casting `enum` values is of particular interest in network programming, since we generally need to be very explicit about the size of the values we are using. In standard C, the values assigned in an `enum` are typically of type `int`. However, this is the alternative approach using a macro:

```c
#define ICMP_V4_ECHO_REPLY ((uint8_t)0)
#define ICMP_V4_ECHO       ((uint8_t)8)
```

This looks messier, but is very explicit about the type of the value. It begs the question, can we do an explicit cast inside the `enum`? The answer is yes, if using the [C23 standard](https://open-std.org/JTC1/SC22/WG14/www/docs/n3030.htm).

Ultimately, my network code works fine with enums, and I only tend to use a macro when I need to assign only a single value. I'm also not writing this code for use in embedded systems, so I'm going to avoid the unnecessary complications for now.

#### No Magic Numbers

The last Carnegie Mellon style note that I'll reference right now is:

> A magic number is a bare naked number used in source code. It's magic because no-one has a clue what it means including the author inside 3 months.

This is one style that I'm trying to be strict with in my own code. Practically, whenever I need to write a value that is some number, even just a `0`, I would rather replace that with some text that explains the value.

#### Styles Conclusion

There are a ton of C style guides, all with good information. I included a couple examples from Carnegie Mellon, but I don't want to get too bogged down reading style guides instead of writing code. If I get hired by Google one day, then I'll write in their style. Until that happens, I'll just write good looking (to me) C code, and look up specific styles when necessary.

## Building Out More Functions

I completed several new files and functions today. Working step-by-step, and incorporating new improvements as I go. The entire source code is available at [Github](https://github.com/jimdiroffii/ip-protocol-from-scratch).

New files created today:

- checksum.h, checksum.c
- packet_builder.h, packet_builder.c

All protocol files, and some function/enum/macro names were changed to reflect a standard of `protocol` + `version`. Such as `ip_v4.h` and `ip_v6.h` and `struct icmp_v6_echo_header`.
