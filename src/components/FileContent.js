import { useSelector } from 'react-redux';

export default function FileContent({ path }) {
  const findNode = (node, segments) => {
    return segments.reduce((cur,name)=>cur?.children.find(c=>c.name===name), node);
  };
  const root = useSelector(s=>s.fileSystem);
  const file = findNode(root, path.slice(1));
  if (!file) return <div className="placeholder">Select a file</div>;
  if (file.type !== 'file') return <div className="placeholder">Cannot preview folder</div>;
  return (
    <div className="file-content">
      <h2>{file.name}</h2>
      <p>Preview content for <strong>{file.name}</strong>.</p>
    </div>
  );
}