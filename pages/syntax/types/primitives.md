<!-- Copyright (C) 2026 bitcx and Contributors. Licensed under Apache License 2.0. -->
# Primitive Types

## Integer Types

| Type | Size | Range |
|------|------|-------|
| i8 | 8-bit | -128 to 127 |
| i16 | 16-bit | -32,768 to 32,767 |
| i32 | 32-bit | -2^31 to 2^31-1 |
| i64 | 64-bit | -2^63 to 2^63-1 |

Unsigned variants: `u8`, `u16`, `u32`, `u64`.

## Float Types

```bit
immut pi:f64 = 3.14159;
immut ratio:f32 = 1.5;
```

## Boolean

```bit
immut flag:bool = true;
```

## String

```bit
immut msg:str = "hello";
```
