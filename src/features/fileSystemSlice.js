import { createSlice } from "@reduxjs/toolkit";
import initialData from "../data/fileSystem.json";

const findNode = (draft, path) => {
  const segments = path[0] === draft.name ? path.slice(1) : path;
  return segments.reduce(
    (current, name) => current.children.find((c) => c.name === name),
    draft
  );
};

const fileSystemSlice = createSlice({
  name: "fileSystem",
  initialState: initialData,
  reducers: {
    addNode: (state, { payload }) => {
      const { parentPath, node } = payload;
      if (!node.name) throw new Error("Name cannot be empty");
      const parent = findNode(state, parentPath);
      if (!parent || parent.type !== "folder") return;
      if (parent.children.some((c) => c.name === node.name))
        throw new Error("Name already exists");
      if (node.type === "folder" && !Array.isArray(node.children))
        node.children = [];
      parent.children.push(node);
    },
    renameNode: (state, { payload }) => {
      const { path, newName } = payload;
      if (!newName) throw new Error("Name cannot be empty");
      const parentPath = path.slice(0, -1);
      const parent = findNode(state, parentPath);
      if (!parent) return;
      if (parent.children.some((c) => c.name === newName))
        throw new Error("Name already exists");
      const target = parent.children.find(
        (c) => c.name === path[path.length - 1]
      );
      if (target) target.name = newName;
    },
    deleteNode: (state, { payload }) => {
      const { path } = payload;
      const parentPath = path.slice(0, -1);
      const parent = findNode(state, parentPath);
      if (!parent) return;
      const idx = parent.children.findIndex(
        (c) => c.name === path[path.length - 1]
      );
      if (idx !== -1) parent.children.splice(idx, 1);
    },
    moveNode: (state, { payload }) => {
      const { sourcePath, destPath } = payload;
      const sourceParentPath = sourcePath.slice(0, -1);
      const sourceParent = findNode(state, sourceParentPath);
      const idx = sourceParent.children.findIndex(
        (c) => c.name === sourcePath[sourcePath.length - 1]
      );
      if (idx === -1) return;
      const [node] = sourceParent.children.splice(idx, 1);
      const dest = findNode(state, destPath);
      if (!dest || dest.type !== "folder") return;
      if (dest.children.some((c) => c.name === node.name))
        throw new Error("Name already exists in destination");
      dest.children.push(node);
    },
  },
});

export const { moveNode, addNode, renameNode, deleteNode } =
  fileSystemSlice.actions;
export default fileSystemSlice.reducer;
