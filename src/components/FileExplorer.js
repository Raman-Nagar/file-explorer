
import React, { useState } from 'react';
import FileNode from './FileNode';
import FileContent from './FileContent';
import { useSelector } from 'react-redux';

export default function FileExplorer({ selectedPath, onSelect }) {
  const tree = useSelector(s => s.fileSystem);
  const [filter, setFilter] = useState('');

  const filterTree = (node) => {
    if (!filter) return node;
    const match = node.name.toLowerCase().includes(filter.toLowerCase());
    if (node.type === 'folder') {
      const children = node.children
        .map(filterTree)
        .filter(n => n !== null);
      if (match || children.length) return { ...node, children };
    } else if (match) {
      return node;
    }
    return null;
  };

  const filtered = filterTree(tree);

  return (
    <div className="explorer-container">
      <aside className="sidebar">
        <input
          className="search"
          placeholder="Search..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        {filtered ? (
          <FileNode node={filtered} path={[]} onSelect={onSelect} />
        ) : (
          <p className="no-results">No matches</p>
        )}
      </aside>
      <main className="content-area">
        <FileContent path={selectedPath} />
      </main>
    </div>
  );
}
