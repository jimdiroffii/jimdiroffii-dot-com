+++
date = '2026-02-01T00:00:01-05:00'
draft = true
title = '365 Days of Code - Day 012'
summary = 'Blogging and fun with Project Euler!'
+++

With the core Hugo configuration finished today, I copied over the blog posts from previous days. Along with some additional formatting in Markdown, this blog is now setup, and my personal site is live. I'm still on the `test` subdomain, so I need to switch the over, but let's work on some C code instead.

## Setup C

I haven't written any C in awhile, so I need to check if my system is ready to compile it. I'll write up a *hello, world!* app to test compilation.

```c
#include <stdio.h>

int main() {
  printf("Hello, World!\n");
  return 0;
}
```

Right away, I get some warnings from the VS Code Extension Pack for C/C++. It seems the last time I wrote some code with this, I did it on Windows, so the paths aren't configured correctly. I'm now developing on a remote (local) server that I use to host all my code. I'll need to figure out the best way to manage this in VS Code, or just skip that and go with Vim. I think I'll just go with Vim on the server itself.

I'll go with a shortcut for Debian and install `build-essential`. This shoudl give me all the necessary tools to work with C. I'm also going to install some optional tooling, in case I need it later.

```bash
sudo apt install build-essential gdb valgrind strace ltrace gdbserver binutils elfutils cmake
```

And, now we can compile. I'll add some flags so I get used to typing these in for more complex programs later:

```bash
gcc -g -O0 -Wall -Wextra -Wpedantic -o p01 p01.c
```

We get our output:

```bash
> ./p01
Hello, world!
```

## Project Euler

I've been playing around with Project Euler for years. It is a good way to practice language syntax and algorithms. It has been awhile since I tried to solve anything. This challenge is supposed to be 365 days of **code**, so let's do some actual code.

I've saved some challenge solutions in C++, Java, and Python in my [code solutions](https://github.com/jimdiroffii/code-solutions) repo. Let's go old school, and write a little bit of C... if I can remember it.

### Problem 1 - Multiples of 3 and 5 (Fizz Buzz)

The first Project Euler problem is a variant of the famous [Fizz Buzz](https://en.wikipedia.org/wiki/Fizz_buzz) algorithm. If you don't know it, learn it. It is a simple set of rules, for which you must devise an algorithm.

- On multiples of 3, say `fizz`.
- On multiples of 5, say `buzz`.
- If divisable by both, say `fizzbuzz`.

#### Solve The Problem (naive)

The problem states:

> If we list all the natural numbers below 10 that are multiples of 3 or 5, we get 3, 5, 6, and 9. The sum of these multiples is 23.
>
> Find the sum of all the multiples of 3 or 5 below 1000.

The simpliest naive solution I can think of is to just run a `for` loop that checks for the multiples using a modulo, and an `if` statement for `3` and `5`.

```c
#include <stdio.h>

int main() {
  int sum = 0;
  int max = 1000;

  int a = 3;
  int b = 5;

  int start = 3;

  for (int i = start; i < max; ++i) {
    if (i % a == 0) {
      sum += i;
    }
    else if (i % b == 0) {
      sum += i;
    }
  }

  printf("sum = %i", sum);
  return 0;
}
```

This gets the job done, and produces the correct result, which is `233168`. Optimizing such a simple program is overkill, but that is part of the fun of Project Euler. Not only getting the result, but practicing programming.

#### Improvments

The first optimization I can think of is to collapse the `if/else` statement into an `or`.

```c
if (i % a == 0 || i % b == 0) {
  sum += i;
}
```

This supports the [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) principle, since we removed a redundant `sum` statement.

We can take this a step further by turning it into a one-liner.

```c
if (i % a == 0 || i % b == 0) sum += i;
```

That look good. What about our variable declarations? Any improvements there? Sure, we can use `const`, and extend the range of `sum`, so we don't overflow.

```c
const int max = 1000;
const int a = 3, b = 5;
long long sum = 0;
```

Our program is beginning to look a little cleaner, at least for a naive solution.

```c
#include <stdio.h>

int main(void) {
    const int max = 1000;
    const int a = 3, b = 5;
    long long sum = 0;

    for (int i = a; i < max; ++i) {
        if (i % a == 0 || i % b == 0) sum += i;
    }

    printf("sum = %lld\n", sum);
    return 0;
}
```

#### O(1) Solution

The naive solution checks every single number below our max value. Much of this is a waste, since most of the numbers are not divisible by 3 or 5. We can skip all of that extra work. We can also keep track of multiples of 15, since they are divisible by both 3 and 5, and we don't want to count them twice.

If we consider `k` as our multiple (`3` or `5`), and `N` as our max value (`1000`), then:

```math
k, 2k, 3k, ..., mk
```

Where `m` is the largest integer such that `mk < N`.

Furthermore, this means:

```math
m = \frac{N-1}{k}
```

If `k = 3`, `N = 10`: multiples below `10` are `3`, `6`, `9` and `m = 9/3 = 3`.

We can find the sum by using the formula:

```math
1+2+3+...+m = \frac{m(m+1)}{2}
```

Therefore, the sum of multples of `k` below `N` is:

```math
sum(k, N) = K \cdot \frac{m(m+1)}{2}
```

where

```math
m = \frac{N-1}{k}
```

We need to add the multiples of both `3` and `5` though, so we have one issue. We will double count all numbers that are multiples of both `3` and `5`. We resolve this by subtracting the sum of the lowest common multiple (`LCM`) of `3` and `5`, which is `15`, `N` times. This is known as the *inclusion-exclusion* principle.

If you haven't caught on yet, we have changed our algorithm from a simple naive approach of iterating over every value and performing a sum, to a few simple multiplication problems with a single sum operation at the end. We could do this math easily by hand.

##### Multiples of 3 under 1000

```math
m_3 = \frac{999}{3} = 333 \\
S_3 = 3 \cdot \frac{333\cdot334}{2} = 166833
```

##### Multiples of 5 under 1000

```math
m_5 = \frac{999}{5} = 199 \\
S_5 = 5 \cdot \frac{199\cdot200}{2} = 99500
```

##### Multiples of 15 under 1000

```math
m_{15} = \frac{999}{15} = 66 \\
S_{15} = 15 \cdot \frac{66\cdot67}{2} = 33165
```

##### Final Sum

```math
S = 166833 + 99500 - 33165 = 233168
```

Simple, right?

#### The C Code

Now, we just have to recreate this algorithm in C:

```c
#include <stdio.h>

static long long sum_multiples(long long k, const long long N) {
  long long m = (N - 1) / k;
  return k * m * (m + 1) / 2;
}

int main() {
  const long long N = 1000;
  long long sum = sum_multiples(3,  N)
                + sum_multiples(5,  N)
                - sum_multiples(15, N);

  printf("sum = %lld\n", sum);
  return 0;
}
```

## Conclusion

This is what I love about programming, and by extension, Project Euler. There are always more than one way to solve a problem. Even on the simplest problem, we can build an algorithm that performs (I think...) around 150x better than a naive approach.
