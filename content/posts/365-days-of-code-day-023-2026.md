+++
date = '2026-02-12T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 023'
summary = ''
+++

Day 23 has begun, and it is technically nearly over. I had a busy day today, for everything other than code. This was bound to happen eventually. But, to keep the dream alive, I'm not ending this day without working on something. To make it easy on myself, I'm going to work on this website some more. Incremental improvements is how things get done. The only real change made today was to move the header tag from the partial page into the base layout. Now it matches the other sections.

Part of what is eating my time right now is reading. I have two books in my reading list at the moment. I started the [Linux+ certification](https://www.comptia.org/en-us/certifications/linux/v8/) study, so I'm reading the _CompTIA Linux+ Study Guide_. To keep my security chops up, I'm also reading [_Gray Hat Hacking_](https://www.mheducation.com/highered/mhp/product/gray-hat-hacking-ethical-hacker-s-handbook-sixth-edition?pd=search&viewOption=student).

After using tons of different operating systems, and never have taken an OS course, I thought I might buy a book on OS as well. Turns out, one of the best OS books is freely available online! [_Operating Systems: Three Easy Pieces_](https://pages.cs.wisc.edu/~remzi/OSTEP/).

I cloned the [code repository](https://github.com/remzi-arpacidusseau/ostep-code) to grab a couple header files used in the book, `common.h` and `common_threads.h`.

I was particularly interested in the multithreaded example shown in the [introduction](https://pages.cs.wisc.edu/~remzi/OSTEP/intro.pdf).

```c
#include <stdio.h>
#include <stdlib.h>
#include "common.h"
#include "common_threads.h"

volatile int counter = 0;
int loops;

void *worker(void *arg) {
  int i;
  for (i = 0; i < loops; i++) {
    counter++;
  }
  return NULL;
}

int main(int argc, char *argv[]) {
  if (argc != 2) {
    fprintf(stderr, "usage: threads <value>\n");
    exit(1);
  }
  loops = atoi(argv[1]);
  pthread_t p1, p2;
  printf("Initial value: %d\n", counter);

  Pthread_create(&p1, NULL, worker, NULL);
  Pthread_create(&p2, NULL, worker, NULL);
  Pthread_join(p1, NULL);
  Pthread_join(p2, NULL);
  printf("Final value: %d\n", counter);
  return 0;
}
```

The idea behind this program is to show how concurrent threads may produce unpredictable behavior. The expectation is that the result will be `2N`. So, if you enter `2`, you'll get back `4`. Or, `1000` becomes `2000`. The loop runs `N` times with `2` threads.

However, when you get to larger numbers, you may or may not get the expected value back.

```bash
❯ ./threads
usage: threads <value>
❯ ./threads 2
Initial value: 0
Final value: 4
❯ ./threads 1000
Initial value: 0
Final value: 2000
❯ ./threads 10000
Initial value: 0
Final value: 17234
❯ ./threads 10000
Initial value: 0
Final value: 20000
❯ ./threads 10000
Initial value: 0
Final value: 14036
```

This is due to the instructions not being executed **atomically**. I look forward to diving deeper into this example later in the book.
