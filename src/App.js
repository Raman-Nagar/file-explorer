import { useState } from "react";
import FileExplorer from "./components/FileExplorer";
import "./App.css";

function App() {
  const [selected, setSelected] = useState([]);

  return (
    <div className="app-container">
      <FileExplorer selectedPath={selected} onSelect={setSelected} />
    </div>
  );
}

export default App;
