+++
date = '2026-03-30T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 069'
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
| CodinGame               | C             | Ongoing         | None       | Completed: 5.                                                        |

## CodinGame - Where Was The Knight Before?

[How does the knight move?](https://www.youtube.com/shorts/gbKjLoHg1yg)

A Chess puzzle! I've seen this challenge in the list before, and finally decided to try and tackle it today.

> You get two consecutive pictures of a game board. The board is made of 64 squares arranged in 8 rows and 8 columns. A single piece was moved:
>
> - either to an empty square (simple move),
> - or to a square occupied by another piece of the opposite player, in which case the target is removed from the board (move with capture).
>
> Some AI already converted the pictures to ASCII art. Pieces may appear on the board in uppercase (white) or lowercase (black). Any character not in the set of valid piece letters (in either uppercase or lowercase) represents an empty square. Empty squares may be represented by different characters, even within the same board.
>
> Your task is to output the move with its coordinates, and tell if the piece moved is a knight.
>
> Knights are the only pieces on a chess board that do not move following a horizontal, vertical or diagonal pattern but move either 2 squares horizontally and 1 square vertically or 1 square horizontally and 2 squares vertically.
>
> **Input**
>
> - **Line 1**: A string pieces containing the uppercase letters (A-Z) that represent the white pieces. (The corresponding lowercase letters represent the black pieces.)
> - **Next 8 lines**: The board before the move.
> - **Next 8 lines**: The board after the move.
>
> Each line of the board is a string of 8 printable ASCII characters. Each character is either a piece or an empty square.
>
> **Output**
>
> - **Line 1**: Coordinates of the initial and final squares of the piece that was moved. Each coordinate is made of one lowercase letter (from a to h for the horizontal position on the board, from left to right) and one digit (from 1 to 8 for the vertical position, from bottom to top), the top left square being a8. The coordinates shall be separated by - for a simple move, or x for a move with capture.
> - **Line 2**: `Knight` if the moved piece is a knight, or `Other`
>
> **Constraints**
>
> Only one piece is moved and at most one piece can be captured. The moves are guaranteed to be simple, i.e. i no "en passant" move, nor pawn promotion, nor any castling.
> The string pieces contains at least one letter and at most 16.

### Initial Thoughts

My excitement over this being a check problem is quickly deflated once I read through the description and checked the test cases.

- Test Case:

```plaintext
IJK
abcdefKh
ABDIDEFH
ZYXWVUTS
zyxsatoj
lmnarepo
LMNtenkt
opqopera
iPQrotal
SaTORaKi
aReIObBY
TENetcDX
OpeRAdCj
RoTaSeDV
fEUzlLkO
gFTymMpP
hHSxnNqq
```

I mean, this test case is meant to represent chess boards and pieces. I feel like this problem is going to be far more annoying than interesting. But, perhaps that is how I'll challenge myself today. Getting over the annoyance and pushing forward despite my initial resistance.

### Analysis

The test cases provided 3 items: the characters that will represent pieces, and 2 boards. The blank squares of the boards can be any character except for the characters representing pieces. The challenge is to diff the change between board 1 and board 2, and determine if a knight could have made the move. Only one simple move can be made at a time.

Therefore, a diff should show 2 squares that are different. The place a piece moved from, and the place a piece moved to.

Challenges:

- Determine which board squares changed
- Determine if a piece was captured
- Determine if a knight could have made the move

Each of these challenges comes with its own set of problems.

Let's analyze the default code, inputs and needed outputs.

> Note: As I was checking the inputs/outputs, I noticed that the game board is actually backwards. The white pieces and black pieces are on the opposite starting squares. I [wrote a note](https://forum.codingame.com/t/community-puzzle-where-was-this-knight-before-puzzle-discussion/208028/5) to the challenge creator to try and get the description of the game fixed.

Here is the default code, with a few additions for debugging a successful output:

```c
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>

int main()
{
    char pieces[257] = "";
    scanf("%[^\n]", pieces); fgetc(stdin);
    fprintf(stderr, "pieces: [%s]\n", pieces);

    fprintf(stderr, "  abcdefgh\n\n");

    for (int i = 0, j = 8; i < 8; ++i, --j) {
        char sline[9] = "";
        scanf("%[^\n]", sline); fgetc(stdin);
        fprintf(stderr, "%d %s %d\n", j, sline, j);
    }

    fprintf(stderr, "\n  abcdefgh\n\n");

    for (int i = 0, j = 8; i < 8; ++i, --j) {
        char eline[9] = "";
        scanf("%[^\n]", eline); fgetc(stdin);
        fprintf(stderr, "%d %s %d\n", j, eline, j);
    }

    fprintf(stderr, "\n  abcdefgh\n\n");

    printf("e2-e3\nOther");
    return 0;
}
```

- Output:

```plaintext
pieces: [RNBQKP]

  abcdefgh

8 RNBQKBNR 8
7 PPPPPPPP 7
6 ........ 6
5 ........ 5
4 ........ 4
3 ........ 3
2 pppppppp 2
1 rnbqkbnr 1

  abcdefgh

8 RNBQKBNR 8
7 PPPPPPPP 7
6 ........ 6
5 ........ 5
4 ........ 4
3 ....p... 3
2 pppp.ppp 2
1 rnbqkbnr 1

  abcdefgh

e2-e3
Other
```

I'm going to mentally ignore the fact that the board is backwards, and assume that the lowercase letters are actually the white pieces. It doesn't really matter in the context of the coding challenge, but I can't stop my mind from thinking about it. The extra letters and numbers around the boards are just there for my benefit, so it is easier to visualize the output notation required.

While this test case uses the proper letters to distinguish the pieces (`RNBQKP`), the other test cases do not provide the same representation. We must assume that any piece can be represented by any ASCII character. Therefore, keeping track of the different pieces on the board doesn't matter for the algorithm that must be developed. These designations are only there to determine if after a move was made, a piece was captured or was moved to an empty square.

The knight moves in an `L` shape, and is the only piece to do so. No other piece on the board can move in a similar fashion as the knight. This is opposed to moving a piece one square forward, which could be accomplished by the king, queen, pawn or rook. Let's determine what this means regarding knight moves:

- A knight move is an `L` shape
- A knight in the center of the board has 8 potential moves
- The move will always be 2 squares in one direction, and 1 square in a perpendicular direction
- The line formed between the coordinates of the move will always have a non-45 degree slope, and never be straight
- All other pieces will have a 45-degree slope, or move in a straight line

I think that is part of the key to solving this problem quickly. If we determine the slope between the coordinates of the move, it is a potential knight move. Of course, it is possible to be presented with an illegal move, such as a piece moving from `a1` to `h2` in a single move. This will also not be a 45-degree or straight line, but it is also an illegal move. The description of the problem alludes to all moves being legal, but does not definitely state that no illegal moves will be made. I'll assume that all moves are legal until presented with evidence otherwise.

Therefore, only the slope of the line between the coordinates needs to be checked.

The next problem to tackle is how to determine which piece moved, where it moved, and if another piece was captured in the process. How do we manage the changing state of the boards?

The two boards are read in, one full board at a time.

So, we can read in a full board, storing it in an array.

Then when we read in the second board, we check each character to determine the differences.

But, as we have seen in the complex test case, the empty squares can be anything, and are not consistent between the two boards. The empty squares must be ignored.

This is where knowing the valid pieces is helpful. The only change that should happen between valid piece representations is the move we need to analyze.

So, it isn't necessary to store the empty square representations. These can stay blank in the array. We only need to check the valid pieces. When the board is stored in the array, any character that is not in the list of piece representations will be skipped and stored as a blank entry in the array. The description states that any "printable" character could be a potential blank square. I'm going to presume that does not include whitespace, and use a `' '` character to store empty squares.

The piece representations are stored in a string. When we read in a character from the input to store in the array, we can see if that character is held within the string. I don't think there is a better way to do this other than searching through the pieces string each time a new character is read. In a different language, I would probably store the piece letters into a hashmap. I think that would over complicate things for this simple challenge, and searching through these very short strings is going to be pretty fast.

At this point, I have enough information to debug the boards, and load them into the array. I created a short function to assist with printing the array to `stderr` for debugging.

```c
for (int i = 0, j = 8; i < 8; ++i, --j) {
    char sline[9] = "";
    scanf("%[^\n]", sline); fgetc(stdin);
    fprintf(stderr, "%d %s %d\n", j, sline, j);

    for (int k = 0; k < 8; ++k)
    {
        if (strchr(pieces, toupper(sline[k]))) arr[i][k] = sline[k];
        else arr[i][k] = ' ';
    }
}

debug_2d_arr(arr, 8);
```

```c
void debug_2d_arr(char arr[][8], int size)
{
    fprintf(stderr, "\n");
    for (int i = 0; i < size; ++i)
    {
        for (int j = 0; j < size; ++j)
        {
            fprintf(stderr, "%c", arr[i][j]);
        }
        fprintf(stderr, "\n");
    }
}
```

- Current debug output:

```plaintext
pieces: [RNBQKP]

  abcdefgh

8 RNBQKBNR 8
7 PPPPPPPP 7
6 ........ 6
5 ........ 5
4 ........ 4
3 ........ 3
2 pppppppp 2
1 rnbqkbnr 1

RNBQKBNR
PPPPPPPP




pppppppp
rnbqkbnr

  abcdefgh

8 RNBQKBNR 8
7 PPPPPPPP 7
6 ........ 6
5 ........ 5
4 ........ 4
3 ....p... 3
2 pppp.ppp 2
1 rnbqkbnr 1

  abcdefgh
e2-e3
Other
```

### Diff The Board

Now that the noise of random ASCII characters is filtered out of the first board, we can apply the exact same logic to the second board. We don't even need to store the second board in its own 2D array. We can just read it line by line, normalize the characters to either a valid piece or an empty space (`' '`), and immediately compare it to our stored `arr`.

Since only one piece moves per test case, we are guaranteed to find exactly two squares that don't match:

1. **The Origin:** A square that had a piece in board 1, but is now evaluated as an empty space in board 2.
2. **The Destination:** A square in board 2 that now contains a piece different from what was in board 1.

This also makes checking for captures incredibly straightforward. When we find the destination square, we simply look at what was originally there in `arr`. If it wasn't an empty space, then a piece was captured! No need to check colors or uppercase versus lowercase.

Here is how I implemented the second loop:

```c
int orig_r = -1, orig_c = -1;
int dest_r = -1, dest_c = -1;
bool is_capture = false;

for (int i = 0, j = 8; i < 8; ++i, --j) {
    char eline[9] = "";
    scanf("%[^\n]", eline); fgetc(stdin);

    for (int k = 0; k < 8; ++k) {
        // Normalize the current square
        char current_piece = ' ';
        if (strchr(pieces, toupper(eline[k]))) {
            current_piece = eline[k];
        }

        // Compare against the first board
        if (arr[i][k] != current_piece) {
            if (current_piece == ' ') {
                // Board 1 had a piece, Board 2 is empty. This is the origin.
                orig_r = i;
                orig_c = k;
            } else {
                // Board 2 has a piece. This is the destination.
                dest_r = i;
                dest_c = k;

                // If Board 1 wasn't empty here, it was a capture.
                if (arr[i][k] != ' ') {
                    is_capture = true;
                }
            }
        }
    }
}
```

### Was It A Knight?

Now that we have the coordinates of the move (`orig_r`, `orig_c` and `dest_r`, `dest_c`), we need to verify if the move pattern matches a knight.

Earlier, I noted that a knight's move is an `L` shape, meaning it moves 2 squares in one direction and 1 square in the perpendicular direction. Math comes to the rescue here. By taking the absolute difference of the rows (`dy`) and the columns (`dx`), we can completely bypass writing a dozen messy `if/else` checks for board boundaries and directions.

If the absolute differences are `1` and `2` (in either order), it's a knight move.

```c
int dx = abs(orig_c - dest_c);
int dy = abs(orig_r - dest_r);
bool is_knight = (dx == 1 && dy == 2) || (dx == 2 && dy == 1);
```

### Final Output Formatting

The last hurdle is converting our array indices back into standard algebraic chess notation.

Our columns (`orig_c` and `dest_c`) correspond to the letters `a` through `h`. Since they are integers from `0` to `7`, we can just add them to the character `'a'`.

Our rows are a bit different since row `0` in our array corresponds to row `8` on the board, and row `7` corresponds to row `1`. Subtracting our row index from `8` gets us the correct number.

Finally, we just need to check our `is_capture` flag to decide if we print a `-` or an `x` between the coordinates.

```c
// Format coordinates
char orig_col = 'a' + orig_c;
int orig_row = 8 - orig_r;
char dest_col = 'a' + dest_c;
int dest_row = 8 - dest_r;
char separator = is_capture ? 'x' : '-';

// Output results
printf("%c%d%c%c%d\n", orig_col, orig_row, separator, dest_col, dest_row);
printf("%s\n", is_knight ? "Knight" : "Other");

return 0;
```

### Conclusion

Despite my initial annoyance with the backward board and the "noisy" ASCII test cases, this problem ended up being a really satisfying exercise in data normalization. By boiling down the boards to just "valid piece" or "empty space", the complex diffing logic and capture detection practically solved themselves.

Another puzzle down, and the streak continues. On to the next one!
