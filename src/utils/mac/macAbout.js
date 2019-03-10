/* eslint-disable import/no-extraneous-dependencies */
const { app } = require('electron')

function about() {
  app.setAboutPanelOptions({
    applicationName: 'Nota',
    applicationVersion: process.env.APP_VERSION,
    copyright: 'License: GNU GPLv3, <https://www.gnu.org/licenses/gpl-3.0.html>',
    credits: 'Font used: Inconsolata font by Raph Levien.',
  })
}

module.exports = about
