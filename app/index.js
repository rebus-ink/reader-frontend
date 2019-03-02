import hyperApp from 'hyperhtml-app'
import * as activities from './state/activities.js'
import {render, html} from 'lighterhtml'
import {chapter} from './views/chapter.js'
import '@github/details-menu-element'
import {importPage} from './importer/import-page.js'
import './components/library.js'

const app = hyperApp()
const body = document.body

app.get('/', function (context) {
  console.log('Welcome')
  app.navigate('/library')
})

app.get('/library/import', async function (context) {
  await import('./importer.js')
  body.setAttribute('class', 'Layout')
  body.id = 'layout'
  render(body, () => importPage())
  console.log('Welcome')
})

app.get('/library', async function (context) {
  console.log('Welcome to library')
  try {
    body.setAttribute('class', 'Layout')
    body.id = 'layout'
    const query = (new URL(document.location)).searchParams
    render(body, () => html`<main class="Library" id="Library" data-component="library" data-sort-order=${query.get('order') || null}  data-sort-desc=${query.get('desc') || null}></main>`)
  } catch (err) {
    console.error(err)
  }
})

app.get('/library/notes', async function (context) {
  console.log('Welcome to notes')
})

app.get('/reader/:bookId/:bookPath+', async function (context) {
  console.log('Welcome to chapter')
  await import('./annotations.js')
  const book = await activities.book(context.params.bookId)
  const current = book.orderedItems.filter(chapter => chapter['reader:path'] === context.params.bookPath)[0]
  return reader(book, current, context.params)
})

// This should just get book data, then navigate to the correct bookpath
app.get('/reader/:bookId', async function (context) {
  await import('./annotations.js')
  console.log('Welcome to book')
  try {
    const book = await activities.book(context.params.bookId)
    const first = book.orderedItems[0]
    app.navigate(`${window.location.pathname}/${first['reader:path']}`, {replace: true}) // Need to repeat chapter rendering here.
    context.params.bookPath = first['reader:path']
    return reader(book, first, context.params)
  } catch (err) {
    console.error(err)
  }
})

async function reader (book, data, params) {
  body.setAttribute('class', 'Layout Layout--reader')
  body.id = 'layout'
  data = await activities.get(data.id)
  const dom = await activities.chapter(data, params.bookId)
  const state = {dom, data, params, book}
  render(body, () => chapter(state))
}

document.body.addEventListener('reader:navigation', event => app.navigate(event.detail.path))

app.navigate(window.location.pathname + window.location.search)
