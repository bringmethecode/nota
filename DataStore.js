const Store = require('electron-store')

class DataStore extends Store {
  constructor(settings) {
    super(settings)
    this.note = this.get('note') || ''
  }

  getNote() {
    this.note = this.get('note') || ''
    return this.note
  }

  saveNote(newNote) {
    this.set('note', newNote)
    this.note = this.getNote()
    return this.note
  }

  updateNote(newNote) {
    return this.saveNote(newNote)
  }
}

module.exports = DataStore
