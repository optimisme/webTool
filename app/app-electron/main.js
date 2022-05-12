// Modules to control application life and create native browser window
const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron')
const path = require('path')
const server = require("./server")

let mainWindow = undefined

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 750,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('./app.html')
  mainWindow.webContents.once("dom-ready", () => {
    mainWindow.webContents.executeJavaScript(`window.document.location.href = "http://localhost:${server.port}/electron/app.html"`)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  app.on("browser-window-created", (e, win) => {
      mainWindow.removeMenu();
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  // if (process.platform !== 'darwin') app.quit()
  app.quit()
})

app.on('browser-window-focus', function () {
  globalShortcut.register("CommandOrControl+R", () => {
    mainWindow.webContents.send('asynchronous-message', { call: 'refresh'})
  })
  globalShortcut.register("F5", () => {
    mainWindow.webContents.send('asynchronous-message', { call: 'refresh'})
  })
})

app.on('browser-window-blur', function () {
  globalShortcut.unregister('CommandOrControl+R')
  globalShortcut.unregister('F5')
})

ipcMain.on( "setMyGlobalVariable", ( event, myGlobalVariableValue ) => {
  global.myGlobalVariable = myGlobalVariableValue;
} )

// Attach listener in the main process with the given ID
ipcMain.on('request-mainprocess-action', (event, arg) => {
    if (arg.call == 'openTools') {
      if (mainWindow.webContents.isDevToolsOpened()) {
        mainWindow.webContents.closeDevTools()
      } else {
        mainWindow.webContents.openDevTools()
      }
    }
})