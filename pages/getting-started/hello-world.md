<!-- Copyright (C) 2026 bitcx and Contributors. Licensed under Apache License 2.0. -->
# Hello, World!

Every Bit program starts with a `main` function. Here is the simplest possible program:

```bit
define main() {
    print("Hello, World!");
}
```

## Running the Program

Save this as `hello.bit` and compile it:

```bash
bit run hello.bit
```

## With Variables

```bit
define main() {
    immut greeting:str = "Hello, World!";
    print("{0}", &greeting);
}
```

The `&` operator passes the variable by reference, keeping it alive after the call.
