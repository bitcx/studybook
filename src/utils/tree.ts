// Copyright (C) 2026 bitcx and Contributors. Licensed under Apache License 2.0.
import type { PageNode } from '../types/page';

// converts a filename slug to a readable label
function slugToLabel(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// strips leading number prefix used for ordering, e.g. "01-introduction" -> "introduction"
function stripOrder(name: string): string {
  return name.replace(/^\d+[-_]/, '');
}

// builds the page tree from the vite import.meta.glob result
// keys are paths like "/pages/getting-started/installation.md"
export function buildTree(paths: string[]): PageNode[] {
  const root: PageNode[] = [];

  // sort paths alphabetically so order prefixes work
  const sorted = [...paths].sort();

  for (const fullPath of sorted) {
    // strip leading /pages/ prefix
    const relative = fullPath.replace(/^\/pages\//, '');
    const parts = relative.split('/');

    let currentLevel = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;

      if (isLast) {
        // leaf node = md file
        const slug = part.replace(/\.md$/, '');
        if (slug === 'index') {
          // index.md becomes the section's own page
          const sectionNode = currentLevel.find((n) => n.isSection);
          if (sectionNode) {
            sectionNode.filePath = fullPath;
          }
        } else {
          const cleanSlug = stripOrder(slug);
          const navPath = buildNavPath(parts.slice(0, i), cleanSlug);
          currentLevel.push({
            label: slugToLabel(cleanSlug),
            path: navPath,
            filePath: fullPath,
            children: [],
            isSection: false,
          });
        }
      } else {
        // intermediate part = folder = section
        const cleanPart = stripOrder(part);
        let section = currentLevel.find(
          (n) => n.isSection && n.label === slugToLabel(cleanPart)
        );

        if (!section) {
          const navPath = buildNavPath(
            parts.slice(0, i).map(stripOrder),
            cleanPart
          );
          section = {
            label: slugToLabel(cleanPart),
            path: navPath,
            filePath: null,
            children: [],
            isSection: true,
          };
          currentLevel.push(section);
        }

        currentLevel = section.children;
      }
    }
  }

  return root;
}

// builds the url nav path from folder parts and a final slug
function buildNavPath(folderParts: string[], finalSlug: string): string {
  const cleanParts = folderParts.map(stripOrder);
  const all = [...cleanParts, finalSlug];
  return '/' + all.join('/');
}
