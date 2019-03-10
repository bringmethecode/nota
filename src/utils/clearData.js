/* eslint-disable import/no-extraneous-dependencies */
const path = require('path')
const { app } = require('electron')
const fs = require('fs-extra')

const appName = app.getName()

const getAppPath = path.join(app.getPath('appData'), appName)

function clearData(store) {
  fs.unlink(getAppPath, () => {
    store.clear()
    app.relaunch()
    app.exit()
  })
}

module.exports = clearData
