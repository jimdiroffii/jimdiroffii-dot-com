+++
date = '2026-03-23T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 062'
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

## CodinGame - ASCII Art - Part 2

Continuing from [yesterday's effort](/posts/2026/03/365-days-of-code-day-061-2026/#codingame---ascii-art). I have uppercase letters handled, and now need to handle lowercase and non-alpha characters.

Again, I should be able to turn to some ASCII math to help handle this.

### Handling Lowercase and Non-Alpha

The lowercase letters in ASCII produce the same offsets as uppercase, just at a different integer. Just as we used `A` to do the subtraction, `a` can be used for the subtraction of lowercase letters. Anything that doesn't fit between `A-Z` or `a-z` is an unknown character, and gets the question mark.

```c
char ch = '1';
int n;
if (ch >= 'A' && ch <= 'Z')
{
    n = ch - 'A';
}
else if (ch >= 'a' && ch <= 'z')
{
    n = ch - 'a';
}
else
{
    n = 26;
}
```

I hardcoded the `ch` variable to test each of the letters.

### Handling Multi-Letter Input

Single characters are handled. Let's work on a string. We just need to grab each character in the string, and loop over everything.

```c
char ch;
char *str = "abc";
int str_len = strlen(str);
int n = 0;
for (int i = 0; i < str_len; ++i)
{
    ch = str[i];
    if (ch >= 'A' && ch <= 'Z')
    {
        n = ch - 'A';
    }
    else if (ch >= 'a' && ch <= 'z')
    {
        n = ch - 'a';
    }
    else
    {
        n = 26;
    }

    for (int j = 0; j < H; ++j)
    {
        for (int k = 0; k < L; ++k)
        {
            fprintf(stderr, "%c", arr[((n * L) + k) + (L * 27 * j)]);
        }
        fprintf(stderr, "\n");
    }
}
```

- Output:

```plaintext
 #
# #
###
# #
# #
##
# #
##
# #
##
 ##
#
#
#
 ##
```

Oops, we are populating a `newline` after each character. This is not to straightforward to fix. We may need to write each line, of each character, before the `newline`. In order to do that, we need to read a character, print the top row, read the next character, continue printing the top row, and so on, for all characters. Then create a `newline`, and repeat, but for the second row. Similar to how a dot matrix printer works.

And... this ended up being easier than expected to fix. Once I started to analyze the problem, I realized I just needed to pull the height loop and turn it into the outer loop. I didn't even have to change any of the variable names.

```c
for (int j = 0; j < H; ++j)
{
    for (int i = 0; i < str_len; ++i)
    {
        ch = str[i];
        if (ch >= 'A' && ch <= 'Z')
        {
            n = ch - 'A';
        }
        else if (ch >= 'a' && ch <= 'z')
        {
            n = ch - 'a';
        }
        else
        {
            n = 26;
        }

        for (int k = 0; k < L; ++k)
        {
            fprintf(stderr, "%c", arr[((n * L) + k) + (L * 27 * j)]);
        }
    }
    fprintf(stderr, "\n");
}
```

Output with `abcABC123`:

```plaintext
 #  ##   ##  #  ##   ## ### ### ###
# # # # #   # # # # #     #   #   #
### ##  #   ### ##  #    ##  ##  ##
# # # # #   # # # # #
# # ##   ## # # ##   ##  #   #   #
```

Perfect. Now let's try to read in the real string... and we passed with 100%.

### Final Code

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

    char *arr = malloc(L * H * 27 * sizeof(char));

    char T[257] = "";
    scanf("%[^\n]", T); fgetc(stdin);
    for (int i = 0; i < H; i++) {
        char ROW[1025] = "";
        scanf("%[^\n]", ROW); fgetc(stdin);
        // fprintf(stderr, "%s", ROW);
        int row_len = L * 27;
        for (int j = 0; j < row_len; ++j)
        {
            arr[(i * row_len) + j] = ROW[j];
        }
        // for (int j = 0; j < row_len; ++j)
        // {
        //     fprintf(stderr, "%c", arr[(i * row_len) + j]);
        // }
        // fprintf(stderr, "\n");
    }

    char ch;
    // char *str = "abcABC123";
    int str_len = strlen(T);
    int n = 0;
    for (int j = 0; j < H; ++j)
    {
        for (int i = 0; i < str_len; ++i)
        {
            ch = T[i];
            if (ch >= 'A' && ch <= 'Z')
            {
                n = ch - 'A';
            }
            else if (ch >= 'a' && ch <= 'z')
            {
                n = ch - 'a';
            }
            else
            {
                n = 26;
            }

            for (int k = 0; k < L; ++k)
            {
                // fprintf(stderr, "%c", arr[((n * L) + k) + (L * 27 * j)]);
                printf("%c", arr[((n * L) + k) + (L * 27 * j)]);
            }
        }
        // fprintf(stderr, "\n");
        printf("\n");
    }
    // fprintf(stderr, "%i\n", n);

    // fprintf(stderr, "%c%c%c%c\n", arr[((n * L) + 0) + (4 * 27 * 0)], arr[((n * L) + 1) + (4 * 27 * 0)], arr[((n * L) + 2) + (4 * 27 * 0)], arr[((n * L) + 3) + (4 * 27 * 0)]);
    // fprintf(stderr, "%c%c%c%c\n", arr[((n * L) + 0) + (4 * 27 * 1)], arr[((n * L) + 1) + (4 * 27 * 1)], arr[((n * L) + 2) + (4 * 27 * 1)], arr[((n * L) + 3) + (4 * 27 * 1)]);
    // fprintf(stderr, "%c%c%c%c\n", arr[((n * L) + 0) + (4 * 27 * 2)], arr[((n * L) + 1) + (4 * 27 * 2)], arr[((n * L) + 2) + (4 * 27 * 2)], arr[((n * L) + 3) + (4 * 27 * 2)]);
    // fprintf(stderr, "%c%c%c%c\n", arr[((n * L) + 0) + (4 * 27 * 3)], arr[((n * L) + 1) + (4 * 27 * 3)], arr[((n * L) + 2) + (4 * 27 * 3)], arr[((n * L) + 3) + (4 * 27 * 3)]);
    // fprintf(stderr, "%c%c%c%c\n", arr[((n * L) + 0) + (4 * 27 * 4)], arr[((n * L) + 1) + (4 * 27 * 4)], arr[((n * L) + 2) + (4 * 27 * 4)], arr[((n * L) + 3) + (4 * 27 * 4)]);

    // Write an answer using printf(). DON'T FORGET THE TRAILING \n
    // To debug: fprintf(stderr, "Debug messages...\n");

    // fprintf(stderr, "L: %i, H: %i\n", L, H);
    free(arr);
    return 0;
}
```

### Top Rated C Solution

I had a look at the top rated C solution for this problem... and [this guy fucks](https://youtu.be/_uMEE7eaaUA?si=In_Y-yhwUryEEPH9).

- Courtesy of _Alain-Delpuch_

```c
#include <stdio.h>
#include <ctype.h>

main() {
    int L,H;
    scanf("%d%d ", &L, &H);

    char ROW[28][L];

    char T[257];
    gets(T);

    while (H--) {
        gets(ROW);
        for (char *p=T;*p;p++) { // for all letters to display
            unsigned int c = toupper(*p) - 'A';
            if ( c > 26 ) c = 26;
            printf("%.*s", L, ROW+c);
        }
        printf("\n"); ;
    }
}
```

Such elegance.
