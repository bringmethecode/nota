/* eslint-disable import/no-extraneous-dependencies */
import React, { Component } from 'react'
import { hot } from 'react-hot-loader/root'
import FontFaceObserver from 'fontfaceobserver'
import TextareaAutosize from 'react-autosize-textarea'
import './style.scss'

const inconsolataFont = new FontFaceObserver('Inconsolata')
const { ipcRenderer } = window.require('electron')

class App extends Component {
  state = {
    value: '',
    loading: true,
  }

  componentDidMount = async () => {
    await inconsolataFont.load()
    ipcRenderer.send('get-note')
    ipcRenderer.on('retrieve-note', (e, note) => {
      this.setState({ value: note })
      setTimeout(() => this.setState({ loading: false }), 1000)
    })
    ipcRenderer.on('ready-to-close', () => {
      ipcRenderer.send('close-app')
    })
  }

  updateValue = value => this.setState({ value })

  resizeWindow = (width, height) => {
    ipcRenderer.send('resize-area', { width, height })
  }

  closeWindow = () => {
    ipcRenderer.send('prepare-close', this.state.value)
    this.setState({ loading: true })
  }

  render() {
    return (
      <>
        {
          this.state.loading ? (
            <div className='loader' />
          ) : (
            <>
              <span className='close-btn' onClick={this.closeWindow} />
              <div className='app'>
                <span className='hash'>#</span>
                <TextareaAutosize
                  placeholder='New reminder...'
                  value={this.state.value}
                  onChange={e => this.updateValue(e.target.value)}
                  maxRows={20}
                  onResize={({
                    srcElement: { clientWidth, clientHeight }
                  }) => this.resizeWindow(clientWidth, clientHeight)}
                />
              </div>
            </>
          )
        }
      </>
    )
  }
}

export default hot(App)
