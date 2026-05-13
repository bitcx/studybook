// Copyright (C) 2026 bitcx and Contributors. Licensed under Apache License 2.0.
import React, { useState } from 'react';
import type { PageNode } from '../types/page';

interface TreeNodeProps {
  node: PageNode;
  currentPath: string;
  depth: number;
  onNavigate: (path: string) => void;
}

// folder icon (closed)
const FolderIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <rect x="1" y="5" width="14" height="9" fill="#FFDF00" stroke="#808000" strokeWidth="1" />
    <path d="M1 5 L1 3 L6 3 L7 5" fill="#FFDF00" stroke="#808000" strokeWidth="1" />
  </svg>
);

// folder icon (open)
const FolderOpenIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <path d="M1 5 L1 3 L6 3 L7 5 L14 5 L12 13 L1 13 Z" fill="#FFDF00" stroke="#808000" strokeWidth="1" />
    <path d="M2 5 L15 5 L13 13" fill="#FFDF00" stroke="#808000" strokeWidth="1" />
  </svg>
);

// page icon
const PageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <rect x="2" y="1" width="10" height="13" fill="#ffffff" stroke="#808080" strokeWidth="1" />
    <path d="M9 1 L12 4 L9 4 Z" fill="#c0c0c0" stroke="#808080" strokeWidth="1" />
    <line x1="4" y1="6" x2="11" y2="6" stroke="#808080" strokeWidth="1" />
    <line x1="4" y1="8" x2="11" y2="8" stroke="#808080" strokeWidth="1" />
    <line x1="4" y1="10" x2="9" y2="10" stroke="#808080" strokeWidth="1" />
  </svg>
);

const TreeNode: React.FC<TreeNodeProps> = ({ node, currentPath, depth, onNavigate }) => {
  const [expanded, setExpanded] = useState(
    // auto-expand if current page is inside this section
    currentPath.startsWith(node.path)
  );

  const isActive = currentPath === node.path;
  const indent = depth * 14;

  if (node.isSection) {
    return (
      <div>
        <div
          className={`tree-item${isActive ? ' active' : ''}`}
          style={{ paddingLeft: indent + 4 }}
          onClick={() => {
            setExpanded((prev) => !prev);
            if (node.filePath) {
              onNavigate(node.path);
            }
          }}
        >
          <span style={{ fontSize: '9px', width: '10px', textAlign: 'center', flexShrink: 0 }}>
            {expanded ? '▾' : '▸'}
          </span>
          {expanded ? <FolderOpenIcon /> : <FolderIcon />}
          <span>{node.label}</span>
        </div>
        {expanded && node.children.map((child) => (
          <TreeNode
            key={child.path}
            node={child}
            currentPath={currentPath}
            depth={depth + 1}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`tree-item${isActive ? ' active' : ''}`}
      style={{ paddingLeft: indent + 14 + 4 }}
      onClick={() => onNavigate(node.path)}
    >
      <PageIcon />
      <span>{node.label}</span>
    </div>
  );
};

export default TreeNode;
