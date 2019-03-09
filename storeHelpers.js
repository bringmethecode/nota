const storeHelpers = {
  getNote: store => store.get('note', ''),
  saveNote: (store, newNote) => {
    store.set('note', newNote)
  },
  getWindowState: store => store.get('windowState', {}),
  setWindowState: (store, {
    x, y, width, height,
  }) => store.set('windowState', {
    x, y, width, height,
  }),
}

module.exports = storeHelpers
