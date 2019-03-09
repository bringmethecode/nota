/* eslint-disable import/no-extraneous-dependencies */
const { app, BrowserWindow, ipcMain } = require('electron')
const Store = require('electron-store')
const {
  getWindowState, setWindowState, getNote, saveNote,
} = require('./storeHelpers')

const store = new Store({ name: 'nota' })
let mainWindow
let a = true
const windowState = getWindowState(store)
const storedNote = getNote(store)

const createWindow = () => {
  mainWindow = new BrowserWindow({
    x: windowState.x || 0,
    y: windowState.y || 0,
    width: windowState.width || 500,
    height: windowState.height || 100,
    backgroundColor: '#050505',
    alwaysOnTop: true,
    title: 'nota',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true,
    },
  })
  const { webContents } = mainWindow
  mainWindow.loadFile('index.html')
  mainWindow.once('show', () => webContents.send('note', storedNote))
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('close', (e) => {
    a = !a
    webContents.send('ready-close')
    if (a) e.preventDefault()
  })

  ipcMain.on('get-note', () => {
    mainWindow.send('note', storedNote)
  })

  ipcMain.on('save-note', (e, newNote) => {
    saveNote(store, newNote)
  })

  ipcMain.on('closed', () => {
    app.quit()
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  //   app.quit()
  // }
  const bounds = mainWindow.getBounds()
  setWindowState(store, bounds)
  app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
