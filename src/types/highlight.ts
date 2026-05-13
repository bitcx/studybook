// Copyright (C) 2026 bitcx and Contributors. Licensed under Apache License 2.0.
// highlight rule from yaml config
export interface HighlightRule {
  name: string;
  pattern: string;
  color: string;
  bold?: boolean;
  italic?: boolean;
}

// parsed highlight config
export interface HighlightConfig {
  rules: HighlightRule[];
}

// token produced by tokenizer
export interface Token {
  text: string;
  color: string;
  bold: boolean;
  italic: boolean;
}
