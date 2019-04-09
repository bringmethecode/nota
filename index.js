/* eslint-disable import/no-extraneous-dependencies */
import { app, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import Store from 'electron-store'
import sourceMapSupport from 'source-map-support'
import debug from 'electron-debug'
import {
  getWindowState, setWindowState, getNote, saveNote,
} from './storeHelpers'

const devEnv = process.env.NODE_ENV === 'development'
const debugProd = process.env.DEBUG_PROD === 'true'
const store = new Store({ name: 'nota' })
const filesURL = devEnv ? 'http://localhost:3000/dist/' : 'dist/index.html'

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info'
    autoUpdater.logger = log
    autoUpdater.checkForUpdatesAndNotify()
  }
}

let mainWindow = null
let readyToClose = false
const windowState = getWindowState(store)
const storedNote = getNote(store)

if (process.env.NODE_ENV === 'production') {
  sourceMapSupport.install()
}

if (devEnv || debugProd) {
  debug()
}

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    x: windowState.x || 0,
    y: windowState.y || 0,
    width: windowState.width || 400,
    height: windowState.height || 150,
    backgroundColor: '#050505',
    alwaysOnTop: true,
    title: 'nota',
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  })
  const { webContents } = mainWindow
  mainWindow.loadURL(filesURL)
  mainWindow.once('show', () => webContents.send('retrieve-note', storedNote))
  if (devEnv || debugProd) {
    await installExtension(REACT_DEVELOPER_TOOLS).catch(e => throw e)
    webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  ipcMain.on('prepare-close', (e, noteValue) => {
    const bounds = mainWindow.getBounds()
    setWindowState(store, bounds)
    saveNote(store, noteValue)
    webContents.send('ready-to-close')
  })

  ipcMain.on('resize-area', (e, { width, height }) => {
    const mainPadding = 80
    mainWindow.setSize(width + mainPadding, height + mainPadding, false)
  })

  ipcMain.on('get-note', () => {
    mainWindow.send('retrieve-note', storedNote)
  })

  ipcMain.on('save-note', (e, newNote) => {
    saveNote(store, newNote)
  })

  ipcMain.on('close-app', () => {
    /* the real quit() */
    readyToClose = true
    app.quit()
  })
  const update = new AppUpdater()
  update()
}


app.on('ready', createWindow)

// app.on('window-all-closed', () => {
//   const bounds = mainWindow.getBounds()
//   setWindowState(store, bounds)
//   app.quit()
// })

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
