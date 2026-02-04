+++
date = '2026-02-03T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 014'
summary = 'More Project Euler.'
+++

Day 3 of [Project Euler](https://projecteuler.net/). Coding is addicting. Building web apps is semi-addicting. I need to get back on the [Laravel](https://laravel.com/) train, and move my primary domain over here, but let's solve another problem first. I also need to fix that math rendering... Onward to [Problem 3](https://projecteuler.net/problem=3) from Project Euler!

## Problem 3 - Largest Prime Factor

> The prime factors of `13195` are `5`, `7`, `13` and `29`.
>
> What is the largest prime factor of the number `600851475143`?

Solving for primes... like solving for Fibonacci sequence numbers, a pretty famous and classic CS problem. I don't really recall the algorithms for solving primes though. I remember there is an algorithm called the [Sieve of Eratosthenes](https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes), but I don't recall the steps.

There are a couple problems to solve here. We need to find the factors of a number, and we need to test those factors for primality. I'm going to have to look up the math on these and see where that gets me.

### Find Factors

Regarding the number `600851475143`, we can determine a few things. First, the number is odd, so it is not divisable by `2`. Second, adding the numbers together sums to `44`, which is not divisable by `3`. Third, the number doesn't end in `0` or `5`, so it is not divisable by `5`. That solves the simpliest rules of division that I know off the bat.

This gives me an idea though. If we iterate the small values, and check for a reminder, we can find the largest factors. Then, we just need to check if that factor is prime.

Let's solve the factoring problem first.

```c
#include <stdio.h>

int main()
{
  long long divisor = 2;
  long long quotient = 0;
  const long long N = 600851475143;
  const long long half = N / divisor;

  while (divisor < half)
  {
    if (N % divisor == 0)
    {
      quotient = N / divisor;
      break;
    }
    else
    {
      ++divisor;
    }
  }

  printf("Divisor:  %lld\n", divisor);
  printf("Quotient: %lld\n", quotient);
  return 0;
}
```

Output:

```bash
Divisor:  71
Quotient: 8462696833
```

So, we have our first divisor and quotient, which are relatively large numbers. Let's actually see how many factors there are.

```c
#include <stdio.h>

int main()
{
  long long divisor = 2;
  const long long N = 600851475143;
  long long quotient = N - 1;

  while (divisor < quotient)
  {
    if (N % divisor == 0)
    {
      quotient = N / divisor;
      printf("Divisor:  %lld\n", divisor);
      printf("Quotient: %lld\n", quotient);
      divisor = N / quotient;
      ++divisor;
    }
    else
    {
      ++divisor;
    }
  }

  return 0;
}
```

Output:

```bash
Divisor:  71
Quotient: 8462696833
Divisor:  839
Quotient: 716151937
Divisor:  1471
Quotient: 408464633
Divisor:  6857
Quotient: 87625999
Divisor:  59569
Quotient: 10086647
Divisor:  104441
Quotient: 5753023
Divisor:  486847
Quotient: 1234169
```

I can count this, buy why? I have C to do that for me. I'll also remove the redundent `else` statement.

```c
#include <stdio.h>

int main()
{
  long long divisor = 2;
  const long long N = 600851475143;
  long long quotient = N - 1;
  int counter = 0;

  while (divisor < quotient)
  {
    if (N % divisor == 0)
    {
      quotient = N / divisor;
      printf("Divisor:  %lld\n", divisor);
      printf("Quotient: %lld\n", quotient);
      divisor = N / quotient;
      counter += 2;
    }

    ++divisor;
  }

  printf("Number of factors found: %d\n", counter);
  return 0;
}
```

Output:

```bash
Divisor:  71
Quotient: 8462696833
Divisor:  839
Quotient: 716151937
Divisor:  1471
Quotient: 408464633
Divisor:  6857
Quotient: 87625999
Divisor:  59569
Quotient: 10086647
Divisor:  104441
Quotient: 5753023
Divisor:  486847
Quotient: 1234169
Number of factors found: 14
```

This gives us `14` factors to verify primality.

### Primality Test

We technically created a function that can test for primes. Since we are checking for factors, if we don't find any, we know it is prime. Let's refactor this into a function, get all of our factors, and then run it again for each of the factors.

The idea is to store all the factors in an array, sort it in decending order, check each value for factors, and return the first value that doesn't have any factors.

I'll need two functions, one that checks for all factors, and one that quits early when any factor is found, since the input cannot be prime.

I could also just use one function, and add an argument for prime checking, since it is essentially the same algorithm. If prime check is false, all factors are found, and if prime check is true, any factor returned will break early and return.

Using an array to store the values seems like a natural solution, but I'll need to be careful handling it since this is C. I already know the size of the array will be at most 14 values, so that isn't too big of a problem. This would be more complicated if the functions were generalized for any number.

#### Test Phase, Factor and Sort

I refactored the function to test using an array, and to sort the array from largest to smallest value. I should note that this is **not production code**. While I try to be accurate and use best practices, sometimes I just need to get it done, and compiling correctly. For example, the C version I'm using includes `qsort` in the standard library, so I quickly renamed my version to `_Qsort` to avoid the collision. I'd probably use the `stdlib` version or a different name in production code. I also wouldn't be forcing the size of the array to only be 14 units, but I know that is all I need for this particular problem.

The quicksort function used is taken straight from [K&R](https://en.wikipedia.org/wiki/The_C_Programming_Language), with a change on line 61 (`if (v[i] > v[left])`) to make the order descending, and to change the array type to `long long`.

```c
#include <stdio.h>
#include <stdlib.h>

typedef enum
{
  FALSE = 0,
  TRUE = 1
} bool_t;

/***
 * Return an array of factors
 * Caller is responsible for freeing the returned array, if not NULL
 * If isPrimeCheck is TRUE, returns factors[0] == -1, if n is not prime
 * If isPrimeCheck is TRUE, returns factors[0] == 0, if n is prime
 * Otherwise, returns an array of factors (not necessarily prime)
 */
long long *factor(long long n, unsigned int size, bool_t isPrimeCheck)
{
  long long divisor = 2;
  long long quotient = n - 1;
  int counter = 0;
  long long *factors = (long long *)malloc(size * sizeof(long long));
  if (factors == NULL)
  {
    return NULL;
  }

  while (divisor < quotient)
  {
    if (n % divisor == 0 && isPrimeCheck == TRUE)
    {
      factors[0] = -1; // Not prime
      break;
    }
    else if (n % divisor == 0)
    {
      quotient = n / divisor;
      factors[counter++] = divisor;
      factors[counter++] = quotient;
      divisor = n / quotient;
    }

    ++divisor;
  }

  return factors;
}

/* Pg. 87 - The C Programming Language (2nd Ed) - Recursive Quicksort */
/* qsort: sort v[left]..v[right into increasing order */
void _Qsort(long long v[], int left, int right)
{
  int i, last;
  void swap(long long v[], int i, int j);

  if (left >= right)                  /* do nothing if array contains */
    return;                           /* fewer than two elements */
  swap(v, left, (left + right) / 2);  /* move partition elem */
  last = left;                        /* to v[0] */
  for (i = left + 1; i <= right; i++) /* partition */
    if (v[i] > v[left])
      swap(v, ++last, i);
  swap(v, left, last); /* restore partition elem */
  _Qsort(v, left, last - 1);
  _Qsort(v, last + 1, right);
}

/* swap: interchange v[i] and v[j] */
void swap(long long v[], int i, int j)
{
  long long temp;

  temp = v[i];
  v[i] = v[j];
  v[j] = temp;
}

int main()
{
  const long long n = 600851475143;
  const unsigned int size = 14;
  int counter = 0;

  long long *factors = factor(n, size, FALSE);

  if (factors == NULL)
  {
    printf("Memory allocation failed\n");
    return 1;
  }

  if (factors[0] == 0)
  {
    printf("%lld is prime\n", n);
    free(factors);
    return 0;
  }

  _Qsort(factors, 0, size - 1);

  for (size_t i = 0; i < size; i++)
  {
    printf("factor[%d] = %lld\n", counter, factors[i]);
    counter++;
  }

  printf("Number of factors found: %d\n", counter);

  free(factors);
  return 0;
}
```

Output:

```bash
factor[0] = 8462696833
factor[1] = 716151937
factor[2] = 408464633
factor[3] = 87625999
factor[4] = 10086647
factor[5] = 5753023
factor[6] = 1234169
factor[7] = 486847
factor[8] = 104441
factor[9] = 59569
factor[10] = 6857
factor[11] = 1471
factor[12] = 839
factor[13] = 71
Number of factors found: 14
```

#### Find the Prime Factor

With all this done, I can now iteratively check each of the factors for primality. By running the same function again, but passing in the prime check as `TRUE`, we should return early and make this relatively fast.

```c
#include <stdio.h>
#include <stdlib.h>

typedef enum
{
  FALSE = 0,
  TRUE = 1
} bool_t;

/***
 * Return an array of factors
 * Caller is responsible for freeing the returned array, if not NULL
 * If isPrimeCheck is TRUE, returns factors[0] == -1, if n is not prime
 * If isPrimeCheck is TRUE, returns factors[0] == 0, if n is prime
 * Otherwise, returns an array of factors (not necessarily prime)
 */
long long *factor(long long n, unsigned int size, bool_t isPrimeCheck)
{
  long long divisor = 2;
  long long quotient = n - 1;
  int counter = 0;
  long long *factors = (long long *)malloc(size * sizeof(long long));
  if (factors == NULL)
  {
    return NULL;
  }

  while (divisor < quotient)
  {
    if (n % divisor == 0 && isPrimeCheck == TRUE)
    {
      factors[0] = -1; // Not prime
      break;
    }
    else if (n % divisor == 0)
    {
      quotient = n / divisor;
      factors[counter++] = divisor;
      factors[counter++] = quotient;
      divisor = n / quotient;
    }

    ++divisor;
  }

  return factors;
}

/* Pg. 87 - The C Programming Language (2nd Ed) - Recursive Quicksort */
/* qsort: sort v[left]..v[right into increasing order */
void _Qsort(long long v[], int left, int right)
{
  int i, last;
  void swap(long long v[], int i, int j);

  if (left >= right)                  /* do nothing if array contains */
    return;                           /* fewer than two elements */
  swap(v, left, (left + right) / 2);  /* move partition elem */
  last = left;                        /* to v[0] */
  for (i = left + 1; i <= right; i++) /* partition */
    if (v[i] > v[left])
      swap(v, ++last, i);
  swap(v, left, last); /* restore partition elem */
  _Qsort(v, left, last - 1);
  _Qsort(v, last + 1, right);
}

/* swap: interchange v[i] and v[j] */
void swap(long long v[], int i, int j)
{
  long long temp;

  temp = v[i];
  v[i] = v[j];
  v[j] = temp;
}

int main()
{
  const long long n = 600851475143;
  const unsigned int size = 14;
  int counter = 0;

  long long *factors = factor(n, size, FALSE);

  if (factors == NULL)
  {
    printf("Memory allocation failed\n");
    return 1;
  }

  if (factors[0] == 0)
  {
    printf("%lld is prime\n", n);
    free(factors);
    return 0;
  }

  _Qsort(factors, 0, size - 1);

  for (size_t i = 0; i < size; i++)
  {
    printf("factor[%d] = %lld\n", counter, factors[i]);
    counter++;
  }

  printf("Number of factors found: %d\n", counter);

  /***
   * Prime Factor Check
   */

  long long *primeFactors = NULL;
  for (size_t i = 0; i < size; i++)
  {
    primeFactors = factor(factors[i], size, TRUE);
    if (primeFactors == NULL)
    {
      printf("Memory allocation failed\n");
      free(factors);
      return 1;
    }

    if (primeFactors[0] == 0)
    {
      printf("%lld is prime\n", factors[i]);
      break;
    }
    else
    {
      printf("%lld is not prime\n", factors[i]);
    }
  }

  free(primeFactors);
  free(factors);
  return 0;
}
```

Output:

```bash
factor[0] = 8462696833
factor[1] = 716151937
factor[2] = 408464633
factor[3] = 87625999
factor[4] = 10086647
factor[5] = 5753023
factor[6] = 1234169
factor[7] = 486847
factor[8] = 104441
factor[9] = 59569
factor[10] = 6857
factor[11] = 1471
factor[12] = 839
factor[13] = 71
Number of factors found: 14
8462696833 is not prime
716151937 is not prime
408464633 is not prime
87625999 is not prime
10086647 is not prime
5753023 is not prime
1234169 is not prime
486847 is not prime
104441 is not prime
59569 is not prime
6857 is prime
```

We got our correct answer of `6857`.
