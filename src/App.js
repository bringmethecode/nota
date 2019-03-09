/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect } from 'react'
import { hot } from 'react-hot-loader'
import './app.css'

const { ipcRenderer } = window.require('electron')

const App = () => {
  const [value, setValue] = useState('')

  const getValue = () => {
    ipcRenderer.send('get-note')
    ipcRenderer.on('nota', (e, note) => setValue(note))
  }

  const storeValue = () => ipcRenderer.send('save-note', value)

  useEffect(() => getValue(), [])

  return (
    <>
      <span>#</span>
      <input
        placeholder='Write a new note...'
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={storeValue}
      />
    </>
  )
}

export default hot(module)(App)
