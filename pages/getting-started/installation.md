<!-- Copyright (C) 2026 bitcx and Contributors. Licensed under Apache License 2.0. -->
# Installation

## Requirements

- A 64-bit operating system (Linux, macOS, or Windows)
- At least 50 MB of free disk space

## Download

Download the latest release from the [GitHub releases page](https://github.com/bitcmp/bit/releases).

## Linux / macOS

```bash
curl -fsSL https://bit-lang.org/install.sh | sh
```

Then add `~/.bit/bin` to your PATH:

```bash
export PATH="$HOME/.bit/bin:$PATH"
```

## Windows

Download the `.msi` installer and follow the setup wizard.

## Verify Installation

```bash
bit --version
```

You should see output like:

```
Bit 0.1.0 (stable)
```
