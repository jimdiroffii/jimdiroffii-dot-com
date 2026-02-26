+++
date = '2026-02-25T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 036'
summary = ''
+++

## Project Status

| Project                 | Language      | Status          | Due Date   | Latest Update                                                                                             |
| :---------------------- | :------------ | :-------------- | :--------- | :-------------------------------------------------------------------------------------------------------- |
| Personal Website        | Hugo          | Ongoing         | None       | The site is live. There are some TODOs. Need to work on categorization, tagging, and layout improvements. |
| Laravel From Scratch    | Laravel (PHP) | In-Progress     | 2026-03-31 | Episode 8                                                                                                 |
| PRM                     | Laravel (PHP) | In-Progress     | 2026-03-31 | Working alongside other Laravel projects.                                                                 |
| Client Website (J.L.)   | Laravel (PHP) | In-Progress     | 2026-03-31 | Working alongside other Laravel projects.                                                                 |
| Project Euler           | C             | Ongoing         | None       | Working on P25. BigInt (AI gen) was a waste of time, need to rewrite                                      |
| Practice Java           | Java          | Paused          | None       | Installed, need to find a good project.                                                                   |
| Practice Python         | Python        | Paused          | None       | Installed, need to find a good project.                                                                   |
| Learn Go                | Go            | Paused          | None       | Installed, work on LDAP Injector from ippsec.                                                             |
| Learn Rust              | Rust          | Haven't Started | None       | Installed, will try network protocols after finishing in C and Zig.                                       |
| Learn Elixir            | Elixir        | Haven't Started | None       | Installed, need a good tutorial project.                                                                  |
| Learn Haskell           | Haskell       | Haven't Started | None       | Installed, need a good tutorial project.                                                                  |
| Learn Zig               | Zig           | Haven't Started | None       | Installed, will try network protocols after finishing in C.                                               |
| Linux+                  | N/A           | In-Progress     | 2026-03-31 | Reading Chapter 4.                                                                                        |
| Cyber Quest 2026        | N/A           | In-Progress     | 2026-02-28 | Finished quiz 1 with 75%. Need to work on ARP poisoning and timestamp adjustments in WireShark.           |
| Operating Systems       | N/A           | In-Progress     | 2026-03-31 | Reading Chapter 4: Abstraction                                                                            |
| Grey-Hat Hacking        | Various       | In-Progress     | 2026-03-31 | Reading Chapter 8: Threat Hunting Lab                                                                     |
| PHP Time Tracker        | PHP           | Beta Finished   | None       | Working on a basic level. Could use a couple more updates to make it fully functional.                    |
| HTTP Status Code Reader | C             | Complete        | 2026-02-18 | Complete. Could potentially upgrade for more advanced functions or follow redirects.                      |
| ZSH Configuration       | bash/zsh      | Complete        | None       | Sort of an ongoing process, but complete for now. Works good.                                             |
| Network Protocols       | C             | In-Progress     | None       | IPv4 Datagram Header built. Need to work on payload and ICMP.                                             |

## Zig

Taking a break from the network protocol to try and start with with [Zig](https://ziglang.org/). I was researching other languages to try writing the network stack with, and I came across Zig as a compelling option to try in addition to Rust. I had some issues writing a simple hello program, but Zig works fine with `zig init`. The code produced for a simple hello world program is pretty verbose compared to other languages. I tried a much simpler version but kept having library issues.

The standard library master documentation provided a [simple hello program](https://ziglang.org/documentation/master/#Hello-World), but I could not get it to compile. I'm realizing now that the documentation I was reading was likely using an older version of the package.

This is what I tried:

- hello.zig

```zig
const std = @import("std");

pub fn main(init: std.process.Init) !void {
    try std.fs.File.stdout().writeStreamingAll(init.io, "Hello, World!\n");
}
```

```bash
> zig build-exe hello.zig
hello.zig:4:16: error: root source file struct 'fs' has no member named 'File'
    try std.fs.File.stdout().writeAll("Hello, Zig!\n");
               ^~~~
/opt/zig/zig-x86_64-linux-0.16.0-dev.2565+684032671/lib/std/fs.zig:1:1: note: struct declared here
//! File System.
^~~~~~~~~~~~~~~~
referenced by:
    callMain [inlined]: /opt/zig/zig-x86_64-linux-0.16.0-dev.2565+684032671/lib/std/start.zig:677:59
    callMainWithArgs [inlined]: /opt/zig/zig-x86_64-linux-0.16.0-dev.2565+684032671/lib/std/start.zig:629:20
    posixCallMainAndExit: /opt/zig/zig-x86_64-linux-0.16.0-dev.2565+684032671/lib/std/start.zig:582:38
    2 reference(s) hidden; use '-freference-trace=5' to see all references
```

But, checking the `master` documentation provided a different method. The `fs` was changed to `io`.

```zig
const std = @import("std");

pub fn main(init: std.process.Init) !void {
    try std.Io.File.stdout().writeStreamingAll(init.io, "Hello, World!\n");
}
```

This might work, but instead I went with the `zig init` procedure.

By default, it seems the Zig init uses the name of the root directory for the program. To craft the initial hello world program, these steps were taken:

```bash
mkdir hello-world
cd hello-world
zig init
zig build run
```

- src/main.zig

```zig
const std = @import("std");
const Io = std.Io;

const hello_world = @import("hello_world");

pub fn main(init: std.process.Init) !void {
    // Prints to stderr, unbuffered, ignoring potential errors.
    std.debug.print("All your {s} are belong to us.\n", .{"codebase"});

    // This is appropriate for anything that lives as long as the process.
    const arena: std.mem.Allocator = init.arena.allocator();

    // Accessing command line arguments:
    const args = try init.minimal.args.toSlice(arena);
    for (args) |arg| {
        std.log.info("arg: {s}", .{arg});
    }

    // In order to do I/O operations need an `Io` instance.
    const io = init.io;

    // Stdout is for the actual output of your application, for example if you
    // are implementing gzip, then only the compressed bytes should be sent to
    // stdout, not any debugging messages.
    var stdout_buffer: [1024]u8 = undefined;
    var stdout_file_writer: Io.File.Writer = .init(.stdout(), io, &stdout_buffer);
    const stdout_writer = &stdout_file_writer.interface;

    try hello_world.printAnotherMessage(stdout_writer);

    try stdout_writer.flush(); // Don't forget to flush!
}

test "simple test" {
    const gpa = std.testing.allocator;
    var list: std.ArrayList(i32) = .empty;
    defer list.deinit(gpa); // Try commenting this out and see if zig detects the memory leak!
    try list.append(gpa, 42);
    try std.testing.expectEqual(@as(i32, 42), list.pop());
}

test "fuzz example" {
    const Context = struct {
        fn testOne(context: @This(), input: []const u8) anyerror!void {
            _ = context;
            // Try passing `--fuzz` to `zig build test` and see if it manages to fail this test case!
            try std.testing.expect(!std.mem.eql(u8, "canyoufindme", input));
        }
    };
    try std.testing.fuzz(Context{}, Context.testOne, .{});
}
```

- src/root.zig

```zig
//! By convention, root.zig is the root source file when making a package.
const std = @import("std");
const Io = std.Io;

/// This is a documentation comment to explain the `printAnotherMessage` function below.
///
/// Accepting an `Io.Writer` instance is a handy way to write reusable code.
pub fn printAnotherMessage(writer: *Io.Writer) Io.Writer.Error!void {
    try writer.print("Run `zig build test` to run the tests.\n", .{});
}

pub fn add(a: i32, b: i32) i32 {
    return a + b;
}

test "basic add functionality" {
    try std.testing.expect(add(3, 7) == 10);
}
```

Another language to learn added to the list!
