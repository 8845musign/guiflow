import React, { useState, useEffect } from 'react';
import Editor from './Editor';

function App() {
  const [value, setValue] = useState('');

  return (
    <div className="editor-container">
      <Editor value={value} onChange={setValue} />
    </div>
  );
}

export default App;