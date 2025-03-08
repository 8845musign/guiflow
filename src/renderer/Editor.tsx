import React, { useRef, useEffect } from 'react';
import { Editor as MonacoEditor } from '@monaco-editor/react';
import editor from './editorModule';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

function Editor({ value, onChange }: EditorProps): JSX.Element {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    // エディターが初期化された後、既存のeditor.jsモジュールと連携
    if (editorRef.current) {
      const originalSetValue = (editor as any).setValue;
      
      // 既存のeditor.jsのsetValue関数をオーバーライド
      (editor as any).setValue = (newValue: string) => {
        onChange(newValue);
        return originalSetValue.call(editor, newValue);
      };
      
      // 既存のeditor.jsの初期値を設定
      if (value) {
        (editor as any).setValue(value);
      }
    }
  }, [editorRef.current]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
      (editor as any).emit('change', value);
    }
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
