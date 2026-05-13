// Copyright (C) 2026 bitcx and Contributors. Licensed under Apache License 2.0.
import type { HighlightRule, Token } from '../types/highlight';

// applies highlight rules to a line of code and returns colored tokens
// strings and comments are matched first to prevent keywords matching inside them
export function tokenizeLine(line: string, rules: HighlightRule[]): Token[] {
  if (rules.length === 0) {
    return [{ text: line, color: '#000000', bold: false, italic: false }];
  }

  // prioritize strings and comments so they consume their range first
  const priority = ['string', 'char', 'comment_hash', 'comment_slash'];
  const sorted = [
    ...rules.filter((r) => priority.includes(r.name)),
    ...rules.filter((r) => !priority.includes(r.name)),
  ];

  const parts = sorted.map((r) => `(?<${r.name}>${r.pattern})`);
  const combined = new RegExp(parts.join('|'), 'g');

  const tokens: Token[] = [];
  let lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = combined.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ text: line.slice(lastIndex, match.index), color: '#000000', bold: false, italic: false });
    }

    const groups = match.groups || {};
    // find the first rule whose named group actually captured
    const matchedRule = sorted.find((r) => groups[r.name] !== undefined);

    if (matchedRule) {
      tokens.push({
        text: match[0],
        color: matchedRule.color,
        bold: matchedRule.bold ?? false,
        italic: matchedRule.italic ?? false,
      });
    }

    lastIndex = match.index + match[0].length;
    // if a comment matched, the rest of the line is consumed — stop
    if (matchedRule && (matchedRule.name === 'comment_hash' || matchedRule.name === 'comment_slash')) {
      if (lastIndex < line.length) {
        // shouldn't happen since comment pattern eats to eol, but guard anyway
        tokens.push({ text: line.slice(lastIndex), color: '#000000', bold: false, italic: false });
      }
      break;
    }
  }

  if (lastIndex < line.length) {
    tokens.push({ text: line.slice(lastIndex), color: '#000000', bold: false, italic: false });
  }

  return tokens;
}
