<!-- Copyright (C) 2026 bitcx and Contributors. Licensed under Apache License 2.0. -->
# Variables

Bit has two kinds of variable bindings: **mutable** and **immutable**.

## Immutable Variables

Use `immut` to declare a variable that cannot be reassigned:

```bit
immut x:i32 = 42;
immut name:str = "Bit";
```

Attempting to reassign an `immut` variable is a compile-time error.

## Mutable Variables

Use `mut` to declare a variable that can be reassigned:

```bit
mut counter:i32 = 0;
counter += 1;
```

## Type Annotations

Type annotations are always required. There is no type inference:

```bit
mut score:f64 = 9.5;
immut active:bool = true;
```
