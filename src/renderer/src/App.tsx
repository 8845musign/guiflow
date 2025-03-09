import React, { useState } from "react";
import Editor from "./Editor";
import "../../css/main.css";

function App(): JSX.Element {
  const [value, setValue] = useState<string>("");

  return (
    <div className="editor-container">
      <Editor value={value} onChange={setValue} />
    </div>
  );
}

export default App;
