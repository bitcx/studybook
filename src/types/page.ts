// Copyright (C) 2026 bitcx and Contributors. Licensed under Apache License 2.0.
// a single page or section in the book tree
export interface PageNode {
  // display label derived from filename or folder name
  label: string;
  // url path used for navigation
  path: string;
  // fetch path for the md file content
  filePath: string | null;
  // child nodes if this is a section
  children: PageNode[];
  // whether this node is a section (folder)
  isSection: boolean;
}
