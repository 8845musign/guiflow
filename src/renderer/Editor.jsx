import React, { useRef, useEffect } from 'react';
import { Editor as MonacoEditor } from '@monaco-editor/react';
import editor from './editor.js';

function Editor({ value, onChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    // エディターが初期化された後、既存のeditor.jsモジュールと連携
    if (editorRef.current) {
      const originalSetValue = editor.setValue;
      
      // 既存のeditor.jsのsetValue関数をオーバーライド
      editor.setValue = (newValue) => {
        onChange(newValue);
        return originalSetValue.call(editor, newValue);
      };
      
      // 既存のeditor.jsの初期値を設定
      if (value) {
        editor.setValue(value);
      }
    }
  }, [editorRef.current]);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleChange = (value) => {
    onChange(value);
    editor.emit('change', value);
  };

  return (
    <MonacoEditor
      height="100vh"
      defaultLanguage="plaintext"
      value={value}
      onChange={handleChange}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true
      }}
    />
  );
}

export default Editor;
