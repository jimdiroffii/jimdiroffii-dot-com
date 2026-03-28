+++
date = '2026-03-27T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 066'
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

## CodinGame - There Is No Spoon (Episode 1) - Continued

Yesterday's code only solved the most basic test case. It is time to generalize the solution to pass all test cases. The primary issue is that my solution only checks the grid for nodes that are immediately to the right and down from the visited node. If there are any non-node grid-points in-between nodes, those points need to be skipped. I feel like I'm explaining it badly. Essentially, we need to keep checking the row and column until either we reach a node, or the edge of the grid.

### Analysis

To check until we hit a node, a `while` loop is probably the right option. The hard part is determining the right order of operations. Let's think this through. We already stored the grid, so I'll start from a pseudocode analysis:

```plaintext
Is current grid point a node?
If yes:
  Print coordinates of current grid point
  Is X + 1 an edge?
  If yes:
    Print `-1 -1`
    Check Y coordinates
  If no:
    Is current grid point a node?
    If yes:
      Print coordinates of current grid point
      Check Y coordinates
    If no:
      Increase X (go back to 4)
  Is Y + 1 an edge?
  If yes:
    Print `-1 -1`
    Is X + 1 an edge?
    If yes:
      Is Y + 1 an edge?
        If yes:
          Done, Print `newline` and Exit
        If no:
          Set X to 0
          Increase Y, start over
    If no:
      Increase X by 1, start over
  If no:
    Is current grid point a node?
      If yes:
        Print coordinates of current grid point
        Print `newline`
        Is X + 1 an edge?
        If yes:
          Is Y + 1 an edge?
            If yes:
              Done, start over
            If no:
              Set X to 0
              Increase Y by 1
              Start over
        If no:
          Increase X by 1
          Start over
If no:
  Is X + 1 an edge?
  If yes:
    Is Y + 1 an edge?
    If yes:
      Done, Print `newline` and Exit
    If no:
      Set X to 0
      Increase Y by 1, start over
  If no:
    Start over
```

I think this covers all scenarios. It is possible I missed a step or two, but the core ideas are all there, I think. One of the primary points I see from this analysis is a lot of repeated work. Much of the repeats happen while deeply nested in a decision tree. I think that is what makes this problem _"difficult"_ to deal with. I thought I saw a potential opportunity for memoization. Since we are detecting non-nodes and nodes, it would be advantageous to keep track of those coordinates so we aren't constantly checking and rechecking grid points if they are nodes or not. There is generally a penalty for being inefficient in a coding challenge. However, the game states that we must execute each successive output within 100 ms, which is fairly generous. Over-optimization is not the game here.

### Scaffolding

I'm going to restart with a double nested loop. An alternative might be to declare `i` and `j` within a single `for` loop. This might not be such a bad idea, as then I don't have to worry about trying to break from both loops on particular conditions. I also get complete control over when the iterators get incremented, which could be important since I often have to reset our place for the `X` coordinate. I just have to carefully manage the variables.

I decided to write the `false` logic first, and just write things out as-is. No consideration for repeated code.

```c
for (int i = 0, j = 0; i < width && j < height;)
{
    if (grid[i][j].isNode == false)
    {
        fprintf(stderr, "not-node\n");
        if (i + 1 >= width)
        {
            if (j + 1 >= height)
            {
                printf("final-1\n");
                break;
            }
            else
            {
                i = 0;
                ++j;
                continue;
            }
        }
        else
        {
            ++i;
            continue;
        }
    }
    else
    {
        fprintf(stderr, "node\n");
        if (i + 1 >= width)
        {
            if (j + 1 >= height)
            {
                printf("final-2\n");
                break;
            }
            else
            {
                i = 0;
                ++j;
                continue;
            }
        }
        else
        {
            ++i;
            continue;
        }
    }
}
```

This debugging process made me realize I had a logic mistake in my previous for loops where I was setting fields to `false` and printing the output of the grid. `height` is supposed to be the outer loop, and `width` in the inner loop. I had to switch around my variables and index accesses for the array. Since the node detection loop is a single loop, I didn't have an issue there, only with my nested loops. Here is what my reversed input/output loop ended up like.

```c
node grid[width][height];

for (int i = 0; i < height; ++i)
{
    for (int j = 0; j < width; ++j)
    {
        grid[j][i].isNode = false;
        grid[j][i].isVisited = false;
        fprintf(stderr, "[X: %d, Y: %d [%d]", j, i, grid[j][i].isNode);
        fprintf(stderr, "[%d]] ", grid[j][i].isVisited);
    }
    fprintf(stderr, "\n");
}

for (int i = 0; i < height; i++) {
    // width characters, each either 0 or .
    char line[32] = "";
    scanf("%[^\n]", line); fgetc(stdin);
    fprintf(stderr, "LINE: %s\n", line);
    for (int j = 0; j < width; ++j)
    {
        if (line[j] == '0')
        {
            grid[j][i].isNode = true;
        }
    }
}

for (int i = 0; i < height; ++i)
{
    for (int j = 0; j < width; ++j)
    {
        fprintf(stderr, "[X: %d, Y: %d [%d]", j, i, grid[j][i].isNode);
        fprintf(stderr, "[%d]] ", grid[j][i].isVisited);
    }
    fprintf(stderr, "\n");
}
```

These properly input and output the expected grid.

```plaintext
[X: 0, Y: 0 [0][0]] [X: 1, Y: 0 [0][0]] [X: 2, Y: 0 [0][0]]
[X: 0, Y: 1 [0][0]] [X: 1, Y: 1 [0][0]] [X: 2, Y: 1 [0][0]]
[X: 0, Y: 2 [0][0]] [X: 1, Y: 2 [0][0]] [X: 2, Y: 2 [0][0]]
LINE: 000
LINE: .0.
LINE: .0.
[X: 0, Y: 0 [1][0]] [X: 1, Y: 0 [1][0]] [X: 2, Y: 0 [1][0]]
[X: 0, Y: 1 [0][0]] [X: 1, Y: 1 [1][0]] [X: 2, Y: 1 [0][0]]
[X: 0, Y: 2 [0][0]] [X: 1, Y: 2 [1][0]] [X: 2, Y: 2 [0][0]]
```

I'm also realizing that I haven't figured out how to take advantage of the `isVisited` variable. It might not be necessary at the end, given my current approach.

The output code is correct identifying `node` and `not-node`.

```c
for (int i = 0, j = 0; i < width && j < height;)
{
    if (grid[i][j].isNode == false)
    {
        fprintf(stderr, "not-node\n");
        if (i + 1 >= width)
        {
            if (j + 1 >= height)
            {
                printf("final-1\n");
                break;
            }
            else
            {
                i = 0;
                ++j;
                continue;
            }
        }
        else
        {
            ++i;
            continue;
        }
    }
    else
    {
        fprintf(stderr, "node\n");
        if (i + 1 >= width)
        {
            if (j + 1 >= height)
            {
                printf("final-2\n");
                break;
            }
            else
            {
                i = 0;
                ++j;
                continue;
            }
        }
        else
        {
            ++i;
            continue;
        }
    }
}
```

```plaintext
node
node
node
not-node
node
not-node
not-node
node
not-node
```

The `break` and `continue` in the `if` statement prevent the need for the `else`, but I keep it in for organization purposes while I'm testing.

### Neighbor Logic

I know for certain that we can correctly detect `node` in the grid when doing a linear search. Now, to also include the neighbor logic. I removed the unnecessary `else` statement to remove one layer of nesting before beginning to work on the neighbors.

> **Note**: I'm starting to see a recursive relationship. When I find a node, if I go searching for a neighbor node, I could just start the search over again. I continue this chain until I can't find a node, or have no neighbors. I output what is needed, then return. The recursive method may also benefit from the `isVisited` variable, so I don't repeatedly check nodes that I have already checked.

After a bunch of "`printf` debugging in the console, I was able to get a working solution. Here is the final code before cleanup:

```c
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>

/**
 * Don't let the machines win. You are humanity's last hope...
 **/
typedef struct {
    bool isNode;
    bool isVisited;
} node;

int main()
{
    // the number of cells on the X axis
    int width;
    scanf("%d", &width);
    // the number of cells on the Y axis
    int height;
    scanf("%d", &height); fgetc(stdin);
    fprintf(stderr, "W: %d, H: %d\n", width, height);

    node grid[width][height];

    for (int i = 0; i < height; ++i)
    {
        for (int j = 0; j < width; ++j)
        {
            grid[j][i].isNode = false;
            grid[j][i].isVisited = false;
            fprintf(stderr, "[X: %d, Y: %d [%d]", j, i, grid[j][i].isNode);
            fprintf(stderr, "[%d]] ", grid[j][i].isVisited);
        }
        fprintf(stderr, "\n");
    }

    for (int i = 0; i < height; i++) {
        // width characters, each either 0 or .
        char line[32] = "";
        scanf("%[^\n]", line); fgetc(stdin);
        fprintf(stderr, "LINE: %s\n", line);
        for (int j = 0; j < width; ++j)
        {
            if (line[j] == '0')
            {
                grid[j][i].isNode = true;
            }
        }
    }

    for (int i = 0; i < height; ++i)
    {
        for (int j = 0; j < width; ++j)
        {
            fprintf(stderr, "[X: %d, Y: %d [%d]", j, i, grid[j][i].isNode);
            fprintf(stderr, "[%d]] ", grid[j][i].isVisited);
        }
        fprintf(stderr, "\n");
    }

    char output[6];

    for (int i = 0, j = 0; i < width && j < height;)
    {
        fprintf(stderr, "\nChecking: %d %d ", i, j);
        if (grid[i][j].isNode == false)
        {
            fprintf(stderr, "not-node\n");
            if (i + 1 >= width)
            {
                if (j + 1 >= height)
                {
                    printf("final-1\n");
                    break;
                }
                else
                {
                    i = 0;
                    ++j;
                    continue;
                }
            }
            else
            {
                ++i;
                continue;
            }
        }

        fprintf(stderr, "node\n");
        fprintf(stderr, "%d %d ", i, j);
        printf("%d %d ", i, j);
        int tmp = i + 1;
        while (tmp < width)
        {
            if (grid[tmp][j].isNode == false)
            {
                ++tmp;
                continue;
            }
            fprintf(stderr, "%d %d ", tmp, j);
            printf("%d %d ", tmp, j);
            break;
        }
        // fprintf(stderr, "tmp: %d, width: %d\n", tmp, width);
        if (tmp >= width)
        {
            fprintf(stderr, "-1 -1 ");
            printf("-1 -1 ");
        }

        tmp = j + 1;
        fprintf(stderr, "\n(1): tmp: %d, height: %d\n", tmp, height);
        while (tmp < height)
        {
            if (grid[i][tmp].isNode == false)
            {
                ++tmp;
                continue;
            }
            fprintf(stderr, "i: %d, tmp: %d\n", i, tmp);
            printf("%d %d\n", i, tmp);
            break;
        }
        fprintf(stderr, "\n(2): tmp: %d, height: %d\n", tmp, height);

        if (tmp >= height)
        {
            fprintf(stderr, "-1 -1\n");
            printf("-1 -1\n");
        }

        // Next Node
        if (i + 1 >= width)
        {
            if (j + 1 >= height)
            {
                printf("final-2\n");
                break;
            }
            else
            {
                i = 0;
                ++j;
                continue;
            }
        }
        else
        {
            ++i;
            continue;
        }
    }

    return 0;
}
```

### Final Code

I cleaned up all the debug statements, shortened the single line `if` statements, and cleaned up some logic. Here was the final submitted code.

```c
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>

typedef struct {
    bool isNode;
} node;

int main()
{
    int width;
    scanf("%d", &width);
    int height;
    scanf("%d", &height); fgetc(stdin);

    node grid[width][height];

    for (int i = 0; i < height; ++i)
    {
        for (int j = 0; j < width; ++j)
        {
            grid[j][i].isNode = false;
        }
    }

    for (int i = 0; i < height; i++) {
        char line[32] = "";
        scanf("%[^\n]", line); fgetc(stdin);
        for (int j = 0; j < width; ++j)
        {
            if (line[j] == '0') grid[j][i].isNode = true;
        }
    }

    for (int i = 0, j = 0; i < width && j < height;)
    {
        if (grid[i][j].isNode == false)
        {
            if (i + 1 >= width)
            {
                if (j + 1 >= height) break;

                i = 0;
                ++j;
                continue;
            }
            else
            {
                ++i;
                continue;
            }
        }

        printf("%d %d ", i, j);
        int tmp = i + 1;
        while (tmp < width)
        {
            if (grid[tmp][j].isNode == false)
            {
                ++tmp;
                continue;
            }
            printf("%d %d ", tmp, j);
            break;
        }
        if (tmp >= width) printf("-1 -1 ");

        tmp = j + 1;
        while (tmp < height)
        {
            if (grid[i][tmp].isNode == false)
            {
                ++tmp;
                continue;
            }

            printf("%d %d\n", i, tmp);
            break;
        }

        if (tmp >= height) printf("-1 -1\n");

        // Next Node
        if (i + 1 >= width)
        {
            if (j + 1 >= height) break;

            i = 0;
            ++j;
        }
        else
        {
            ++i;
        }
    }

    return 0;
}
```

### An Optimal Solution

I once again checked for the top rated solution. Once again, it is Alain-Delpuch for the win. Once again, the elegance and simplicity of the solution is great. I appreciate that Alain does away with the default code, gets the entire input at once, and begins to iterate.

```c
#include <stdlib.h>
#include <stdio.h>

int
main() {
    int width; // the number of cells on the X axis (<=30)
    int height; // the number of cells on the Y axis (<=30)

    scanf("%d%d ", &width, &height);

    int i,j,k;
    char A[30][30];

    for (i = 0; i < height; i++)
        gets(A[i]);

    for (i=0; i< height ; i++) {
        for (j= 0 ; j < width ; j++){
            if (A[i][j] == '0') {
                printf("%d %d ", j, i);

                // search right neighbor
                for (k = j+1 ; k < width  && A[i][k] != '0' ; k++) ;
                if (k==width) printf("-1 -1 ");
                else          printf("%d %d ", k, i);

                // search down neighbour
                for (k = i+1 ; k < height && A[k][j] != '0'; k++) ;
                if (k==height) printf("-1 -1\n");
                else           printf("%d %d\n", j, k);
            }
        }
    }
}
```
