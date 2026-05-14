// Copyright (C) 2026 bitcx and Contributors. Licensed under Apache License 2.0.
import React, { useMemo } from 'react';
import CodeBlock from './CodeBlock';
import type { HighlightRule } from '../types/highlight';

interface MarkdownRendererProps {
  content: string;
  rules: HighlightRule[];
}

// simple markdown parser that handles the common subset
// splits on fenced code blocks first, renders rest as html-like structure
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, rules }) => {
  const segments = useMemo(() => splitCodeBlocks(content), [content]);

  return (
    <div className="md-content">
      {segments.map((seg, idx) => {
        if (seg.type === 'code') {
          return (
            <CodeBlock
              key={idx}
              code={seg.text}
              lang={seg.lang}
              rules={rules}
            />
          );
        }
        return <MarkdownText key={idx} text={seg.text} />;
      })}
    </div>
  );
};

// splits markdown string into code and prose segments
interface Segment {
  type: 'prose' | 'code';
  text: string;
  lang?: string;
}

function splitCodeBlocks(md: string): Segment[] {
  const segments: Segment[] = [];
  const regex = /```(\w*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(md)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'prose', text: md.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'code', lang: match[1] || '', text: match[2].replace(/\n$/, '') });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < md.length) {
    segments.push({ type: 'prose', text: md.slice(lastIndex) });
  }

  return segments;
}

// renders prose markdown to react elements
const MarkdownText: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // br
    if (line.trim() === '<br>' || line.trim() === '<br/>' || line.trim() === '<br />') {
      elements.push(<br key={i} />);
      i++;
      continue;
    }

    // headings
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i}>{inlineFormat(line.slice(4))}</h3>);
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i}>{inlineFormat(line.slice(3))}</h2>);
      i++;
      continue;
    }
    if (line.startsWith('# ')) {
      elements.push(<h1 key={i}>{inlineFormat(line.slice(2))}</h1>);
      i++;
      continue;
    }

    // blockquote
    if (line.startsWith('> ')) {
      elements.push(<blockquote key={i}>{inlineFormat(line.slice(2))}</blockquote>);
      i++;
      continue;
    }

    // unordered list
    if (line.match(/^[-*+] /)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*+] /)) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={i}>
          {items.map((item, j) => <li key={j}>{inlineFormat(item)}</li>)}
        </ul>
      );
      continue;
    }

    // ordered list
    if (line.match(/^\d+\. /)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(lines[i].replace(/^\d+\. /, ''));
        i++;
      }
      elements.push(
        <ol key={i}>
          {items.map((item, j) => <li key={j}>{inlineFormat(item)}</li>)}
        </ol>
      );
      continue;
    }

    // table
    if (line.includes('|') && lines[i + 1]?.match(/^[\s|:-]+$/)) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].includes('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      elements.push(<MarkdownTable key={i} lines={tableLines} />);
      continue;
    }

    // paragraph (non-empty line)
    if (line.trim()) {
      const paraLines: string[] = [];
      while (i < lines.length && lines[i].trim()) {
        paraLines.push(lines[i]);
        i++;
      }
      elements.push(<p key={i}>{inlineFormat(paraLines.join(' '))}</p>);
      continue;
    }

    // empty line
    i++;
  }

  return <>{elements}</>;
};

// renders a markdown table
const MarkdownTable: React.FC<{ lines: string[] }> = ({ lines }) => {
  if (lines.length < 2) return null;

  const parseRow = (line: string) =>
    line.split('|').map((c) => c.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);

  const headers = parseRow(lines[0]);
  const rows = lines.slice(2).map(parseRow);

  return (
    <table>
      <thead>
        <tr>
          {headers.map((h, i) => <th key={i}>{inlineFormat(h)}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => <td key={j}>{inlineFormat(cell)}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// applies inline formatting: bold, italic, code, links
function inlineFormat(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  // match bold, italic, inline code, links in one pass
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    if (match[1] !== undefined) {
      parts.push(<strong key={match.index}>{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      parts.push(<em key={match.index}>{match[2]}</em>);
    } else if (match[3] !== undefined) {
      parts.push(<code key={match.index}>{match[3]}</code>);
    } else if (match[4] !== undefined) {
      parts.push(<a key={match.index} href={match[5]} target="_blank" rel="noopener noreferrer">{match[4]}</a>);
    }
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return parts.length === 1 ? parts[0] : parts;
}

export default MarkdownRenderer;
