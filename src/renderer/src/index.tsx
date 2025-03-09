import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import $ from "jquery";
import editor from "./editorModule";
import diagram from "./diagram";

// Reactコンポーネントをレンダリング
const container = document.getElementById("app");

if (container) {
  ReactDOM.createRoot(container).render(<App />);
}

[
  "open",
  "save",
  "saveAs",
  // 'undo',
  // 'redo',
  // 'cut',
  "copy",
  // 'paste',
  // 'selectAll',
].forEach((channel) => {
  window.api.on(channel, (event: any, argv: any) => {
    if (channel in editor) {
      (editor as any)[channel](event, argv);
    }
  });
});

// eslint-disable-next-line
const clipboard = window.requires.clipboard;
// eslint-disable-next-line
const nativeImage = window.requires.nativeImage;

$(function () {
  $(window).on("load resize", function () {
    const windowHeight = $(window).height();
    if (windowHeight !== undefined) {
      $(".main").height(windowHeight);
    }
  });

  editor.on("change", function (code: string) {
    window.uiflow
      .compile(code)
      .then((data: any) => {
        editor.clearError();
        return data;
      })
      .then(diagram.refresh)
      .catch((error: Error) => {
        console.error(error);
      });
  });

  editor.on("same", function (fileName: string | undefined) {
    document.title = "guiflow -- " + (fileName || "Untitled") + " = ";
  });

  editor.on("diff", function (fileName: string | undefined) {
    document.title = "guiflow -- " + (fileName || "Untitled") + " + ";
  });
});
