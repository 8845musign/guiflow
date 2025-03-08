import * as path from "path";
import { app, BrowserWindow, Menu, dialog, ipcMain } from "electron";

app.on("window-all-closed", function () {
  app.quit();
});

import { exec } from "child_process";

const warn = function (message: string): void {
  dialog.showMessageBox({
    type: "warning",
    title: "warning",
    message: message,
    buttons: ["close"],
  });
};

const sendToFocusedBrowser = function (channel: string) {
  return function (): void {
    const win = BrowserWindow.getFocusedWindow();
    if (!win) {
      return warn("no selected window");
    }
    win.webContents.send(channel);
  };
};

const mainMenu = {
  label: app.getName(),
  submenu: [
    {
      label: "About guiflow",
      click: function () {
        dialog.showMessageBox({
          type: "info",
          title: "about guiflow",
          message: "version : 0.01",
          buttons: ["close"],
        });
      },
    },
    {
      type: "separator",
    },
    {
      label: "Quit",
      accelerator: "CmdOrCtrl+Q",
      click: function () {
        app.quit();
      },
    },
    {
      label: "Toggle Full Screen",
      accelerator: "F11",
      click: function () {
        const win = BrowserWindow.getFocusedWindow();
        if (win) {
          win.setFullScreen(!win.isFullScreen());
        }
      },
    },
    {
      label: "Toggle Dev Tool",
      accelerator: "F5",
      click: function () {
        const win = BrowserWindow.getFocusedWindow();
        if (win) {
          win.toggleDevTools();
        }
      },
    },
  ],
};

const fileMenu = {
  label: "File",
  submenu: [
    {
      label: "New File",
      accelerator: "CmdOrCtrl+N",
      click: function () {
        createWindow();
      },
    },
    {
      label: "Open...",
      accelerator: "CmdOrCtrl+O",

      click: async () => {
        const result = await dialog.showOpenDialog({
          defaultPath: app.getPath("userDesktop"),
          properties: ["openFile"],
          filters: [
            {
              name: "Documents",
              extensions: ["txt", "md", "text"],
            },
          ],
        });

        if (result.canceled) return;

        createWindow(result.filePaths[0]);
      },
    },
    {
      label: "Save",
      accelerator: "CmdOrCtrl+S",
      onlyFocusedWindow: true,
      click: sendToFocusedBrowser("save"),
    },
    {
      label: "Save As...",
      accelerator: "Shift+CmdOrCtrl+S",
      click: sendToFocusedBrowser("saveAs"),
    },
  ],
};

const editMenu = {
  label: "Edit",
  submenu: [
    {
      label: "Undo",
      accelerator: "CmdOrCtrl+Z",
      click: sendToFocusedBrowser("undo"),
    },
    {
      label: "Redo",
      accelerator: "CmdOrCtrl+Y",
      click: sendToFocusedBrowser("redo"),
    },
    {
      type: "separator",
    },
    {
      label: "Cut",
      accelerator: "CmdOrCtrl+X",
      click: sendToFocusedBrowser("cut"),
    },
    {
      label: "Copy",
      accelerator: "CmdOrCtrl+C",
      click: sendToFocusedBrowser("copy"),
    },
    {
      label: "Paste",
      accelerator: "CmdOrCtrl+V",
      click: sendToFocusedBrowser("paste"),
    },
    {
      label: "Select All",
      accelerator: "CmdOrCtrl+A",
      click: sendToFocusedBrowser("selectAll"),
    },
  ],
};

const createWindow = function (fileName?: string): BrowserWindow {
  let mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    title: "guiflow -- " + (fileName ? fileName : "Untitled"),
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on("closed", function () {
    mainWindow = null as any;
  });

  if (fileName) {
    setTimeout(() => {
      mainWindow.webContents.send("open", fileName);
    }, 3000);
  }

  if (process.env.DEBUG) {
    mainWindow.toggleDevTools();
  }

  return mainWindow;
};

app.whenReady().then(() => {
  const fileName = process.argv[2];
  const builtMenu = Menu.buildFromTemplate([mainMenu, fileMenu, editMenu]);
  app.on("browser-window-blur", function () {});
  app.on("browser-window-focus", function () {});
  Menu.setApplicationMenu(builtMenu);

  createWindow(fileName);

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  ipcMain.handle("save", async () => {
    const result = await dialog.showSaveDialog({
      defaultPath: app.getPath("userDesktop"),
      filters: [
        {
          name: "Documents",
          extensions: ["txt", "md", "text"],
        },
      ],
    });

    if (result.canceled) return;
    return result.filePath;
  });
});
