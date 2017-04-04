let processFiles = (() => {
  var _ref = _asyncToGenerator(function* (files) {
    const skipsPath = '/Users/John/src/wordpress/wp-content/plugins/beakon-invoice/backend/skips.txt';
    const site = 'http://192.168.99.100:8080/';
    yield module.upload(files[0] + "/", skipsPath, site);
  });

  return function processFiles(_x) {
    return _ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { requireTaskPool } = require('electron-remote');
const path = require('path');
// const upload = require('./app/index').upload;
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 });
  win.webContents.openDevTools();

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

ipcMain.on('openDialog', (event, data) => {
  dialog.showOpenDialog({ properties: ['openDirectory'] }, files => {
    const module = requireTaskPool(require.resolve('./app/index'));
    if (files) {
      processFiles(files);
    }
    event.sender.send('actionReplyTest', 'hi');
  });
});

ipcMain.on('openSkipsDialog', (event, data) => {
  dialog.showOpenDialog({ properties: ['openFile'] }, files => {
    if (files) event.sender.send('actionReply', files[0]);
  });
});