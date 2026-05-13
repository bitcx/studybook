<!-- Copyright (C) 2026 bitcx and Contributors. Licensed under Apache License 2.0. -->
# Ownership

Bit uses a simple ownership model to manage memory without a garbage collector.

## Move Semantics

When you pass a variable to a function, ownership is transferred:

```bit
mut x:i32 = 5;
print("{0}", x);  # x is moved and dropped here
```

After this point, `x` is no longer accessible.

## Borrowing with References

To keep a variable alive, pass it by reference using `&`:

```bit
mut x:i32 = 5;
print("{0}", &x);  # x is borrowed, not moved
print("{0}", &x);  # still usable
```

## Why Ownership?

- No garbage collector pauses
- Memory is freed deterministically
- Prevents use-after-free bugs at compile time
