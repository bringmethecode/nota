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
    ipcRenderer.on('note', (e, note) => this.updateValue(note))
    await ipcRenderer.on('ready-close', () => {
      ipcRenderer.send('save-note', this.state.value)
      ipcRenderer.send('closed')
    })
  }

  updateValue = value => this.setState({ value })

  render() {
    return (
      <>
        {
          this.state.loading ? (
            <div className='loader' />
          ) : (
            <div className='note'>
              <span>#</span>
              <textarea
                id='noteText'
                placeholder='Write a new note...'
                value={this.state.value}
                onChange={e => this.updateValue(e.target.value)}
              />
            </div>
          )
        }
      </>
    )
  }
}

export default hot(module)(App)
