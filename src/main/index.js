//eslint-disable-next-line
const fs = require('fs');
const path = require('path');
const { app, BrowserWindow, Menu, dialog } = require('electron')

app.on('window-all-closed', function () {
    app.quit();
});

//eslint-disable-next-line
const exec = require('child_process').exec;

const warn = function (message) {
    dialog.showMessageBox({
        type: 'warning',
        title: 'warning',
        message: message,
        buttons: ['close']
    });
};
const sendToFocusedBrowser = function (channel) {
    return function () {
        const win = BrowserWindow.getFocusedWindow();
        if (!win) {
            return warn('no selected window');
        }
        win.webContents.send(channel);
    };
};
const mainMenu = {
    label: app.getName(),
    submenu: [{
        label: 'About guiflow',
        click: function () {
            dialog.showMessageBox({
                type: 'info',
                title: 'about guiflow',
                message: 'version : 0.01',
                buttons: ['close']
            });
        }
    }, {
        type: 'separator'
    }, {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click: function () {
            app.quit();
        }
    }, {
        label: 'Toggle Full Screen',
        accelerator: 'F11',
        click: function () {
            const win = BrowserWindow.getFocusedWindow();
            if (win) {
                win.setFullScreen(!win.isFullScreen());
            }
        }
    }, {
        label: 'Toggle Dev Tool',
        accelerator: 'F5',
        click: function () {
            const win = BrowserWindow.getFocusedWindow();
            if (win) {
                win.toggleDevTools();
            }
        }
    }]
};
const fileMenu = {
    label: 'File',
    submenu: [{
        label: 'New File',
        accelerator: 'CmdOrCtrl+N',
        click: function () {
            createWindow();
        },
    }, {
        label: 'Open...',
        accelerator: 'CmdOrCtrl+O',
        click: function () {
            dialog.showOpenDialog({
                defaultPath: app.getPath('userDesktop'),
                properties: ['openFile'],
                filters: [{
                    name: 'Documents',
                    extensions: ['txt', 'md', 'text']
                },],
            }, function (fileNames) {
                if (fileNames) {
                    createWindow(fileNames[0]);
                }
            });
        },

    }, {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        onlyFocusedWindow: true,
        click: sendToFocusedBrowser('save'),
    }, {
        label: 'Save As...',
        accelerator: 'Shift+CmdOrCtrl+S',
        click: sendToFocusedBrowser('saveAs'),
    }]
};

const editMenu = {
    label: 'Edit',
    submenu: [{
        label: 'Undo',
        accelerator: 'CmdOrCtrl+Z',
        click: sendToFocusedBrowser('undo'),
    }, {
        label: 'Redo',
        accelerator: 'CmdOrCtrl+Y',
        click: sendToFocusedBrowser('redo'),
    }, {
        type: 'separator'
    }, {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        click: sendToFocusedBrowser('cut'),
    }, {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        click: sendToFocusedBrowser('copy'),
    }, {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        click: sendToFocusedBrowser('paste'),
    }, {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        click: sendToFocusedBrowser('selectAll'),
  },

    ]
};

const createWindow = function (fileName) {
    let mainWindow = null;
    mainWindow = new BrowserWindow({
        width: 1100,
        height: 800,
        title: 'guiflow -- ' + (fileName ? fileName : 'Untitled'),
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, './preload.js'),
        }
    });
    // FIXME
    mainWindow.loadURL(path.join('file://', __dirname, 'index.html'));

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
    if (fileName) {
        setTimeout(function () {
            mainWindow.webContents.send('open', fileName);
        }, 1000);
    }
    if (process.env.DEBUG) {
        mainWindow.toggleDevTools();
    }
};

app.whenReady().then(() => {
    const fileName = process.argv[2];
    const builtMenu = Menu.buildFromTemplate([
        mainMenu, fileMenu, editMenu
    ]);
    app.on('browser-window-blur', function () { });
    app.on('browser-window-focus', function () { });
    Menu.setApplicationMenu(builtMenu);
    //eslint-disable-next-line
    const firstWindow = createWindow(fileName);
})

const context = Menu.buildFromTemplate([{
  label: 'Undo',
  accelerator: 'CmdOrCtrl+Z',
  click: sendToFocusedBrowser('undo'),
}, {
  label: 'Redo',
  accelerator: 'CmdOrCtrl+Y',
  click: sendToFocusedBrowser('redo'),
}, {
  type: 'separator'
}, {
  label: 'Cut',
  accelerator: 'CmdOrCtrl+X',
  click: sendToFocusedBrowser('cut'),
}, {
  label: 'Copy',
  accelerator: 'CmdOrCtrl+C',
  click: sendToFocusedBrowser('copy'),
}, {
  label: 'Paste',
  accelerator: 'CmdOrCtrl+V',
  click: sendToFocusedBrowser('paste'),
}, {
  label: 'Select All',
  accelerator: 'CmdOrCtrl+A',
  click: sendToFocusedBrowser('selectAll'),
}, ]);