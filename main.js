var { app, BrowserWindow } = require('electron');

function createWindow () {
    const win = new BrowserWindow({
      width: 1250,
      height: 960,
      resizable: false,
      webPreferences: {
        nodeIntegration: true
      }
    })
  
    // win.setMenu(null)
    win.loadFile('index.html')
  };
  
  app.whenReady().then(createWindow)
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })