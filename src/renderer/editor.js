const fs = window.requires.fs;
const clipboard = window.requires.clipboard;
var EventEmitter = require('eventemitter3');

import 'ace-builds';
import 'ace-builds/webpack-resolver';

var editor;
var EDITOR_FILE_NAME;
var EDITOR_FILE_VALUE;

const emitter = new EventEmitter();

window.addEventListener('load', () => {
  // eslint-disable-next-line
  editor = ace.edit("text");
  editor.$blockScrolling = Infinity;
  if (window.process.platform === 'darwin') {
    editor.commands.bindKey('Ctrl-P', 'golineup');
  }
  editor.setTheme('ace/theme/monokai');
  setInterval(function () {
    if (editor.getValue() !== EDITOR_FILE_VALUE) {
      emitter.emit('diff', EDITOR_FILE_NAME);
    } else {
      emitter.emit('same', EDITOR_FILE_NAME);
    }
  }, 1000);
  var PREV = editor.getValue();

  setInterval(function () {
    const now = editor.getValue();
    if (PREV !== now) {
      PREV = now;
      emitter.emit('change', now);
    }
  }, 500);
});

const waitEditorReady = () => {
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

const getFileName = (forceDialog) => {
  return new Promise((res) => {
    if (!forceDialog && EDITOR_FILE_NAME) {
      return res(EDITOR_FILE_NAME);
    } else {
      const result = window.file.save()
      
      result.then((fileName) => {
        if (fileName) {
          res(fileName);
        } else {
          res();
        }
      }).catch((err) => {
        console.error(err);
      });
    }
  });
};

const saveFile = (fileName) => {
  return new Promise((res, rej) => {
    if (!fileName) {
      return res('canceled');
    }
    var code = editor.getValue();
    fs.writeFile(fileName, code, function (err) {
      if (err) return rej(err);
      EDITOR_FILE_NAME = fileName;
      EDITOR_FILE_VALUE = code;
      return res(fileName);
    });
  });
};

const copy = () => {
  return new Promise((res) => {
    const text = editor.getCopyText();
    clipboard.writeText(text);
    res();
  });
};

export default {
  // open: waitEditorReady.and(function (d, ok, ng) {
  //   var fileName = d[1];
  //   EDITOR_FILE_NAME = fileName;
  //   fs.readFile(fileName, function (err, cont) {
  //     if (err) {
  //       ng(err);
  //     } else {
  //       var code = String(cont);
  //       EDITOR_FILE_VALUE = code;
  //       editor.setValue(code);
  //       editor.navigateLineEnd();
  //       editor.focus();
  //       ok(cont);
  //     }
  //   });
  // }),
  save() {
    getFileName(false).then((fileName) => {
      saveFile(fileName);
    });
  },
  // saveAs: waitEditorReady
  //   .and(getFileName(true))
  //   .and(saveFile),

  // undo: waitEditorReady.and(function () {
  //   editor.undo();
  // }),
  // redo: waitEditorReady.and(function () {
  //   editor.redo();
  // }),
  // // eslint-disable-next-line
  // cut: waitEditorReady.and(copy).and(function (d) {
  //   var target = editor.getSelectionRange();
  //   editor.getSession().getDocument().remove(target);
  // }),
  copy: () => {
    return waitEditorReady.then(() => {
      return copy();
    });
  },
  // paste: waitEditorReady.and(function () {
  //   var text = clipboard.readText();
  //   editor.insert(text);
  // }),
  // selectAll: waitEditorReady.and(function () {
  //   editor.getSelection().selectAll();
  // }),
  // value: waitEditorReady.and(function () {
  //   return editor.getValue();
  // }),
  // setError: waitEditorReady.and(function (err) {
  //   var errorInfo = err.message.split(/:/g);
  //   //eslint-disable-next-line
  //   var fileName = errorInfo[0];
  //   var line = errorInfo[1];
  //   var text = errorInfo[3] + errorInfo[4];
  //   editor.getSession().setAnnotations([{
  //     row: line,
  //     type: 'error',
  //     text: text,
  //   }]);
  // }),
  clearError() {
    // FIXME wait editor
    editor.getSession().setAnnotations([]);
  },
  // navigateTo: waitEditorReady.through(function (d) {
  //   editor.navigateTo(d, 0);
  //   editor.focus();
  //   editor.scrollToLine(d, true, true);
  // }),
  // insert: waitEditorReady.through(function (d) {
  //   editor.setValue(editor.getValue() + d);
  //   editor.navigateLineEnd();
  //   editor.focus();
  // }),
  on: function (channel, cb) {
    emitter.on(channel, cb);
  },
};
