const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { requireTaskPool } = require('electron-remote');
const path = require('path');
const upload = require('./app/index').upload;
const url = require('url')
let win;

function createWindow () {
  win = new BrowserWindow({width: 800, height: 600});
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

function quitApp() {
 dialog.showMessageBox({
   message: "The files has been uploaded!",
   buttons: ["OK"]
  }, (ints) => { app.quit() });
}

async function processFiles(files, event, data) {
  const module = requireTaskPool(require.resolve('./app/index'));
  const skipsPath = data.skips;
  const site = data.address
  upload(files[0] + "/", skipsPath, site, () => quitApp());
}

ipcMain.once('openDialog', (event, data) => {
    dialog.showOpenDialog({ properties: ['openDirectory'] }, (files) => {
      if (files) {
          processFiles(files, event, data);
      }
    });
});

ipcMain.on('openSkipsDialog', (event, data) => {
  dialog.showOpenDialog({ properties: ['openFile'] }, (files) => {
    if (files) event.sender.send('actionReply', files[0]);
  });
})