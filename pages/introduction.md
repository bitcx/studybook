# Introduction

Welcome to **Bit** — a statically typed, compiled programming language designed for simplicity and performance.<br>
The syntax is minimal and readable, making it easy to learn while remaining powerful enough for systems programming.

## Why Bit?

- No runtime type errors
- Simple, consistent syntax
- Ownership memory

## Quick Start

Install the compiler and write your first program:

```bit
# hello.bit
define main() {
    immut name:str = "World";
    print("Hello, {0}!", &name);
}
```

For run:

```bit

bitc hello.bit # run
# or compile & link:
bitc hello.bit -o hello

```
