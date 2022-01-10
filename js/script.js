console.log(window.requires);

const ipcRenderer = window.requires.ipcRenderer;
// eslint-disable-next-line
const flumine = window.requires.flumine;
// var uiflow = remote.require("./app/uiflow");
import editor from './editor.js';
// eslint-disable-next-line
// import diagram from ('./diagram.js');

[
  'open',
  'save',
  'saveAs',
  'undo',
  'redo',
  'cut',
  'copy',
  'paste',
  'selectAll',
].forEach(function (channel) {
  ipcRenderer.on(channel, editor[channel].listener(2));
});

// eslint-disable-next-line
var sendToEditor = function (channel) {
  return editor[channel];
};

// eslint-disable-next-line
const clipboard = window.requires.clipboard;
// eslint-disable-next-line
const nativeImage = window.requires.nativeImage;

const Menu = window.requires.menu;
// eslint-disable-next-line
const menu = Menu.buildFromTemplate([{
    label: 'Undo',
    accelerator: 'CmdOrCtrl+Z',
    click: sendToEditor('undo'),
}, {
    label: 'Redo',
    accelerator: 'CmdOrCtrl+Y',
    click: sendToEditor('redo'),
}, {
    type: 'separator'
}, {
    label: 'Cut',
    accelerator: 'CmdOrCtrl+X',
    click: sendToEditor('cut'),
}, {
    label: 'Copy',
    accelerator: 'CmdOrCtrl+C',
    click: sendToEditor('copy'),
}, {
    label: 'Paste',
    accelerator: 'CmdOrCtrl+V',
    click: sendToEditor('paste'),
}, {
    label: 'Select All',
    accelerator: 'CmdOrCtrl+A',
    click: sendToEditor('selectAll'),
}, ]);

// window.addEventListener('contextmenu', function(e) {
//     e.preventDefault();
//     menu.popup(remote.getCurrentWindow());
// }, false);

// eslint-disable-next-line
// var dialogs = require('dialogs')({});

// $(function() {

//     $(window).on("load resize", function() {
//         $(".main").height($(window).height());
//     });
//     $("#download").click(function(e) {
//         editor.value.and(function(code) {
//             return uiflow.update("<anon>", code, "svg");
//         }).and(function(svg) {

//             var image = new Image;
//             var strSvg = String(svg);
//             var match = strSvg.match(/svg width="(\d+)pt" height="(\d+)pt"/);
//             var width = match[1];
//             var height = match[2];

//             image.src = "data:image/svg+xml," + encodeURIComponent(svg);
//             var cElement = document.createElement("canvas");
//             cElement.width = width * 2;
//             cElement.height = height * 2;
//             var cContext = cElement.getContext("2d");
//             cContext.fillStyle = "#fff";
//             cContext.fillRect(-10, -10, width * 3, height * 3);
//             cContext.drawImage(image, 0, 0, width * 2, height * 2);
//             var png = cElement.toDataURL("image/png");

//             var image = nativeImage.createFromDataURL(png);
//             clipboard.writeImage(image);

//             alert("Copied Image to Clipboard");
//         })();
//     });

//     editor.on("change", function(code) {
//         uiflow.compile(code).then(function(data) {
//                 editor.clearError();
//                 return data;
//             })
//             .then(diagram.refresh)
//             .catch(editor.setError);
//     });
//     editor.on("same", function(fileName) {
//         document.title = "guiflow -- " + (fileName || "Untitled") + " = ";
//     });
//     editor.on("diff", function(fileName) {
//         document.title = "guiflow -- " + (fileName || "Untitled") + " + ";
//     });
//     diagram.on("page-click", function(lines) {
//         editor.navigateTo(lines);
//     });
//     diagram.on("end-click", function(text) {
//         editor.insert(text);
//     });
// });
