const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('index.html'); // loads your HTML file
}

app.whenReady().then(createWindow);