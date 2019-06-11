import queue from 'async-es/queue'

export function createUploadApi (context, api, global) {
  const importQueue = queue(upload)
  importQueue.drain(() => api.events.emit('queue-empty', { empty: true }))
  importQueue.error((err, task) => {
    console.error(err)
  })
  const files = new Set()
  async function create (file) {
    // file can either be an actual file or an object describing an Article with a type: 'Article'
    switch (file.type) {
      case 'application/pdf':
        return api.formats.pdf(file)
      case 'application/epub+zip':
        return api.formats.epub(file)
      default:
        break
    }
  }
  async function upload (file) {
    api.events.emit('importing', file)
    const book = await create(file)
    if (book) {
      api.events.emit('imported', book)
      files.delete(file)
      api.events.emit('libary', file)
      return book
    }
  }
  function add (file) {
    files.add(file)
    importQueue.push(file)
  }
  return {
    queue: importQueue,
    files,
    create,
    upload,
    add
  }
}
