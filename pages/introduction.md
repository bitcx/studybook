<!-- Copyright (C) 2026 bitcx and Contributors. Licensed under Apache License 2.0. -->
# Introduction

Welcome to **Bit** — a statically typed, compiled programming language designed for simplicity and performance.<br>
The syntax is minimal and readable, making it easy to learn while remaining powerful enough for systems programming.

## Why Bit?

- No runtime type errors
- Native machine code output
- Simple, consistent syntax
- Ownership memory

## Quick Start

Install the compiler and run your first program:

```bit
define main() {
    immut name:str = "World";
    print("Hello, {0}!", &name);
}
```
