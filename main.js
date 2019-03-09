/* eslint-disable import/no-extraneous-dependencies */
const { app, BrowserWindow, ipcMain } = require('electron')
const DataStore = require('./DataStore')

const noteData = new DataStore({ name: 'nota' })

let mainWindow

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
    },
  })
  mainWindow.loadFile('index.html')
  mainWindow.once('show', () => mainWindow.webContents.send('nota', noteData.note))
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  ipcMain.on('get-note', () => {
    const note = noteData.getNote()
    mainWindow.send('nota', note)
  })

  ipcMain.on('save-note', (e, newNote) => {
    const updatedNote = noteData.updateNote(newNote)
    mainWindow.send('nota', updatedNote)
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  //   app.quit()
  // }
  app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
