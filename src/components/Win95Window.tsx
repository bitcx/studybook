// Copyright (C) 2026 bitcx and Contributors. Licensed under Apache License 2.0.
import React from 'react';

interface Win95WindowProps {
  title: string;
  children: React.ReactNode;
  width?: number | string;
}

const Win95Window: React.FC<Win95WindowProps> = ({ title, children, width = 680 }) => {
  return (
    <div
      className="win95-window"
      style={{ width: typeof width === 'number' ? `${width}px` : width, maxWidth: '100%' }}
    >
      <div className="win95-titlebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="2" width="10" height="13" fill="#ffffff" stroke="#808080" strokeWidth="1" />
            <rect x="3" y="1" width="10" height="13" fill="#ffffff" stroke="#808080" strokeWidth="1" />
            <line x1="5" y1="5" x2="11" y2="5" stroke="#000080" strokeWidth="1" />
            <line x1="5" y1="7" x2="11" y2="7" stroke="#000080" strokeWidth="1" />
            <line x1="5" y1="9" x2="9" y2="9" stroke="#000080" strokeWidth="1" />
          </svg>
          <span style={{ fontSize: '12px' }}>{title}</span>
        </div>
        <div style={{ display: 'flex', gap: '2px' }}>
          <div className="win95-titlebar-btn">_</div>
          <div className="win95-titlebar-btn">□</div>
          <div className="win95-titlebar-btn">✕</div>
        </div>
      </div>
      <div className="win95-menubar">
        <a href="https://bitcx.github.io" target="_blank" rel="noopener noreferrer" className="win95-menu-item"><u>H</u>ome</a>
        <a href="https://github.com/bitcx" target="_blank" rel="noopener noreferrer" className="win95-menu-item"><u>G</u>itHub</a>
      </div>
      <div style={{ padding: '0' }}>
        {children}
      </div>
    </div>
  );
};

export default Win95Window;
