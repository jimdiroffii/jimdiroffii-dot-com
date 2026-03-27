+++
date = '2026-03-25T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 064'
summary = ''
tags = ['365-days-of-code', 'codingame', 'c']
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
| CodinGame               | C             | Ongoing         | None       | Completed GhostLegs, ASCII Art.                                      |

## CodinGame - MiniCPU Instruction Decoder

Another day, another CodinGame challenge. This one has us performing a simple CPU emulation, reading in instructions, and manipulating registers.

> A simple 8-bit CPU emulator must be debugged. The CPU has 4 registers (`R0`, `R1`, `R2`, `R3`) initialized to `0`.

- Instructions are encoded as hexadecimal bytes:

| Ins. | Reg. | Reg. or Val. |              Description              |
| :--: | :--: | :----------: | :-----------------------------------: |
|  01  |  X   |      V       |     Load value V into register RX     |
|  02  |  X   |      Y       |    Add register RY to register RX     |
|  03  |  X   |      Y       | Subtract register RY from register RX |
|  04  |  X   |      Y       |  Multiply register RX by register RY  |
|  05  |  X   |              |      Increment register RX by 1       |
|  06  |  X   |              |      Decrement register RX by 1       |
|  FF  |      |              |            Halt execution             |

- Where `X` and `Y` are register indices (`0-3`), and `V` is an immediate byte value.
- All arithmetic wraps at 256 (8-bit unsigned). Overflow wraps to 0, underflow wraps to 255.
- The first instruction is not guaranteed to be 01 (MOV). Programs may start with any instruction, including 05 (INC) or 06 (DEC).
- The smallest valid program is just FF (HLT).
- Execute the program and output the final register values.

Input

- Line 1: A string of space-separated hexadecimal bytes program

Output

- 4 lines: The decimal value of each register R0, R1, R2, R3, one value per line

Constraints

- Program length ≤ 100 bytes
- For the opcodes 02, 03 and 04, X ≠ Y
- Program always ends with HLT (FF) as an opcode. Byte value FF may also appear as an immediate value V.

Example Input:

```plaintext
01 00 0A 01 01 05 02 00 01 03 00 01 FF
```

Example Output:

```plaintext
10
5
0
0
```

### Initial Thoughts

This looks pretty simple on the surface. Store the state of the registers, create functions for each of the operations, and output the final state.

### Code

I was able to essentially one-shot this code. It required some debugging to ensure I got the reads correct, but the problem was fairly easy overall. I will note that I had to fill out the entire switch statement for the program to operate as expected. In my naivite, I only created the first opcode, `mov` in the `switch` and started testing. Since I wasn't consuming the other opcodes, I was getting garbage output and seg faults.

```c
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

/**
 * Decode and execute the MiniCPU bytecode program.
 **/

void mov(uint8_t *r, uint8_t val)
{
    *r = val;
    return;
}

void add(uint8_t *r1, uint8_t *r2)
{
    *r1 += *r2;
    return;
}

void sub(uint8_t *r1, uint8_t *r2)
{
    *r1 -= *r2;
    return;
}

void mul(uint8_t *r1, uint8_t *r2)
{
    *r1 *= *r2;
    return;
}

void inc(uint8_t *r)
{
    *r += 1;
    return;
}

void dec(uint8_t *r)
{
    *r -= 1;
    return;
}

int main()
{
    // Space-separated hex bytes representing CPU instructions
    char program[501] = "";
    scanf("%[^\n]", program);

    uint8_t R0 = 0;
    uint8_t R1 = 0;
    uint8_t R2 = 0;
    uint8_t R3 = 0;
    uint8_t *arr[4] = {&R0, &R1, &R2, &R3};

    int pos = 0;
    int consumed;

    unsigned int byte;
    bool halted = false;
    while (!halted && sscanf(program + pos, "%x%n", &byte, &consumed) == 1) {
        uint8_t b = (uint8_t)byte;
        pos += consumed;
        fprintf(stderr, "%x\n", b);
        switch (b)
        {
            case 0x01:
            {
                fprintf(stderr, "mov\n");
                sscanf(program + pos, "%x%n", &byte, &consumed);
                uint8_t r = (uint8_t)byte;
                fprintf(stderr, "r: %d\n", r);
                pos += consumed;
                sscanf(program + pos, "%x%n", &byte, &consumed);
                uint8_t val = (uint8_t)byte;
                fprintf(stderr, "val: %d\n", val);
                pos += consumed;
                mov(arr[r], val);
                break;
            }
            case 0x02:
            {
                fprintf(stderr, "add\n");
                sscanf(program + pos, "%x%n", &byte, &consumed);
                uint8_t r1 = (uint8_t)byte;
                fprintf(stderr, "r1: %d\n", r1);
                pos += consumed;
                sscanf(program + pos, "%x%n", &byte, &consumed);
                uint8_t r2 = (uint8_t)byte;
                fprintf(stderr, "r2: %d\n", r2);
                pos += consumed;
                add(arr[r1], arr[r2]);
                break;
            }
            case 0x03:
            {
                fprintf(stderr, "sub\n");
                sscanf(program + pos, "%x%n", &byte, &consumed);
                uint8_t r1 = (uint8_t)byte;
                fprintf(stderr, "r1: %d\n", r1);
                pos += consumed;
                sscanf(program + pos, "%x%n", &byte, &consumed);
                uint8_t r2 = (uint8_t)byte;
                fprintf(stderr, "r2: %d\n", r2);
                pos += consumed;
                sub(arr[r1], arr[r2]);
                break;
            }
            case 0x04:
            {
                fprintf(stderr, "mul\n");
                sscanf(program + pos, "%x%n", &byte, &consumed);
                uint8_t r1 = (uint8_t)byte;
                fprintf(stderr, "r1: %d\n", r1);
                pos += consumed;
                sscanf(program + pos, "%x%n", &byte, &consumed);
                uint8_t r2 = (uint8_t)byte;
                fprintf(stderr, "r2: %d\n", r2);
                pos += consumed;
                mul(arr[r1], arr[r2]);
                break;
            }
            case 0x05:
            {
                fprintf(stderr, "inc\n");
                sscanf(program + pos, "%x%n", &byte, &consumed);
                uint8_t r = (uint8_t)byte;
                fprintf(stderr, "r1: %d\n", r);
                pos += consumed;
                inc(arr[r]);
                break;
            }
            case 0x06:
            {
                fprintf(stderr, "dec\n");
                sscanf(program + pos, "%x%n", &byte, &consumed);
                uint8_t r = (uint8_t)byte;
                fprintf(stderr, "r1: %d\n", r);
                pos += consumed;
                dec(arr[r]);
                break;
            }
            case 0xFF:
                fprintf(stderr, "halt\n");
                halted = true;
                break;
            default:
                fprintf(stderr, "unknown opcode\n");
                halted = true;
                break;
        }
    }

    // Print the final value of each register R0, R1, R2, R3, one value per line
    printf("%d\n%d\n%d\n%d\n", R0, R1, R2, R3);

    return 0;
}
```

Tested... 100%.
