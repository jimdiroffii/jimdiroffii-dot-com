+++
date = '2026-02-10T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 021'
summary = ''
+++

3 straight weeks of "code," or at least "code-adjacent" work. Longest streak yet. I feel a bit like [Sam in Lord of the Rings](https://www.youtube.com/watch?v=zevhRBS4hp4&t).

> This is it. If I take one more step, it'll be the farthest way from home I've ever been.
>
> - Samwise Gamgee

So, what do we work on today? There is a plethora of opportunity. Let's start by recapping some of what I have done (or started) so far:

- 3 Laravel sites, all wip
- 5 Project Euler problems in C, 1 wip
- A Hugo site with new server, docker containers, CI/CD workflow
- vimrc file
- PHP time tracker
- Bug squishing
- New Ubuntu dev server

A fair bit of system work, mostly administration, but definitely code in there too.

I think I'd like to get back to Project Euler, and work on [Problem 20](https://projecteuler.net/problem=20), which I started a couple days ago.

## Euler Problem 20 - Factorial Digit Sum

For problem 20, I left off by just performing a simple factorial calculation.

```c
#include <stdio.h>

int main() {
  int n = 10;
  int result = n;

  for (int i = n - 1; i > 0; --i) {
    result *= i;
  }

  printf("Result: %i", result);
  return 0;
}
```

This is not an impressive bit of code by any means, and it doesn't solve the problem. I need to solve for the sum of the digits for \(100!\).

I'll need to keep an array of digits calculated, like the C solution to problem 16. Only the algorithm to perform the calculation is slightly different. I believe our final value for \(100!\) is over 100 digits, so I'll need plenty of space for that.

I'll try to solve a much simpler problem first, which should be able to extrapolate directly to the large number we require. \(10!\) equals \(3628800\), and the sum of those digits is \(27\). I'll solve that.

I'll need to work backwards, and use a carry digit to keep pushing values into the array. The first calculation will be \(10\times9=90\). And, the sum of those digits is \(9\). Let's build that.

I wanted to practice accepting input from the command line, so I built in some error checking to ensure valid input is available. This will make it easier to ensure small factorial values work, and then enter `100` when ready. Getting the input validation right is a bit of work in itself.

Input validation program:

```c
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <limits.h>
#include <ctype.h>

#define SUCCESS             0
#define ERR_ARGV_NULL       2
#define ERR_NEGATIVE        3
#define ERR_MISSING_ARG     4
#define ERR_NOT_A_NUMBER    5
#define ERR_OUT_OF_RANGE    6
#define ERR_CONVERSION      7
#define ERR_TRAILING_CHARS  8
#define ERR_TOO_MANY_ARG    9

void usageMsg(char *argv[]) {
  const char *program = "./program";

  if (argv != NULL && argv[0] != NULL) {
    program = argv[0];
  }

  fprintf(stderr, "Usage: %s <unsigned long integer>\n", program);
}

int validateInput(int argc, char* argv[], unsigned long *outValue) {
  if (argc < 2) return ERR_MISSING_ARG;
  if (argc > 2) return ERR_TOO_MANY_ARG;
  if (argv == NULL || argv[1] == NULL) return ERR_ARGV_NULL;

  const char *s = argv[1];
  while (isspace((unsigned char)*s)) {
    s++;
  }
  if (*s == '\0') return ERR_NOT_A_NUMBER;
  if (*s == '-') return ERR_NEGATIVE;

  char *endptr;
  errno = 0;

  unsigned long input = strtoul(s, &endptr, 10);

  if (s == endptr) return ERR_NOT_A_NUMBER;
  if (errno == ERANGE) return ERR_OUT_OF_RANGE;
  if (errno != 0) return ERR_CONVERSION;
  if (*endptr != '\0') return ERR_TRAILING_CHARS;

  *outValue = input;
  return SUCCESS;
}

int main(int argc, char *argv[]) {
  unsigned long n = 0;
  int status = validateInput(argc, argv, &n);

  if (status != SUCCESS) {
    switch (status) {
      case ERR_ARGV_NULL:
        fprintf(stderr, "Error: Unexpected argv NULL value\n");
        break;
      case ERR_NEGATIVE:
        fprintf(stderr, "Error: Input must not be negative\n");
        break;
      case ERR_MISSING_ARG:
        fprintf(stderr, "Error: Missing required argument\n");
        break;
      case ERR_TOO_MANY_ARG:
        fprintf(stderr, "Error: Too many arguments\n");
        break;
      case ERR_NOT_A_NUMBER:
        fprintf(stderr, "Error: No digits in input '%s'\n", argv[1]);
        break;
      case ERR_OUT_OF_RANGE:
        fprintf(stderr, "Error: Input out of range. Max: %lu\n", ULONG_MAX);
        break;
      case ERR_CONVERSION:
        fprintf(stderr, "Error: Input could not be converted to 'unsigned long integer'\n");
        break;
      case ERR_TRAILING_CHARS:
        fprintf(stderr, "Error: Extra chars beyond number detected\n");
        break;
      }
    usageMsg(argv);
    return status;
  }

  printf("input: %lu\n", n);
  return SUCCESS;
}
```

This input validation actually took a long time to get just right, so I've run out of time for today. I'll be back tomorrow to finish up Problem 20.
