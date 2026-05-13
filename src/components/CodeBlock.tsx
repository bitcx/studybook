// Copyright (C) 2026 bitcx and Contributors. Licensed under Apache License 2.0.
import React from 'react';
import { tokenizeLine } from '../utils/highlight';
import type { HighlightRule } from '../types/highlight';

interface CodeBlockProps {
  code: string;
  lang?: string;
  rules: HighlightRule[];
  title?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, rules, title }) => {
  const lines = code.split('\n');

  return (
    <div>
      {title && (
        <div
          style={{
            background: '#2a4a9a',
            color: 'white',
            fontSize: '11px',
            fontWeight: 'bold',
            padding: '2px 8px',
            fontFamily: 'MS Sans Serif, Microsoft Sans Serif, Arial, sans-serif',
          }}
        >
          {title}
        </div>
      )}
      <div className="win95-code">
        {lines.map((line, lineIdx) => {
          const tokens = tokenizeLine(line, rules);
          return (
            <div key={lineIdx} style={{ minHeight: '1.6em' }}>
              {tokens.map((token, tokenIdx) => (
                <span
                  key={tokenIdx}
                  style={{
                    color: token.color,
                    fontWeight: token.bold ? 'bold' : 'normal',
                    fontStyle: token.italic ? 'italic' : 'normal',
                  }}
                >
                  {token.text}
                </span>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CodeBlock;
