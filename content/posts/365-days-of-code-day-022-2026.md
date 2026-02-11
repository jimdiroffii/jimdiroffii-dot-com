+++
date = '2026-02-11T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 022'
summary = ''
+++

I finished up [Problem 20](https://projecteuler.net/problem=20) this morning. I went well beyond what was needed to find the solution, but this is all just practice. I tried to be as defensive as possible, validate everything, and provide options for alternative numbers. The program can run for factorial values well beyond 100!. Although, the program gets quite slow once you are into the really large factorials.

```c
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <limits.h>
#include <ctype.h>
#include <string.h>

#define SUCCESS             0
#define FAILURE             1
#define ERR_ARGV_NULL       2
#define ERR_NEGATIVE        3
#define ERR_MISSING_ARG     4
#define ERR_NOT_A_NUMBER    5
#define ERR_OUT_OF_RANGE    6
#define ERR_STRING          7
#define ERR_TRAILING_CHARS  8
#define ERR_TOO_MANY_ARG    9
#define ERR_BUFF_OVERFLOW   10

#define MAX_DIGITS 1000000

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
  if (errno != 0) return ERR_STRING;
  if (*endptr != '\0') return ERR_TRAILING_CHARS;

  *outValue = input;
  return SUCCESS;
}

int factorialDigitSum(unsigned long n, unsigned long *result) {
  if (n == 0 || n == 1) {
    *result = 1;
    return 0;
  }

  int digits[MAX_DIGITS] = {0};

  int len = 1;
  digits[0] = 1;

  for (int i = 0; i < n; ++i) {
    int carry = 0;

    for (int j = 0; j < len; ++j) {
      int x = digits[j] * (i + 1) + carry;
      digits[j] = x % 10;
      carry = x / 10;
    }

    while (carry > 0) {
      if (len >= MAX_DIGITS) return ERR_BUFF_OVERFLOW;
      digits[len++] = carry % 10;
      carry /= 10;
    }
  }

  unsigned long sum = 0;
  for (int i = 0; i < len; ++i) {
    sum += digits[i];
  }

  *result = sum;
  return 0;
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
      case ERR_STRING:
        fprintf(stderr, "Error: %s\n", strerror(errno));
        break;
      case ERR_TRAILING_CHARS:
        fprintf(stderr, "Error: Extra chars beyond number detected\n");
        break;
      }
    usageMsg(argv);
    return status;
  }

  unsigned long result = 0;

  status = 0;
  status = factorialDigitSum(n, &result);

  if (status == ERR_BUFF_OVERFLOW) {
    fprintf(stderr, "Error: Buffer overflow, use a smaller value\n");
    return FAILURE;
  }

  printf("input:  %lu!\n", n);
  printf("result: %lu\n", result);

  return SUCCESS;
}
```

Output:

```bash
❯ ./p20 100
input:  100!
result: 648
```

This program is definately good enough to solve P20, but I also think it is good enough as a general program. The input validation is robust, many defensive techniques are in use, and the range of numbers available to calculate is immense.

Looking forward, I think I may try to design these algorithms in several languages in sequence. C, C++, Java, Rust, Go, Haskell, Elixir and Python are all of interest to me. In fact, I'm going to go through the process of getting all these languages setup, so I can use them when I want to.

## Hello, World

I'll setup a basic `Hello, World!` program for each language, to ensure I have the necessary ingredients.

### C

I already setup a C development environment. I'm currently using Ubuntu with the following tool packages:

```plaintext
build-essential, gdb, valgrind, strace, ltrace, binutils, elfutils, cmake
```

- hello.c

```c
#include <stdio.h>

int main(void) {
  printf("Hello, C!\n");
  return 0;
}
```

- Compilation

```bash
gcc hello.c -o helloC
```

### C++

C++ uses many of the same prerequisites as C, but a different compiler.

- hello.cpp

```c++
#include <iostream>

int main(void) {
  std::cout << "Hello, C++!" << std::endl;
  return 0;
}
```

- Compilation

```bash
g++ hello.cpp -o helloCpp
```

### Python

Python3 comes preinstalled on Ubuntu, and no compilation necessary.

- hello.py

```python
print('Hello, Python!')
```

- Run it

```bash
python3 ./hello.py
```

### Java

The Ubuntu Java Development Kit package `default-jdk`, requires 684 MB of disk space. Oh, Java. I always hated using this language. I never worked on anything that truly required Java, so I always felt way overburdened by the huge library and tons of boilerplate.

Despite the latest LTS version being Java 25, the jdk installed in Ubuntu is version 21. This is fine for my purposes.

- HelloWorld.java

```java
public class HelloWorld {
  public static void main(String[] args) {
    System.out.println("Hello, Java!");
  }
}
```

- Compilation

```bash
javac ./HelloWorld.java
```

- Run it

```bash
java HelloWorld
```

### Go

The version of Go installed is `1.26.0`. I performed the installation directly from the binary download available on the [Go website](https://go.dev/doc/install).

- hello.go

```go
package main

import "fmt"

func main() {
  fmt.Println("Hello, Go!")
}
```

- Init module

```bash
go mod init example/hello
```

- Compile / Run

```bash
go run ./hello.go
```

### Rust

I used the script installation to install `rustup`, and now have version `1.93.0` installed.

- hello.rs

```rust
fn main() {
  println!("Hello, Rust!");
}
```

- Compilation

```bash
rustc hello.rs
```

### Haskell

I've never used Haskell before, this will be a good start.

[Haskell docs](https://www.haskell.org/get-started/) recommend using `GHCup` to install the toolchain. It installs 4 packages, and itself: GHC, HLS, Cabal and Stack.

- hello.hs

```haskell
main = do
  putStrLn "Hello, Haskell!"
```

- Compilation

```bash
ghc hello.hs
```

### Elixir

I've never used Elixir either, but I had a client ask for it once. Let's try it out.

To install, I'll use the `rabbitmq` PPA [recommended for Ubuntu](https://elixir-lang.org/install.html).

The script is just a one liner, and executes directly.

- hello.exs

```elixir
IO.puts("Hello, Elixir!")
```

- Execution

```bash
elixir hello.exs
```

## Update `.bashrc` and `.zshrc`

Lastly, I needed to update my shell scripts to prepend the new paths.

```bash
# ------------------------------------------------------------
# Go
# ------------------------------------------------------------
GO_BIN="/usr/local/go/bin"
if [ -d $GO_BIN ]; then
  export PATH="$GO_BIN:$PATH"
fi

# ------------------------------------------------------------
# Rust
# ------------------------------------------------------------
RUST_BIN="$HOME/.cargo/bin"
if [ -d $RUST_BIN ]; then
  export PATH="$RUST_BIN:$PATH"
fi

# ------------------------------------------------------------
# GHCup / Haskell / Cabal
# ------------------------------------------------------------
GHC_BIN="$HOME/.ghcup/bin"
CABAL_BIN="$HOME/.cabal/bin"
if [ -d $GHC_BIN ]; then
  export PATH="$GHC_BIN:$PATH"
fi
if [ -d $CABAL_BIN ]; then
  export PATH="$CABAL_BIN:$PATH"
fi
```
