import React, { useState } from 'react';
import Editor from './Editor';

function App(): JSX.Element {
  const [value, setValue] = useState<string>('');

  return (
    <div className="editor-container">
      <Editor value={value} onChange={setValue} />
    </div>
  );
}

export default App;
