const clearData = require('../clearData')

const template = store => [
  {
    label: 'uhh',
    role: 'window',
    submenu: [
      {
        label: 'Clear Preferences',
        accelerator: 'Shift+CmdOrCtrl+C',
        click() {
          clearData(store)
        },
      },
      {
        label: 'About',
        accelerator: 'CmdOrCtrl+A',
        role: 'about',
      },
      {
        label: 'Quit :(',
        accelerator: 'CmdOrCtrl+Q',
        role: 'quit',
      },
    ],
  },
]

module.exports = template
