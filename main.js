const { app, globalShortcut, shell,  BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    }
  })
  win.removeMenu()
  win.loadFile('index.html')

  globalShortcut.registerAll(['CommandOrControl+Shift+I', 'F12'], () => {
    win.webContents.send('devtools');
  })
}

app.whenReady().then(createWindow)

app.on('web-contents-created', (e, contents) => {
  if (contents.getType() == 'webview') {
    contents.on('new-window', (e, url) => {
      e.preventDefault()
      shell.openExternal(url)
    })
  }
})

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