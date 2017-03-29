const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { requireTaskPool } = require('electron-remote');
const path = require('path');
const url = require('url')
let win;

function createWindow () {
  win = new BrowserWindow({width: 800, height: 600});
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.webContents.openDevTools()

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

ipcMain.on('openDialog', (event, data) => {
    dialog.showOpenDialog({ properties: ['openDirectory'] }, (files) => {
      if (files) {
          event.sender.send('disableButton');
          const cp = require('child_process');
          const n = cp.fork('foo.js', [files[0] + '/', data.skips, data.address]);
          n.on('message', (m) => {
            if (m.message === 'uploadedSuccessfully') {
              console.log(m);
              quitApp();
            }
          });
      }
    });
});

ipcMain.on('openSkipsDialog', (event, data) => {
  dialog.showOpenDialog({ properties: ['openFile'] }, (files) => {
    if (files) event.sender.send('actionReply', files[0]);
  });
})