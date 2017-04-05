const { app, BrowserWindow, ipcMain, dialog, Tray } = require('electron');
const { requireTaskPool } = require('electron-remote');
const path = require('path');
let fs = require('fs');
const url = require('url');
const { round } = require('lodash');
let win;

function createWindow () {
  const appIcon = new Tray(path.join(__dirname, 'lib/DesktopIcon.png'));
  win = new BrowserWindow({
    width: 920,
    height: 570,
    icon: path.join(__dirname, 'lib/DesktopIcon.png')
  });
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

ipcMain.on('openDialog', (event, data) => {
  if (data.file) {
      event.sender.send('disableButton');
      const cp = require('child_process');
      let spawnPath  = path.join(__dirname, 'foo.js');
      event.sender.send('uploadEvent', { messageForScreen: spawnPath });
      const n = cp.fork(spawnPath, [data.file + '/', data.skips, data.address]);
      let progress = 1;
      let progressFiles = 0;
      n.on('message', (m) => {
        if (m.message === 'uploadedSuccessfully') {
          console.log(m);
          quitApp();
        } else if (m.message === 'init') {
          event.sender.send('uploadEvent', { messageForScreen: 'Initialising process and beginning to load files into memory...', progress: 2});
        } else if (m.message === 'fileLoaded') {
          progressFiles += 20;
          event.sender.send('uploadEvent', { messageForScreen: `Loading ${m.file}...`, progress: progressFiles });
        } else if (m.message === 'filesLoaded') {
          event.sender.send('uploadEvent', { messageForScreen: `All files loaded!`, progress: 0 });
        } else if (m.message === 'processingInvoice') {
          if (m.percent > progress) {
            progress += 2;
            event.sender.send('uploadEvent', { messageForScreen: `${round(m.percent, 0)}% of invoices computed.`, progress: progress});
          }
        } else if (m.message === 'processingStarting') {
          event.sender.send('uploadEvent', { messageForScreen: 'Starting to process invoices...', progress: 0 });
        } 
      });
  }
});

ipcMain.on('selectDataFolder', (event, data) => {
  dialog.showOpenDialog({ properties: ['openDirectory'] }, (files) => {
    event.sender.send('dataFolderSelected', files);
  })
})

ipcMain.on('openSkipsDialog', (event, data) => {
  dialog.showOpenDialog({ properties: ['openFile'] }, (files) => {
    if (files) event.sender.send('actionReply', files[0]);
  });
})