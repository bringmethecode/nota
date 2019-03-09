/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import './app.css'

const { ipcRenderer } = window.require('electron')

class App extends Component {
  state = {
    value: '',
  }

  componentDidMount = async () => {
    ipcRenderer.send('get-note')
    ipcRenderer.on('note', (e, note) => this.setState({ value: note }))
    await ipcRenderer.on('ready-close', () => {
      ipcRenderer.send('save-note', this.state.value)
      ipcRenderer.send('closed')
    })
  }

  render() {
    return (
      <>
        <span>#</span>
        <input
          placeholder='Write a new note...'
          value={this.state.value}
          onChange={e => this.setState({ value: e.target.value })}
        />
      </>
    )
  }
}

export default hot(module)(App)
