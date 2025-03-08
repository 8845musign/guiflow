// Global type definitions

interface Window {
  requires: {
    clipboard: Electron.Clipboard;
    nativeImage: Electron.NativeImage;
    fs: typeof import('fs');
  };
  process: {
    platform: NodeJS.Platform;
  };
  api: {
    on: (channel: string, callback: (event: any, argv: any) => void) => void;
  };
  uiflow: {
    update: (name: string, code: string, format: string) => Promise<string>;
    compile: (code: string) => Promise<any>;
    base64png: (code: string) => Promise<string>;
  };
  file: {
    save: () => Promise<string | undefined>;
  };
  // Ace editor global
  ace: {
    edit: (selector: string) => AceEditor;
  };
}

interface AceEditor {
  $blockScrolling: number;
  commands: {
    bindKey: (key: string, command: string) => void;
  };
  setTheme: (theme: string) => void;
  getValue: () => string;
  setValue: (value: string) => void;
  navigateLineEnd: () => void;
  focus: () => void;
  getCopyText: () => string;
  getSelection: () => {
    selectAll: () => void;
  };
  getSession: () => {
    getDocument: () => {
      remove: (range: any) => void;
    };
    setAnnotations: (annotations: Array<{
      row: number;
      type: string;
      text: string;
    }>) => void;
  };
  insert: (text: string) => void;
  navigateTo: (line: number, column: number) => void;
  scrollToLine: (line: number, center: boolean, animate: boolean) => void;
  undo: () => void;
  redo: () => void;
}

// Extend NodeJS namespace
declare namespace NodeJS {
  interface ProcessEnv {
    DEBUG?: string;
  }
}
