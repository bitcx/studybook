// Copyright (C) 2026 bitcx and Contributors. Licensed under Apache License 2.0.
import React, { useState, useEffect } from 'react';
import { HashRouter, useLocation, useNavigate } from 'react-router-dom';
import Win95Window from './components/Win95Window';
import TreeNode from './components/TreeNode';
import MarkdownRenderer from './components/MarkdownRenderer';
import { buildTree } from './utils/tree';
import type { PageNode } from './types/page';
import type { HighlightConfig } from './types/highlight';
import highlightYamlRaw from '../highlight.yaml?raw';

const PAGE_MODULES = import.meta.glob('/pages/**/*.md', { query: '?raw', import: 'default' });

function AppContent() {
  const [tree, setTree] = useState<PageNode[]>([]);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [highlightConfig] = useState<HighlightConfig>(() => parseHighlightYaml(highlightYamlRaw));

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const paths = Object.keys(PAGE_MODULES);
    const built = buildTree(paths);
    setTree(built);
  }, []);

  useEffect(() => {
    const currentPath = location.pathname || '/';
    const node = findNode(tree, currentPath);

    if (node && node.filePath) {
      setLoading(true);
      const loader = PAGE_MODULES[node.filePath];
      if (loader) {
        (loader as () => Promise<string>)().then((text) => {
          setContent(text as string);
          setLoading(false);
        });
      }
    } else if (tree.length > 0) {
      const first = findFirstPage(tree);
      if (first) navigate(first, { replace: true });
    }
  }, [location.pathname, tree, navigate]);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Win95Window title="Bit Book" width="100%">
      <div style={{ display: 'flex', height: 'calc(100vh - 140px)', minHeight: '400px' }}>
        <div
          style={{
            width: '220px',
            flexShrink: 0,
            borderRight: '2px solid #808080',
            overflowY: 'auto',
            background: '#c0c0c0',
            padding: '4px 0',
          }}
        >
          <div
            style={{
              fontSize: '11px',
              fontWeight: 'bold',
              fontFamily: 'MS Sans Serif, Microsoft Sans Serif, Arial, sans-serif',
              padding: '4px 8px',
              color: '#000080',
              borderBottom: '1px solid #808080',
              marginBottom: '4px',
              userSelect: 'none',
            }}
          >
            Contents
          </div>
          {tree.map((node) => (
            <TreeNode
              key={node.path}
              node={node}
              currentPath={location.pathname || '/'}
              depth={0}
              onNavigate={handleNavigate}
            />
          ))}
        </div>

        <div
          style={{
            flex: 1,
            overflow: 'auto',
            background: '#ffffff',
            borderTop: '2px solid #808080',
            borderLeft: '2px solid #808080',
            borderRight: '2px solid #ffffff',
            borderBottom: '2px solid #ffffff',
            margin: '6px',
            padding: '16px',
          }}
        >
          {loading ? (
            <div
              style={{
                fontFamily: 'MS Sans Serif, Microsoft Sans Serif, Arial, sans-serif',
                fontSize: '12px',
                color: '#808080',
              }}
            >
              Loading...
            </div>
          ) : content ? (
            <MarkdownRenderer content={content} rules={highlightConfig.rules} />
          ) : (
            <div
              style={{
                fontFamily: 'MS Sans Serif, Microsoft Sans Serif, Arial, sans-serif',
                fontSize: '12px',
                color: '#808080',
              }}
            >
              Select a page from the left panel.
            </div>
          )}
        </div>
      </div>
    </Win95Window>
  );
}

const App: React.FC = () => {
  return (
    <HashRouter>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '24px 16px 48px',
          minHeight: '100vh',
          width: '100%',
          background: '#008080',
        }}
      >
        <div style={{ width: '100%', maxWidth: '900px' }}>
          <AppContent />
        </div>
      </div>
    </HashRouter>
  );
};

function findFirstPage(nodes: PageNode[]): string | null {
  for (const node of nodes) {
    if (!node.isSection && node.filePath) return node.path;
    if (node.isSection) {
      const found = findFirstPage(node.children);
      if (found) return found;
    }
  }
  return null;
}

function findNode(nodes: PageNode[], path: string): PageNode | null {
  for (const node of nodes) {
    if (node.path === path) return node;
    if (node.isSection) {
      const found = findNode(node.children, path);
      if (found) return found;
    }
  }
  return null;
}

function parseHighlightYaml(text: string): HighlightConfig {
  const rules: HighlightConfig['rules'] = [];
  const lines = text.split('\n');
  let current: Record<string, string> | null = null;

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith('  - name:')) {
      if (current && current.name && current.pattern && current.color) {
        rules.push({
          name: current.name,
          pattern: current.pattern,
          color: current.color,
          bold: current.bold === 'true',
          italic: current.italic === 'true',
        });
      }
      current = { name: line.split(':')[1].trim() };
      continue;
    }
    if (!current) continue;
    const patternMatch = line.match(/^\s+pattern:\s+"(.*)"$/);
    if (patternMatch) { current.pattern = JSON.parse('"' + patternMatch[1] + '"'); continue; }
    const colorMatch = line.match(/^\s+color:\s+"(.*)"$/);
    if (colorMatch) { current.color = colorMatch[1]; continue; }
    const boldMatch = line.match(/^\s+bold:\s+(.+)$/);
    if (boldMatch) { current.bold = boldMatch[1].trim(); continue; }
    const italicMatch = line.match(/^\s+italic:\s+(.+)$/);
    if (italicMatch) { current.italic = italicMatch[1].trim(); continue; }
  }

  if (current && current.name && current.pattern && current.color) {
    rules.push({
      name: current.name,
      pattern: current.pattern,
      color: current.color,
      bold: current.bold === 'true',
      italic: current.italic === 'true',
    });
  }

  return { rules };
}

export default App;
