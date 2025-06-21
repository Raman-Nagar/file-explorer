import { useState } from "react";
import { useDispatch } from "react-redux";
import { useDrag, useDrop } from "react-dnd";
import {
  addNode,
  renameNode,
  deleteNode,
  moveNode,
} from "../features/fileSystemSlice";
import {
  FaFolder,
  FaFolderOpen,
  FaFile,
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

export default function FileNode({ node, path, onSelect }) {
  const [expanded, setExpanded] = useState(true);
  const [fileInput, setFileInput] = useState(false);

  const dispatch = useDispatch();
  const fullPath = [...path, node.name];
  const isFile = node.type === "file";

  const [{ isOver }, dropRef] = useDrop({
    accept: "node",
    drop: (item) =>
      dispatch(moveNode({ sourcePath: item.path, destPath: fullPath })),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  const [{}, dragRef] = useDrag({
    type: "node",
    item: { path: fullPath },
    canDrag: () => path.length > 0, // don't drag the root
  });

  const handleToggle = () => {
    if (!isFile) setExpanded(!expanded);
  };

  const handleCreate = (t) => {
    setFileInput(false);
    try {
      const name = window.prompt("Name:");
      dispatch(
        addNode({
          parentPath: fullPath,
          node: { name, type: t, ...(t === "folder" ? { children: [] } : {}) },
        })
      );
    } catch (e) {
      alert(e.message);
    }
  };

  const handleRename = () => {
    try {
      const name = window.prompt("New name:", node.name);
      dispatch(renameNode({ path: fullPath, newName: name }));
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Delete ${node.name}?`)) {
      dispatch(deleteNode({ path: fullPath }));
    }
  };

  return (
    <div ref={dropRef} className={`file-node${isOver ? " over" : ""}`}>
      <div ref={dragRef} className="node-header" onClick={handleToggle}>
        {isFile ? (
          <FaFile color="gray" />
        ) : expanded ? (
          <FaFolderOpen color="orange" />
        ) : (
          <FaFolder color="orange" />
        )}
        <span
          className={isFile ? "clickable" : ""}
          onClick={(e) => {
            e.stopPropagation();
            isFile && onSelect(fullPath);
          }}
        >
          {node.name}
        </span>
        <div className="actions">
          {!isFile && (
            <div className="add-menu" onMouseLeave={() => setFileInput(false)}>
              <FaPlus
                onClick={(e) => {
                  e.stopPropagation();
                  setFileInput((bool) => !bool);
                }}
                color="blue"
              />
              {fileInput && (
                <div className="menu">
                  <button
                    className="menu-item"
                    onClick={() => handleCreate("folder")}
                  >
                    Folder
                  </button>
                  <button
                    className="menu-item"
                    onClick={() => handleCreate("file")}
                  >
                    File
                  </button>
                </div>
              )}
            </div>
          )}
          {node.name !== "root" && (
            <>
              <FaEdit
                onClick={(e) => {
                  e.stopPropagation();
                  handleRename();
                }}
                color="green"
              />
              <FaTrash
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                color="orangered"
              />
            </>
          )}
        </div>
      </div>
      {expanded && node.children && (
        <div className="node-children">
          {node.children.map((c, i) => (
            <FileNode key={i} node={c} path={fullPath} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
