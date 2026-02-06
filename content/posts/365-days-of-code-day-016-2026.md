+++
date = '2026-02-05T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 016'
summary = 'Site is live!'
+++

I finally migrated my primary domain over to this new [Hugo](https://gohugo.io/) site. Previously I was deploying an [Astro](https://astro.build/) project to [Netlify](https://www.netlify.com/), but Astro just wasn't the right solution for me. I'm happy with the state this new Hugo site is in currently. It is "good enough." At least for now, there are still a lot of changes that I would like to make. Spruce up this place a bit. Perhaps if you are reading this, the site has already been migrated to a later version and looks perfect! At this point, the styling is still very simple. Dark background, light text, no sidebars or truly custom components. A good start.

Updating a Caddyfile isn't enough to justify this day within the context of my *365 Days of Code* project, so I need to find something to work on before the clock strikes 12.

## Project Euler - Problem 16 - Power Digit Sum

I haven't previously solved this problem with any other language, and wanted to try something new. Let's give it a shot in `C`.

> \(2^{15}=32768\) and the sum of its digits is \(3+2+7+6+8=26\).
>
> What is the sum of the digits of the number \(2^{1000}\)?

This doesn't seem too complicated, although it would easier if I could slice up the number using Python. This is a good exercise in `C`, as I haven't had to deal with separating digits in awhile.

### Naive Solution

Let's think through a potentially naive solution.

We have a number that is growing exponentially, and needs to be calculated 1000 times. This is going to be an enormous number. Not something that can fit inside of any standard data type, I'm sure. Let's check the value on [WolframAlpha](https://www.wolframalpha.com/input/?i=2%5E1000).

```plaintext
Input: 2^1000
Result: 10715086071862673209484250490600018105614048117055336074437503883703510511249361224931983788156958581275946729175531468251871452856923140435984577574698574803934567774824230985421074605062371141877954182153046474983581941267398767559165543946077062914571196477686542167660429831652624386837205668069376
```

That is 302 decimal digits! This is going to take a bit of engineering to compute, or possibly the [GMP library](https://gmplib.org/). Given that Project Euler doesn't require computations to take more than minute, there is likely a very fast and efficient way of calculating the value required.

Let's solve an easier problem first. \(2^{15}=32768\) and the sum of its digits is \(3+2+7+6+8=26\).

```c
#include <stdio.h>
#include <math.h>
#include <string.h>

int main()
{
  double a = 2.0;
  double b = 15.0;
  double result = 0.0;
  int sum = 0;

  result = pow(a, b);
  printf("%.0f raised to power of %.0f equals %.0f\n", a, b, result);

  char str[16];
  snprintf(str, sizeof(str), "%.0f", result);
  printf("Result as string: %s\n", str);

  for (size_t i = 0; i < strlen(str); ++i)
  {
    int n = str[i] - '0';
    sum += n;
  }

  printf("Sum is: %i\n", sum);

  return 0;
}
```

Output:

```bash
❯ gcc p16.c -o p16 -lm; ./p16
2 raised to power of 15 equals 32768
Result as string: 32768
Sum is: 26
```

> Note the usage of `-lm` as a flag. The math library (`libm`) is not linked automatically by `gcc` on Linux. To utilize the `math.h` header, the *Link Math* flag must be added as a compilation option.

So, we understand how to convert a number to a string, and then split the string into characters, convert those characters to integers, and add them together. However, this didn't really help us solve the real problem. What are we going to do with a 300+ digit number?

#### Better Way to Sum Digits

Instead of using strings and characters, I could have just used the modulo operator to slice up the number by `10`.

```c
#include <stdio.h>
#include <math.h>
#include <string.h>

int main()
{
  double a = 2.0;
  double b = 15.0;
  double result = 0.0;
  int sum = 0;

  result = pow(a, b);

  while (result > 0)
  {
    sum += (int)fmod(result, 10);
    result = floor(result / 10);
  }

  printf("Sum is: %i\n", sum);

  return 0;
}
```

Output:

```bash
❯ gcc p16.c -o p16 -lm; ./p16
Sum is: 26
```

We are going to need a string to hold the big value though, so back to that.

#### Summing The Big Number

Since I don't have a good way of calculating the large value, I'll use the result from WolframAlpha to force it, and then check their notes for a potential solution.

```c
#include <stdio.h>
#include <math.h>
#include <string.h>

int main()
{
  int sum = 0;
  char str[400];
  strcpy(str, "10715086071862673209484250490600018105614048117055336074437503883703510511249361224931983788156958581275946729175531468251871452856923140435984577574698574803934567774824230985421074605062371141877954182153046474983581941267398767559165543946077062914571196477686542167660429831652624386837205668069376");

  for (size_t i = 0; i < strlen(str); ++i)
  {
    int n = str[i] - '0';
    sum += n;
  }

  printf("Sum is: %i\n", sum);

  return 0;
}
```

Output:

```bash
❯ gcc p16.c -o p16 -lm; ./p16
Sum is: 1366
```

What a sham! No notes on the ideal solution for this problem. I suppose I'll have to try GMP, ask AI, or just do it in Python.

### ChatGPT Solution

I was curious, so I asked ChatGPT to solve it:

> Here’s a clean C solution using “manual big integer” arithmetic (store the number as an array of base-10 digits, least-significant digit first), repeatedly multiply by 2 a thousand times, then sum the digits.

```c
#include <stdio.h>

#define MAX_DIGITS 400  // 2^1000 has 302 digits, so 400 is plenty.

int main(void) {
    int digits[MAX_DIGITS] = {0}; // digits[0] is least-significant digit
    int len = 1;                  // current number of digits in use

    digits[0] = 1; // start with 1, then multiply by 2 a thousand times

    for (int exp = 0; exp < 1000; exp++) {
        int carry = 0;
        for (int i = 0; i < len; i++) {
            int x = digits[i] * 2 + carry;
            digits[i] = x % 10;
            carry = x / 10;
        }
        while (carry > 0) {
            digits[len++] = carry % 10;
            carry /= 10;
        }
    }

    long sum = 0;
    for (int i = 0; i < len; i++) {
        sum += digits[i];
    }

    printf("%ld\n", sum);
    return 0;
}
```

Output:

```bash
❯ gcc p16.c -o p16; ./p16
1366
```

This was illuminating. The carry method allows for simple multiplication, and the digits are stored in reverse order. Every time we perform another multiplication, we have to work through the array, but we can store a result of arbitrary length. An interesting technique that I hadn't seen before. 🎵 *[The More You Know...](https://en.wikipedia.org/wiki/The_More_You_Know)* 🎵
