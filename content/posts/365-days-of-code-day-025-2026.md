+++
date = '2026-02-14T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 025'
summary = ''
+++

I took some of the Laravel lessons from yesterday, and applied them to another project I'm working on for a client. I also got that project pushed up to Github into a private repository. It is definitely helpful to take the lessons from a tutorial and immediately apply them to other projects. I need to remember this when it comes to working on learning the other languages, such as Go, Rust and Haskell.

I have been doing a lot of context switching from day to day though. Constantly switching between Laravel and PHP, Hugo, C, bash, and everything else I've worked on in the last several weeks. This is not very conducive to learning or getting projects done. By far, the most progress I've made on any project was building this site with Hugo. And, it is still far from complete. The styling is overly simplistic, and I have yet to enable many expected features, such as searching, tags, categories, and projects. I've placed a lot of emphasis on being consistent, working on coding _something_ every day. I want to keep that effort up, but also ensure I'm completing projects.

All that said, I still find some fun in programming with Project Euler. And, by doing these problems in C, I am thinking that I can translate these algorithms into other languages when it comes time to learn them.

## Project Euler - Problem 25

Problem 25 on Project Euler is another Fibonacci sequence problem, and another long integer problem.

> What is the index of the first term in the Fibonacci sequence to contain \(1000\) digits?

As with some of the previous problems solved, there is no datatype that natively stores \(1000\) digits in C. Therefore, an array is likely part of the solution.

As a reminder, the Fibonacci sequence is defined by the recurrence relation:

$$F_n = F_{n-1} + F_{n-2},\space where\space F_1=1\space and\space F_2 = 1$$

So, we need to keep track of several values here. Typically, just maintaining two variables `a` and `b`, and using a third variable `tmp` is enough to calculate the Fibonacci sequence. Since this problem is dealing with such large values, the variables will likely need to be maintained as arrays.

### The Next Level - Implementing Arbitrary Precision Arithmetic

I got to thinking that there has to be a better way to perform these large integer calculations than storing everything in large arrays. After a bit of research, I've come across the critical tool of [Arbitrary Precision Arithmetic](https://en.wikipedia.org/wiki/Arbitrary-precision_arithmetic).

> Some programming languages such as Lisp, Python, Perl, Haskell, Ruby and Raku use, or have an option to use, arbitrary-precision numbers for all integer arithmetic. This enables integers to grow to any size limited only by the available memory of the system.

_paxdiablo_ provided a really excellent [explanation of the topic](https://stackoverflow.com/questions/1218149/arbitrary-precision-arithmetic-explanation/1218185#1218185) on StackOverflow.

After doing this reading on the subject, I think it really makes sense to write up a big integer library for handling these very large number problems. That will be the topic for tomorrow's coding.
