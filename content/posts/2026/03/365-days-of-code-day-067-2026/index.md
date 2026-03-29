+++
date = '2026-03-28T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 067'
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

## CodinGame - Shadows of the Knight (Episode 1)

More CodinGame challenges. This time, it is solving a binary tree algorithm.

![A screenshot of the game screen](game.png)

> **The Goal**
>
> You will look for the hostages on a given building by jumping from one window to another using your grapnel gun. Your goal is to jump to the window where the hostages are located in order to disarm the bombs. Unfortunately, you have a limited number of jumps before the bombs go off...
>
> **Rules**
>
> Before each jump, the heat-signature device will provide you with the direction of the bombs based on your current position:
>
> - `U` (Up)
> - `UR` (Up-Right)
> - `R` (Right)
> - `DR` (Down-Right)
> - `D` (Down)
> - `DL` (Down-Left)
> - `L` (Left)
> - `UL` (Up-Left)
>
> Your mission is to program the device so that it indicates the location of the next window you should jump to in order to reach the bombs' room as soon as possible.
>
> Buildings are represented as a rectangular array of windows, the window in the top left corner of the building is at index (0,0).
>
> For some tests, the bombs' location may change from one execution to the other: the goal is to help you find the best algorithm in all cases.
>
> **Initialization input**
>
> - Line 1 : 2 integers `W` and `H`. The (`W`, `H`) couple represents the width and height of the building as a number of windows.
> - Line 2 : 1 integer `N`, which represents the number of jumps you can make before the bombs go off.
> - Line 3 : 2 integers `X0` and `Y0`, representing your starting position.
>
> **Input for one game turn**
>
> The direction indicating where the bomb is.
>
> **Output for one game turn**
> A single line with 2 integers `X Y` separated by a space character. (X, Y) represents the location of the next window you should jump to. `X` represents the index along the horizontal axis, `Y` represents the index along the vertical axis. (`0,0`) is located in the top-left corner of the building.
>
> **Constraints**
>
> - 1 ≤ W ≤ 10000
> - 1 ≤ H ≤ 10000
> - 2 ≤ N ≤ 100
> - 0 ≤ X, X0 < W
> - 0 ≤ Y, Y0 < H
> - Response time per turn ≤ 150ms
> - Response time per turn ≤ 150ms

### Initial Analysis

The first thing to do is to analyze the requirements, default code, and a successful output.

#### Requirements

The game initialization input provides `N` to show the number of jumps left, but I don't think it is relevant, since we must find the bomb before `N` anyways. We either find the bomb, or not, and knowing how many jumps are left aren't relevant to the algorithm.

I cleaned up the starter code a bit, and added some debug statements to check the inputs and outputs.

```c
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>

int main()
{
    int W, H, N, X0, Y0;
    scanf("%d%d%d%d%d", &W, &H, &N, &X0, &Y0);
    fprintf(stderr, "W: %d\nH: %d\nN: %d\nX0: %d\nY0: %d\n", W, H, N, X0, Y0);

    while (1) {
        // The direction of the bombs from batman's current location
        // (U, UR, R, DR, D, DL, L or UL)
        char bomb_dir[4] = "";
        scanf("%s", bomb_dir);
        fprintf(stderr, "S: %s\n", bomb_dir);

        // the location of the next window Batman should jump to.
        fprintf(stderr, "0 0\n");
        printf("0 0\n");
    }

    return 0;
}
```

- Output

```plaintext
W: 4
H: 8
N: 40
X0: 2
Y0: 3
S: DR
0 0
```

Alright, I have my bearings. The inputs are not complicated, and I just need to devise the correct algorithm to solve the problem. The primary piece of information is the variable `S`, which gives the direction of the bomb based on our current location.

### Thinking Through the Algorithm

We are working with a coordinate grid system in 2D space. We have a known starting point, and an arbitrary solution point. How do we find the solution point in the few steps possible? The first thought should be some type of binary search. A binary search, at least how I'm used to working with them, is calculated over a linear space. We can use a linear space search if our solution point is in the same row or column as our current location. However, most often, we have a 2D plane. While a 2D array in C is technically just a linear set of memory locations, I believe we can still think about this as a plane problem. Every time we search, we need to reduce the search space for the next potential iteration. That is the core idea behind binary search.

Therefore, the search space is a rectangle, not a line. We would need to identify the best coordinate to begin our next search, and that rectangle would begin at one column and one row offset from where we are, in the direction of the solution point. I see a diagonal line, drawn between the corners of the rectangle, starting at the corner closest to our current point, extending in the direction of the solution point, and ending at the other corner, which could be a grid edge. We would want to split that diagonal line in half, and start our next search from there. This is a good problem for the midpoint formula.

\[(x_m, y_m) = \frac{x_1 + x_2}{2}, \frac{y_1 + y_2}{2}\]

Let's work through a `10 x 10` example. I'm going to use `1-10` as grid points (rather than `0-9`):

- Starting Point: `[3, 1]`
- Solution Point: `[9, 2]`
- Direction: `DR`
- Search Space: `[4, 2]` to `[10, 10]`
- Midpoint: `...`

\[(x_m, y_m) = \frac{4 + 10}{2}, \frac{2 + 10}{2}\]
\[(x_m, y_m) = (7, 6)\]

- Midpoint: `[7, 6]`

From the midpoint, we search again. This time, the solution point will be `up-right`.

Now, here is a decision point for the algorithm. The most efficient solution would only search the remaining grid points, excluding points that have already been eliminated. Alternatively, we could set the upper-right point of our diagonal to the grid corner: `[10, 1]`. However, I actually don't think that will work. Since we are using a midpoint calculation, if we overshoot the solution point, and have to come back the opposite way, if the next diagonal is the other grid corner, we could end up in a situation where the midpoint continuously overshoots the solution point.

Therefore, the search space must be reduced. And, the new diagonal corner must always be on a smaller rectangle on each successive search operation. This is the proper binary search portion we need. We will need to maintain variables that reflect the current size of the search space.

### Code

Let's start putting this into practice. Since I know we are going to need it, the first thing I'm going to do is create a midpoint formula function.

```c
int midpoint(int num1, int num2)
{
    return (num1 + num2) / 2;
}
```

With this formula, odd numbers are only going to return the integer base, with any decimal portion truncated. I think this may cause an single extra step at most. I'm considering a case where the solution point is only `X + 1` columns away from the starting point. We would keep halving the `Y` coordinate, but the `X` value would not change until we are on the same row as the solution point, and then perform one more step to move over a single grid point. Technically, we should be rounding in the direction of travel, which would put us in to the correct column during an operation where we are also halving a `Y` coordinate. I think it might make sense to also include a ceiling function, so we can round up when moving right or down. It is a small optimization, but to ensure we pass all potential test cases, reducing any unnecessary steps is prudent.

```c
int midpoint_ceil(int num1, int num2)
{
    return ((num1 + num2) / 2) + 1;
}
```

I'll use a `switch` statement to choose the correct algorithm for each direction of travel. To do this, I need to convert the direction provided into an integer.

> **Note**: In C, `strcmp` returns `0` if the strings match, which is actually `false`. Hence, the operation must be `not`.
>
> **Note 2**: It seems universally accepted that using `!strcmp` is a poor C idiom, so this was changed to `== 0`.

```c
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
        break;
    }
    case 1: // UR
    {
        break;
    }
    case 2: // R
    {
        break;
    }
    case 3: // DR
    {
        break;
    }
    case 4: // D
    {
        break;
    }
    case 5: // DL
    {
        break;
    }
    case 6: // L
    {
        break;
    }
    case 7: // UL
    {
        break;
    }
    default:
    {
        break;
    }
}
```

The scaffolding is in place. I'll begin the algorithm tomorrow.
