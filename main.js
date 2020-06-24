const { app, shell,  BrowserWindow } = require('electron')
const localShortcut = require('electron-localshortcut')

function createWindow () {
  const win = new BrowserWindow({
    width: 1300,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true
    }
  })
  win.webContents.session.setPermissionCheckHandler(async (webContents, permission, details) => true)
  win.webContents.session.setPermissionRequestHandler(async (webContents, permission, callback, details) => {
    callback(true)
  })
  win.removeMenu()
  win.loadFile('index.html')

  localShortcut.register('F12', () => {
    win.webContents.send('devtools');
  })
  localShortcut.register('CommandOrControl+Shift+I', () => {
    win.webContents.toggleDevTools();
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