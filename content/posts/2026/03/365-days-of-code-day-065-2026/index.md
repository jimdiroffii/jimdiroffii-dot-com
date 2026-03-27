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

## CodinGame - There Is No Spoon (Episode 1)

Another day, another CodinGame challenge. Today's challenge is _There Is No Spoon (Episode 1)_.

> The goal is to find, when they exist, the horizontal and vertical neighbors nodes from a two dimensional array. The difficulty is in the number of nested loops that this puzzle can make you write. Do not get lost! The goal is to find, when they exist, the horizontal and vertical neighbors of each node.
>
> To do this, you must find each (**x1**,**y1**) coordinates containing a node, and display the (**x2**,**y2**) coordinates of the next node to the right, and the (**x3**,**y3**) coordinates of the next node to the bottom within the grid.
>
> If a neighbor does not exist, you must output the coordinates `-1 -1` instead of (**x2**,**y2**) and/or (**x3**,**y3**).
>
> You lose if:
>
> - You give an incorrect neighbor for a node.
> - You give the neighbors for an empty cell.
> - You compute the same node twice.
> - You forget to compute the neighbors of a node.

This is one of CodinGame's interactive scenarios, where a "game" plays out based on your code, and there is a visual component that shows the game being played.

![A screenshot of the game screen](game_screen.png)

The game provides us with this initial code.

```c
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>

/**
 * Don't let the machines win. You are humanity's last hope...
 **/

int main()
{
    // the number of cells on the X axis
    int width;
    scanf("%d", &width);
    // the number of cells on the Y axis
    int height;
    scanf("%d", &height); fgetc(stdin);
    fprintf(stderr, "W: %d, H: %d\n", width, height);
    for (int i = 0; i < height; i++) {
        // width characters, each either 0 or .
        char line[32] = "";
        scanf("%[^\n]", line); fgetc(stdin);
    }

    // Write an action using printf(). DON'T FORGET THE TRAILING \n
    // To debug: fprintf(stderr, "Debug messages...\n");


    // Three coordinates: a node, its right neighbor, its bottom neighbor
    printf("0 0 1 0 0 1\n");

    return 0;
}
```

### Initial Thoughts

This is a pretty classic problem in computer science. Traversing all the nodes in a given grid. The game description indicates that nested loops are likely going to used. The game also tags `lists` as a paradigm that should be useful.

It seems like the algorithm could likely benefit from a DFS or BFS style approach. Search along a path until we stop, backtrack, then take another path, ensuring all paths are visited. We aren't looking for an efficient way through a maze though, we want to ensure every single node is touched.

Looking at the inputs provided through some debug messages, we are given the total width, total height and the possible nodes. Nodes are marked with a `0`, and empty space between nodes is marked with a `.`.

This is the output and node structure on the _complex_ test case:

```plaintext
W: 4, H: 4
LINE: 00.0
LINE: 0.00
LINE: .0.0
LINE: 000.
```

For the initial _example_ test case, I hard coded a solution to ensure I understand the winning conditions. This is a simple graph with 3 nodes, 2 on the top row, and 1 on the bottom row:

```c
printf("0 0 1 0 0 1\n");
printf("1 0 -1 -1 -1 -1\n");
printf("0 1 -1 -1 -1 -1\n");
```

I also sent this example in a different order to ensure that nodes could be displayed in any order. They can, so the only success criteria is to ensure every node is visited, along with its neighbors (or lack of neighbors).

So, how can we solve this problem in C? It might be a good idea to use a `struct` to model a node, so it is easier to record coordinates. How do we store the nodes and keep track of visited nodes? An associative array (hash table, map, etc.) might do the trick, but I'd have to implement that from scratch. Since it is just a 2D grid, a simple 2D array might be enough.

### Code

Using a `struct` and a 2D array worked for the first test case. The `node` is simple.

```c
typedef struct {
    bool isNode;
    bool isVisited;
} node;
```

And the array keeps track of positions:

```c
node grid[width][height];
```

I first go through and set all the positions to `false`. The lines with `fprintf` are debug output.

```c
for (int i = 0; i < width; ++i)
{
    for (int j = 0; j < height; ++j)
    {
        grid[i][j].isNode = false;
        grid[i][j].isVisited = false;
        fprintf(stderr, "[X: %d, Y: %d [%d]", i, j, grid[i][j].isNode);
        fprintf(stderr, "[%d]] ", grid[i][j].isVisited);
    }
    fprintf(stderr, "\n");
}
```

Then, as the grid is scanned from `stdin`, I mark which ones are nodes.

```c
for (int i = 0; i < height; i++) {
    // width characters, each either 0 or .
    char line[32] = "";
    scanf("%[^\n]", line); fgetc(stdin);
    fprintf(stderr, "LINE: %s\n", line);
    for (int j = 0; j < width; ++j)
    {
        if (line[j] == '0')
        {
            grid[i][j].isNode = true;
        }
    }
}
```

The node and neighbor checks use multiple loops and conditionals to verify neighbors and stay within bounds of the grid. A small `char` string is setup to output integers.

```c
char output[6];
for (int i = 0; i < width; ++i)
{
    for (int j = 0; j < height; ++j)
    {
        // fprintf(stderr, "[X: %d, Y: %d [%d]", i, j, grid[i][j].isNode);
        // fprintf(stderr, "[%d]] ", grid[i][j].isVisited);
        if (grid[i][j].isNode == true)
        {
            sprintf(output, "%d %d ", i, j);
            printf("%s", output);

            // Right Neighbor Check
            if (i + 1 < width)
            {
                if (grid[i + 1][j].isNode == true)
                {
                    sprintf(output, "%d %d ", i + 1, j);
                    printf("%s", output);
                }
                else
                {
                    printf("-1 -1 ");
                }
            }
            else
            {
                printf("-1 -1 ");
            }

            // Down Neighbor Check
            if (j + 1 < height)
            {
                if (grid[i][j + 1].isNode == true)
                {
                    sprintf(output, "%d %d", i, j + 1);
                    printf("%s", output);
                }
                else
                {
                    printf("-1 -1");
                }
            }
            else
            {
                printf("-1 -1 ");
            }
            printf("\n");
        }
    }
}
```

With the basic first test case (2x2 grid with 3 nodes), I get a successful output.

```plaintext
Standard Output Stream:
0 0 1 0 0 1
Standard Output Stream:
0 1 -1 -1 -1 -1
Standard Output Stream:
1 0 -1 -1 -1 -1
Game information:
All connections valid.
```

However, I overlooked the fact that we need to find any node that is to the right or down from our reporting node, even if there is a non-node grid point in-between. Therefore, this code does not pass the later tests.
