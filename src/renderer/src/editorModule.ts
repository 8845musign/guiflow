import EventEmitter from "eventemitter3";
import "ace-builds";
import "ace-builds/webpack-resolver";

const fs = window.requires.fs;
const clipboard = window.requires.clipboard;

let editor: AceEditor | null = null;
let EDITOR_FILE_NAME: string | undefined;
let EDITOR_FILE_VALUE: string | undefined;

const emitter = new EventEmitter();

window.addEventListener("load", () => {
  // eslint-disable-next-line
  editor = window.ace.edit("text");
  if (editor) {
    editor.$blockScrolling = Infinity;
    if (window.process.platform === "darwin") {
      editor.commands.bindKey("Ctrl-P", "golineup");
    }
    editor.setTheme("ace/theme/monokai");
    setInterval(function () {
      if (editor && editor.getValue() !== EDITOR_FILE_VALUE) {
        emitter.emit("diff", EDITOR_FILE_NAME);
      } else {
        emitter.emit("same", EDITOR_FILE_NAME);
      }
    }, 1000);

    let PREV = editor.getValue();

    setInterval(function () {
      if (editor) {
        const now = editor.getValue();
        if (PREV !== now) {
          PREV = now;
          emitter.emit("change", now);
        }
      }
    }, 500);
  }
});

const waitEditorReady = (): Promise<void> => {
  return new Promise((res) => {
    if (editor) {
      res();
    } else {
      const id = setInterval(() => {
        if (editor) {
          clearInterval(id);
          res();
        }
      });
    }
  });
};

const getFileName = (forceDialog: boolean): Promise<string | undefined> => {
  return new Promise((res) => {
    if (!forceDialog && EDITOR_FILE_NAME) {
      return res(EDITOR_FILE_NAME);
    } else {
      const result = window.file.save();

      result
        .then((fileName) => {
          if (fileName) {
            res(fileName);
          } else {
            res(undefined);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });
};

const saveFile = (fileName?: string): Promise<string> => {
  return new Promise((res, rej) => {
    if (!fileName) {
      return res("canceled");
    }
    if (!editor) {
      return rej(new Error("Editor not initialized"));
    }

    const code = editor.getValue();
    // fs.writeFile(fileName, code, function (err: Error | null) {
    //   if (err) return rej(err);
    //   EDITOR_FILE_NAME = fileName;
    //   EDITOR_FILE_VALUE = code;
    //   return res(fileName);
    // });
  });
};

const copy = (): Promise<void> => {
  return new Promise((res) => {
    if (!editor) {
      res();
      return;
    }
    const text = editor.getCopyText();
    // clipboard.writeText(text);
    res();
  });
};

interface EditorApi {
  open: (event: any, fileName: string) => void;
  save: () => void;
  saveAs: () => Promise<string>;
  copy: () => Promise<void>;
  clearError: () => void;
  on: (channel: string, cb: (...args: any[]) => void) => void;
}

const editorApi: EditorApi = {
  open: (_, fileName: string) => {
    EDITOR_FILE_NAME = fileName;

    try {
      // EDITOR_FILE_NAME = fileName;
      // const code = fs.readFileSync(fileName, {
      //   encoding: "utf-8",
      // });
      // EDITOR_FILE_VALUE = code;
      // const set = setInterval(() => {
      //   if (editor) {
      //     editor.setValue(code);
      //     editor.navigateLineEnd();
      //     editor.focus();
      //     clearInterval(set);
      //   }
      // }, 100);
    } catch (error) {
      console.error(error);
    }
  },

  save() {
    getFileName(false).then((fileName) => {
      saveFile(fileName);
    });
  },

  saveAs: async () => {
    await waitEditorReady();
    const fileName = await getFileName(true);
    return saveFile(fileName);
  },

  copy: async () => {
    await waitEditorReady();
    return copy();
  },

  clearError() {
    if (editor) {
      editor.getSession().setAnnotations([]);
    }
  },

  on: function (channel: string, cb: (...args: any[]) => void) {
    emitter.on(channel, cb);
  },
};

export default editorApi;
