/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from 'react'
import { hot } from 'react-hot-loader'
import FontFaceObserver from 'fontfaceobserver'
import './app.css'

const inconsolataFont = new FontFaceObserver('Inconsolata')
const { ipcRenderer } = window.require('electron')

class App extends Component {
  state = {
    value: '',
    loading: true,
  }

  componentDidMount = async () => {
    await inconsolataFont.load()
    this.setState({ loading: false })
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
      {
        this.state.loading ? (
          <div className='loader' />
        ) : (
          <>
            <h1 className='title'>Note:</h1>
            <div className='note'>
              <span>#</span>
              <textarea
                placeholder='Write a new note...'
                value={this.state.value}
                onChange={e => this.setState({ value: e.target.value })}
              />
            </div>
          </>
        )
      }
      </>
    )
  }
}

export default hot(module)(App)
