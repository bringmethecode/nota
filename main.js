/* eslint-disable import/no-extraneous-dependencies */
const {
  app, BrowserWindow, ipcMain, Menu,
} = require('electron')
const Store = require('electron-store')
require('dotenv').config()
const {
  getWindowState, setWindowState, getNote, saveNote,
} = require('./storeHelpers')
const macMenu = require('./src/utils/mac/macMenu')
const macAbout = require('./src/utils/mac/macAbout')

const store = new Store({ name: 'nota' })
let mainWindow
let notReady = true
const windowState = getWindowState(store)
const storedNote = getNote(store)

const createWindow = () => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(macMenu(store)))
  macAbout()
  mainWindow = new BrowserWindow({
    x: windowState.x || 0,
    y: windowState.y || 0,
    width: windowState.width || 400,
    height: windowState.height || 150,
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
  if (process.env.DEV_TOOLS === 'true') mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.on('close', (e) => {
    if (notReady) {
      const bounds = mainWindow.getBounds()
      setWindowState(store, bounds)
      webContents.send('ready-close')
      e.preventDefault()
    }
  })

  ipcMain.on('get-note', () => {
    mainWindow.send('note', storedNote)
  })

  ipcMain.on('save-note', (e, newNote) => {
    saveNote(store, newNote)
  })

  ipcMain.on('closed', () => {
    /* this ends the vicious loop we all get trapped into */
    notReady = false
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
