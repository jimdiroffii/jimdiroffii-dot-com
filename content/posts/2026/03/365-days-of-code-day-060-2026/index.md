+++
date = '2026-03-21T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 060'
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

## 60 Days of Code

It has been 60 days since I have started this challenge. Things have gone pretty well, and I've gotten a lot done by forcing myself to stick with coding _something_ everyday. Even if some of the changes are quite small, the point of the challenge has worked. Stay consistent. Learn new things. There is still a lot of do. At least 205 days worth of work to go.

In the spirit of learning new things, let's do something a bit more fun today. [CodinGame](https://www.codingame.com/).

## CodinGame

I first did CodinGame several years ago, and haven't touched it much sense. It is a great platform for exercising your coding skills. It isn't a learning platform as much as it is a place to find coding challenges to solve.

Today's exercise will be [GhostLegs](https://www.codingame.com/training/easy/ghost-legs).

### GhostLegs Description

From the challenge description:

> Ghost Legs is a kind of lottery game common in Asia. It starts with a number of vertical lines. Between the lines there are random horizontal connectors binding all lines into a connected diagram, like the one below.

```plaintext
A  B  C
|  |  |
|--|  |
|  |--|
|  |--|
|  |  |
1  2  3
```

> To play the game, a player chooses a line in the top and follow it downwards. When a horizontal connector is encountered, on either left or right, he must follow the connector to turn to another vertical line and continue downwards. Repeat this until reaching the bottom of the diagram.
>
> In the example diagram, when you start from A, you will end up in 2. Starting from B will end up in 1. Starting from C will end up in 3. It is guaranteed that every top label will map to a unique bottom label.
>
> Given a Ghost Legs diagram, find out which top label is connected to which bottom label. List all connected pairs.

### Starter Code and Success Criteria

Solving this challenge in C is kind of annoying. C doesn't provide any of the fancy constructs and string manipulation tools that would make this challenge much easier.

The first thing I like to do is run the provided code and see what the output is. Then I'll produce a few small modifications to check the input as well. This is the default starter code that is provided:

- starter code:

```c
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>

/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

int main()
{
    int W;
    int H;
    scanf("%d%d", &W, &H); fgetc(stdin);
    for (int i = 0; i < H; i++) {
        char line[1025] = "";
        scanf("%[^\n]", line); fgetc(stdin);
    }

    // Write an answer using printf(). DON'T FORGET THE TRAILING \n
    // To debug: fprintf(stderr, "Debug messages...\n");

    printf("answer\n");

    return 0;
}
```

- Output:

```plaintext
answer
```

Let's check the input that is provided. There are two instances of `scanf` and `fgetc`, with the second executing within a loop.

The first `scanf` reads in 2 integers (`W` and `H`), and the `fgetc` appears to eat the `newline`.

The looped `scanf` reads an entire line, without the `newline` character, and then `fgetc` subsequently eats the `newline`. Let's output the lines and see what we get in response.

- Added after `fgetc(stdin)` inside the `for` loop:

```c
printf("%s", line);
```

- Output:

```plaintext
A  B  C|  |  ||--|  ||  |--||  |--||  |  |1  2  3answer
```

Alright, that was the expected output; all input lines, with no `newline`.

Where to go from here... let's guess the correct answer.

- A and B swap
- A and C swap twice
- Final answer: `A2`, `B1`, `C3`

Let's check it. I'll comment out the added `printf` from before, and modify the final `printf` to output the correct answer.

```c
printf("A2\nB1\nC3\n");
```

- Output

```plaintext
A2
B1
C3
```

> Success

The understanding of the default code and success criteria is clear. Now, how do we implement the success dynamically?

### Implementation Ideas

We need a way to keep track of the inputs from the first line, in this case: `A`, `B`, and `C`. We can swap the positions of these characters to maintain the ordering. Then, match the final line, in this case: `1`, `2` and `3`, to the order of the characters.

An array would probably work here, and we can index to any position to perform swaps. Let's evaluate in pseudocode.

1. Record initial character positions into an array.
1. `arr[3] = {'A', 'B', 'C'}`
1. Read in line of input.
1. Perform swaps when `--` is encountered.
1. Swap: `arr[3] = {'B', 'A', 'C'}`
1. Match the last line to index positions.
1. Last line: `1 2 3`
1. Matched: `'B1', 'A2', 'C3'`

Per the challenge specs, the top and bottom labels can be any character in the range `0x21` (`!`) to `0x7E` (`~`) from the ASCII table. That doesn't really matter in C, since all characters are just `chars`, or 8-bit data chunks, but worth mentioning that not all label inputs will be alphanumeric.

What does matter is the size of our array. The application constrains the input from `3` to `100`, but I'd rather not just set an array size of `34`. Ideally, it should be dynamically sized.

The math expression \(W/3+1\) gives the number of characters to input. I can pass that to `malloc` to get a properly sized array.

```c
// dynamic array sizing
size_t arr_size = (W / 3) + 1;
char *arr = malloc(arr_size * sizeof(char));
if (arr == NULL)
{
    printf("Array allocation failed\n");
    return 1;
}

<snip>

free(arr);
return 0;
```

Let's load this array with our characters. We have to skip the whitespace around the characters, which could be done with `fgetc`, but `scanf` provides a nice way to automatically skip whitespace with `scanf(" %c", &ch)`. The leading space in front of `%c` does the heavy lifting. I chose to use `continue` as opposed to `else` to force the next loop iteration.

```c
for (int i = 0; i < H; i++) {
    char line[1025] = "";
    // first loop, store the characters
    if (i == 0)
    {
        for (int j = 0; j < arr_size; ++j)
        {
            scanf(" %c", &arr[j]);
        }
        // force next loop
        continue;
    }

    scanf("%[^\n]", line);
    fgetc(stdin);
}
```

With the array loaded, the next iteration will be to start performing swaps when the `-` character is encountered. There might be many different ways to do this. The default program will have already scanned the input into `line`. I can either change this, or iterate over the characters. We need to work left to right, and keep track of which column we are in.

I'm not sure we would run into this, but if there are swaps on the same line, I'm going to assume we do the left swap first, and then the right swap. We would end up with something like below:

```plaintext
A  B  C
|  |  |
|--|--|
|  |  |
B  C  A
```

Rereading the instructions, it does state that this should not happen.

> As a rule of the game, left and right horizontal connectors will never appear at the same point.

I don't think that it changes our logic though. We could code in a skip so that if we see a dash, we know there shouldn't be one in the next column set, but I don't think that it matters enough.

We can definitely perform some column skips though. We only need to detect a single `-` to know we need to perform a swap and we do not need to read the `|`. Using our math expression from before, we can determine the number of reads that we need to do, and just leave off the `+ 1`. So, we start reading at character `1`, determine swap, then add `3`, and read again. If we add `3` and we are beyond `W`, we move onto the next line.

```c
scanf("%[^\n]", line);
fgetc(stdin);

for (int j = 1; j < W; j += 3)
{
    if (line[j] == '-')
    {
        char tmp = arr[j / 3];
        arr[j / 3] = arr[(j / 3) + 1];
        arr[(j / 3) + 1] = tmp;
    }
}
```

This totally works, and I get the expected output. But, this creates a complication that I didn't realize at first. The output is expected to be in the order of the first (top) label. Since that order is not retained anywhere, I can't reorder the output. I can get the correct match to the bottom label, but the output needs to be in top label order, not bottom label order.

> List all connected pairs between top and bottom labels in the order of the top labels from Left to Right. Write each pair in a separate line.

There might be multiple ways to solve this problem as well. I think that one way to solve it would be to keep an index of the original ordering along with the actual labels. I could store them together, but then I can't use the `char` type. I could store them side by side, which doubles the size of the array, and adjust the swap mechanism to swap an element along with its index. I could also do this with a nested array, which I guess would be the same thing as keeping the index and character side by side, just access the values a bit differently. I think I might actually use "elements" that are 3 `char` values wide logically, and move them together. This will allow assignment of the bottom labels to the correct top labels, and then do a sort and print at the end.

Before screwing everything up to support the preferred ordering on the output, I finished the program with my original intentions. I get the correct output, just in the wrong order.

```c
else if (i == H)
{
    for (int j = 0; j < arr_size; ++j)
    {
        char ch;
        printf("%c", arr[j]);
        scanf(" %c", &ch);
        printf("%c\n", ch);
    }
    continue;
}
```

- Output:

```plaintext
B1
A2
C3
```

Here is a copy of the full program, with some debugging commented out, and before I fix the output.

```c
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>

/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

int main()
{
    int W;
    int H;
    scanf("%d%d", &W, &H);
    fgetc(stdin);

    // dynamic array sizing
    size_t arr_size = (W / 3) + 1;
    char *arr = malloc(arr_size * sizeof(char));
    if (arr == NULL)
    {
        printf("Array allocation failed\n");
        return 1;
    }

    for (int i = 0; i <= H; i++) {
        char line[1025] = "";
        // first loop, store the characters
        if (i == 0)
        {
            for (int j = 0; j < arr_size; ++j)
            {
                scanf(" %c", &arr[j]);
            }
            // force next loop
            continue;
        }
        else if (i == H)
        {
            for (int j = 0; j < arr_size; ++j)
            {
                char ch;
                printf("%c", arr[j]);
                scanf(" %c", &ch);
                printf("%c\n", ch);
            }
            continue;
        }

        scanf("%[^\n]", line);
        fgetc(stdin);

        for (int j = 1; j < W; j += 3)
        {
            if (line[j] == '-')
            {
                char tmp = arr[j / 3];
                arr[j / 3] = arr[(j / 3) + 1];
                arr[(j / 3) + 1] = tmp;
            }
        }
    }

    // for (int i = 0; i < arr_size; ++i) {
    //     printf("%c ", arr[i]);
    // }

    // Write an answer using printf(). DON'T FORGET THE TRAILING \n
    // To debug: fprintf(stderr, "Debug messages...\n");

    // printf("A2\nB1\nC3\n");
    printf("\n");
    free(arr);

    return 0;
}
```

### Finishing With Corrected Output

I figure if I triple the size of the array, I can group the index, top label, and bottom label altogether. Then perform a sort at the end to get the correct order before final output. If I do this in a struct, the logic doesn't at all. It is only necessary to place the `chars` into the correct place using struct operators.

```c
typedef struct {
    int index;
    char top;
    char bottom;
} Group;
```

The allocation now becomes:

```c
Group *arr = malloc(arr_size * sizeof(Group));
```

And then accessing and storing values uses `.` notation, such as:

```c
arr[j].index = j;
scanf(" %c", &arr[j].top);
```

To match the bottom labels, I store them along with the array characters, instead of printing them directly.

```c
char ch;
scanf(" %c", &ch);
arr[j].bottom = ch;
```

Finally, I need a sort. C comes with a quicksort implementation, and I just need to provide a custom comparison function.

```c
int compare_groups(const void *a, const void *b)
{
    Group *ga = (Group *)a;
    Group *gb = (Group *)b;
    return ga->index - gb->index;
}

<snip>

qsort(arr, arr_size, sizeof(Group), compare_groups);
```

This culminates in a final printout of the sorted array.

```c
for (int i = 0; i < arr_size; ++i) {
    printf("%c%c", arr[i].top, arr[i].bottom);
    printf("\n");
}
```

All test cases passed. Time to submit... 100% passed.

### Final Program

```c
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>

 typedef struct {
    int index;
    char top;
    char bottom;
 } Group;

int compare_groups(const void *a, const void *b)
{
    Group *ga = (Group *)a;
    Group *gb = (Group *)b;
    return ga->index - gb->index;
}

int main()
{
    int W;
    int H;
    scanf("%d%d", &W, &H);
    fgetc(stdin);

    // dynamic array sizing
    size_t arr_size = (W / 3) + 1;
    Group *arr = malloc(arr_size * sizeof(Group));
    if (arr == NULL)
    {
        printf("Array allocation failed\n");
        return 1;
    }

    for (int i = 0; i <= H; i++) {
        char line[1025] = "";
        // first loop, store the characters
        if (i == 0)
        {
            for (int j = 0; j < arr_size; ++j)
            {
                arr[j].index = j;
                scanf(" %c", &arr[j].top);
            }
            // force next loop
            continue;
        }
        else if (i == H)
        {
            for (int j = 0; j < arr_size; ++j)
            {
                char ch;
                scanf(" %c", &ch);
                arr[j].bottom = ch;
            }
            continue;
        }

        scanf("%[^\n]", line);
        fgetc(stdin);

        for (int j = 1; j < W; j += 3)
        {
            if (line[j] == '-')
            {
                Group tmp = arr[j / 3];
                arr[j / 3] = arr[(j / 3) + 1];
                arr[(j / 3) + 1] = tmp;
            }
        }
    }

    qsort(arr, arr_size, sizeof(Group), compare_groups);

    for (int i = 0; i < arr_size; ++i) {
        printf("%c%c", arr[i].top, arr[i].bottom);
        printf("\n");
    }

    free(arr);
    return 0;
}
```

## Conclusion

There are a couple inefficiencies in the final program that could be corrected. They were fine for the test cases, but this isn't "production-ready" code.

- There are a few style issues (braces on same-line or new-lines).
- `line` is declared even when it isn't used.
- The main loop structure could use refinement. Separating the two conditionals `i == 0` and `i == H` would be cleaner.
- Defensive programming and bounds checking could be more robust.
