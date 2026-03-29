+++
date = '2026-03-29T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 068'
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
| CodinGame               | C             | Ongoing         | None       | Completed: 4. WIP: Shadows of the Knight                             |

## CodinGame - Shadows of the Knight (Episode 1)

Today's work on _Shadows of the Knight_ should wrap things up. The algorithms for searching in each direction (`U, UR, R, DR, D, DL, L, UL`) is the next step.

### Up

Starting from a our first list item, `UP`. When we need to search in the up direction, we must be already be in the correct column, and need to search the row space. Therefore, only our `Y` position needs to be analyzed. We can use our `midpoint` formula developed yesterday to split the search space in half. We also need to a mechanism to shrink the search space.

Shrinking the search space is the critical functionality. So, when do we shrink it and based on what parameters?

If we have received the search direction of `UP`, then that must mean 2 things:

1. We can eliminate all other columns.
1. We can eliminate rows at and below our current position.

The 4 cardinal directions result in significantly reduce the search space. We need a place to store our new search space. The current grid width and height are stored in `W` and `H`, which could be reassigned. But, our new width would be `1`, which is not the column we are currently searching. So, a variable to store the column and row will be necessary. It may also be necessary to store a lower bound and upper bound.

Let's say we have a `10x10` grid, we are at `[9,7]`, and we were given the direction of `UP`:

- `X` lower bound: `9`
- `X` upper bound: `9`
- `Y` lower bound: `0`
- `Y` upper bound: `6`

We isolate our `X` coordinate, and eliminate all `Y` coordinates that are at or greater than our current position.

Before jumping into the game loop, I'll set the bounding based on the width and height of the total grid.

```c
// Search Space Bounds
int x_lower = 0;
int x_upper = W - 1;
int y_lower = 0;
int y_upper = H - 1;
```

In the `case` statement for `UP`, I'll first set the new search bounds. If we received `UP` as the direction, we must not be at the top edge of the grid, so we do not need to check the bounds that would ensure `y_upper` does not go negative. We determine our new jumppoint with the `midpoint` function, and print our new coordinates.

```c
case 0: // U
{
    x_lower = X0;
    x_upper = X0;
    y_upper = Y0 - 1;

    Y0 = midpoint(y_lower, y_upper);
    fprintf(stderr, "X0: %d, Y0: %d", X0, Y0);
    break;
}
```

I'm noticing a potential logic error here, but I'm not sure yet. I haven't taken into consideration the bounds from a previous iteration. This may only be relevant on ordinal directions. Let's work on the one of those, which is our next item on the list, `UR`.

### Up-Right

`UR` is where we define a bounding rectangle for the first space, and do a diagonal move. We will make use of both `midpoint` and `midpoint_ceil` functions to determine the new coordinate.

We only need to change the 2 bounds that shrink the search space in the direction of our move. This means that the other two bounds don't change, and we will maintain a smaller and smaller search space per iteration. I don't see anymore issues with this method. The debug print statement was moved outside the `switch` operation.

```c
case 1: // UR
{
    x_lower = X0 + 1;
    y_upper = Y0 - 1;

    X0 = midpoint_ceil(x_lower, x_upper);
    Y0 = midpoint(y_lower, y_upper);
    break;
}
```

With the template in place for both a cardinal and ordinal direction, the others should be mostly copy and paste.

### All Other Directions

I implemented all other directions, but ran into a bug with my `midpoint_ceil` function. Since I was not checking for the bounds of the grid, we could run into a situation where the ceiling function added `1`, and pushed us over the edge of the grid.

To avoid the issue, I removed the `midpoint_ceil` function, and it turned out to not be necessary anyways. I passed all test cases without it.

### Final Code

```c
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>

/**
 * Calculates the midpoint between two numbers
 */
int midpoint(int num1, int num2)
{
    return (num1 + num2) / 2;
}

int main()
{
    int W, H, N, X0, Y0;
    scanf("%d%d%d%d%d", &W, &H, &N, &X0, &Y0);
    fprintf(stderr, "W: %d\nH: %d\nN: %d\nX0: %d\nY0: %d\n", W, H, N, X0, Y0);

    // Search Space Bounds
    int x_lower = 0;
    int x_upper = W - 1;
    int y_lower = 0;
    int y_upper = H - 1;

    while (1)
    {
        // The direction of the bombs from batman's current location
        // (U, UR, R, DR, D, DL, L or UL)
        char bomb_dir[4] = "";
        scanf("%s", bomb_dir);
        fprintf(stderr, "S: %s\n", bomb_dir);
        int bomb_dir_enum = -1;
        if      (strcmp("U",  bomb_dir) == 0) bomb_dir_enum = 0;
        else if (strcmp("UR", bomb_dir) == 0) bomb_dir_enum = 1;
        else if (strcmp("R",  bomb_dir) == 0) bomb_dir_enum = 2;
        else if (strcmp("DR", bomb_dir) == 0) bomb_dir_enum = 3;
        else if (strcmp("D",  bomb_dir) == 0) bomb_dir_enum = 4;
        else if (strcmp("DL", bomb_dir) == 0) bomb_dir_enum = 5;
        else if (strcmp("L",  bomb_dir) == 0) bomb_dir_enum = 6;
        else if (strcmp("UL", bomb_dir) == 0) bomb_dir_enum = 7;
        else
        {
            fprintf(stderr, "Unknown direction");
            return 1;
        }
        fprintf(stderr, "E: %d\n", bomb_dir_enum);


        switch(bomb_dir_enum)
        {
            case 0: // U
            {
                x_lower = X0;
                x_upper = X0;
                y_upper = Y0 - 1;

                Y0 = midpoint(y_lower, y_upper);
                break;
            }
            case 1: // UR
            {
                x_lower = X0 + 1;
                y_upper = Y0 - 1;

                X0 = midpoint(x_lower, x_upper);
                Y0 = midpoint(y_lower, y_upper);
                break;
            }
            case 2: // R
            {
                x_lower = X0 + 1;
                y_lower = Y0;
                y_upper = Y0;

                X0 = midpoint(x_lower, x_upper);
                break;
            }
            case 3: // DR
            {
                x_lower = X0 + 1;
                y_lower = Y0 + 1;

                X0 = midpoint(x_lower, x_upper);
                Y0 = midpoint(y_lower, y_upper);
                break;
            }
            case 4: // D
            {
                x_lower = X0;
                x_upper = X0;
                y_lower = Y0 + 1;

                Y0 = midpoint(y_lower, y_upper);
                break;
            }
            case 5: // DL
            {
                x_upper = X0 - 1;
                y_lower = Y0 + 1;

                X0 = midpoint(x_lower, x_upper);
                Y0 = midpoint(y_lower, y_upper);
                break;
            }
            case 6: // L
            {
                x_upper = X0 - 1;
                y_lower = Y0;
                y_upper = Y0;

                X0 = midpoint(x_lower, x_upper);
                break;
            }
            case 7: // UL
            {
                x_upper = X0 - 1;
                y_upper = Y0 - 1;

                X0 = midpoint(x_lower, x_upper);
                Y0 = midpoint(y_lower, y_upper);
                break;
            }
            default:
            {
                break;
            }
        }
        fprintf(stderr, "X0: %d, Y0: %d", X0, Y0);
        printf("%d %d\n", X0, Y0);
    }

    return 0;
}
```

### Conclusion

This was another lesson in premature optimization. Before I had the regular `midpoint` function correctly working, I tried to add a ceiling calculation, but didn't think through all of the implications. I had added a premature optimization that turned out to not even be necessary.
