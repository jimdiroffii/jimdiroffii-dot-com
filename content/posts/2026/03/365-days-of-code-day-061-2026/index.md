+++
date = '2026-03-22T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 061'
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
| CodinGame               | C             | Ongoing         | None       | Finished GhostLegs in C.                                             |

## CodinGame - ASCII Art

_ASCII Art_ is another puzzle challenge from [CodinGame](https://www.codingame.com/). I had fun and success yesterday, so I thought I'd give it another shot today.

### Description

ASCII art allows you to represent forms by using characters. To be precise, in our case, these forms are words. For example, the word "MANHATTAN" could be displayed as follows in ASCII art:

```plaintext
# #  #  ### # #  #  ### ###  #  ###
### # # # # # # # #  #   #  # # # #
### ### # # ### ###  #   #  ### # #
# # # # # # # # # #  #   #  # # # #
# # # # # # # # # #  #   #  # # # #
```

​Your mission is to write a program that can display a line of text in ASCII art in a style you are given as input.

- Input

**Line 1**: the width `L` of a letter represented in ASCII art. All letters are the same width.
**Line 2**: the height `H` of a letter represented in ASCII art. All letters are the same height.
**Line 3**: The line of text `T`, composed of `N` ASCII characters.
**Following lines**: the string of characters `ABCDEFGHIJKLMNOPQRSTUVWXYZ?` Represented in ASCII art.

- Output
  The text `T` in ASCII art.
  The characters `a` to `z` are shown in ASCII art by their equivalent in upper case.
  The characters that are not in the intervals [`a-z`] or [`A-Z`] will be shown as a question mark in ASCII art.

- Constraints

```plaintext
0 < L < 30
0 < H < 30
0 < N < 200
```

### Starter Code

Here is the starter code that is provided. I replaced the final output with the correct answer for the first test case.

```c
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>

int main()
{
    int L;
    scanf("%d", &L);
    int H;
    scanf("%d", &H); fgetc(stdin);
    char T[257] = "";
    scanf("%[^\n]", T); fgetc(stdin);
    for (int i = 0; i < H; i++) {
        char ROW[1025] = "";
        scanf("%[^\n]", ROW); fgetc(stdin);
    }

    // Write an answer using printf(). DON'T FORGET THE TRAILING \n
    // To debug: fprintf(stderr, "Debug messages...\n");

    printf("### \n#   \n##  \n#   \n### \n");

    return 0;
}
```

- Output

```plaintext
###
#
##
#
###
```

It should be noted that the ASCII representation can be anything. One of the test cases uses the style of a children's letter block. I edited out the other letters for brevity.

```plaintext
20
11
MANHATTAN
 .----------------.
| .--------------. |
| |      __      | |
| |     /  \     | |
| |    / /\ \    | |
| |   / ____ \   | |
| | _/ /    \ \_ | |
| ||____|  |____|| |
| |              | |
| '--------------' |
 '----------------'
```

### Initial Thoughts

Oh... where to even begin with this one. I suppose one of the central questions is, how do we store the ASCII representations of the letters? Once they are stored with a nice index, retrieving them should be fairly trivial.

I find it curious that the initial `scanf` does not have an accompanying `fgetc` to consume the `newline`. `H`, `T`, and `ROW` all consume the extra character after reading from `stdin`. Looking into this, `%d` consumes leading whitespace, but `%[^\n]` does not. Therefore, no `fgetc` is necessary in the first instance of `scanf`.

Our two starter numbers determine the width (`L`) and height (`H`) of the ASCII art. `T` holds the word we need to recreate in ASCII art. `ROW` takes in the entire ASCII art, line by line. All characters represented are included in each line.

I think the most natural representation is a 2D array. We can easily store the groups, as they are provided in a 2D format. It is possible a struct could make it easier to index to specific letters.

Using a struct isn't really necessary though. An array is just bytes, and as long as the offsets are properly calculated, we can pull what we need.

### Single Letters

First order of business is to get the storage of the ASCII letters into an array, and then get the proper offsets calculated so they can be recalled. One benefit of ASCII, and by extension C, is that ASCII characters have integer representations and can be used to perform calculations to determine which character you have. By using this fact, and a bit of math, I can get the proper offsets.

First, store the representations in a big array. The array needs to be big enough to hold all the characters from the letter representations. There are 26 letters in the alphabet, plus 1 for the question mark. We are given the width and height of each art character. Multiple all this together to get the size of array we need. When reading in the rows of data from `stdin`, each row will be the width of the character art, times 27. That gives us a row length. This will help us produce a proper offset for storing all the art.

```c
char *arr = malloc(L * H * 27 * sizeof(char));
<snip>
int row_len = L * 27;
for (int j = 0; j < row_len; ++j)
{
    arr[(i * row_len) + j] = ROW[j];
}
```

Second, we need to reproduce that art based on a character. This actually took some troubleshooting and debugging to get exactly right. I wrote out all the code by hand to get the letter `A` to render correctly, then started doing ASCII calculations to get offsets by character.

Here is the manual printing that helped me identify the math required.

```c
char ch = 'A';
int n = ch - 'A';
fprintf(stderr, "%i\n", n);

fprintf(stderr, "%c%c%c%c\n", arr[((n * L) + 0) + (4 * 27 * 0)], arr[((n * L) + 1) + (4 * 27 * 0)], arr[((n * L) + 2) + (4 * 27 * 0)], arr[((n * L) + 3) + (4 * 27 * 0)]);
fprintf(stderr, "%c%c%c%c\n", arr[((n * L) + 0) + (4 * 27 * 1)], arr[((n * L) + 1) + (4 * 27 * 1)], arr[((n * L) + 2) + (4 * 27 * 1)], arr[((n * L) + 3) + (4 * 27 * 1)]);
fprintf(stderr, "%c%c%c%c\n", arr[((n * L) + 0) + (4 * 27 * 2)], arr[((n * L) + 1) + (4 * 27 * 2)], arr[((n * L) + 2) + (4 * 27 * 2)], arr[((n * L) + 3) + (4 * 27 * 2)]);
fprintf(stderr, "%c%c%c%c\n", arr[((n * L) + 0) + (4 * 27 * 3)], arr[((n * L) + 1) + (4 * 27 * 3)], arr[((n * L) + 2) + (4 * 27 * 3)], arr[((n * L) + 3) + (4 * 27 * 3)]);
fprintf(stderr, "%c%c%c%c\n", arr[((n * L) + 0) + (4 * 27 * 4)], arr[((n * L) + 1) + (4 * 27 * 4)], arr[((n * L) + 2) + (4 * 27 * 4)], arr[((n * L) + 3) + (4 * 27 * 4)]);
```

It is messy, but it worked. Aren't we glad that we have loops? Which is what I did next.

```c
for (int i = 0; i < H; ++i)
{
    for (int j = 0; j < L; ++j)
    {
        fprintf(stderr, "%c", arr[((n * L) + j) + (L * 27 * i)]);
    }
    fprintf(stderr, "\n");
}
```

I can now switch out `ch` for any upper case letter, and get it printed back out in ASCII art format. Next will be the handling lower case letters, and finally, the question mark for unknown letters. Tomorrow!
