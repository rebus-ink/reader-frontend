import hyperApp from 'hyperhtml-app'
import * as activities from './state/activities.js'
import {render} from 'lighterhtml'
import {library} from './components/library.js'
import '@github/details-menu-element'

const app = hyperApp()
const body = document.body

app.get('/', function (context) {
  console.log('Welcome')
  app.navigate('/library')
})
app.get('/library/import', async function (context) {
  await import('/js/jszip.min.js')
  await import('./importer.js')
  console.log('Welcome')
})
app.get('/library', async function (context) {
  console.log('Welcome to library')
  try {
    const books = await activities.library()
    body.setAttribute('class', 'Layout')
    body.id = 'layout'
    render(body, () => library(books))
  } catch (err) {
    console.error(err)
  }
})
app.get('/library/notes', async function (context) {
  console.log('Welcome to notes')
})
// This should just get book data, then navigate to the correct bookpath
app.get('/reader/:bookId', async function (context) {
  console.log(context)
  await import('./annotations.js')
  console.log('Welcome to book')
  try {
    const book = await activities.get(`/${context.params.bookId}`)
    console.log(book)
    body.setAttribute('class', 'Layout')
    body.id = 'layout'
    const first = book.orderedItems[0]
    app.navigate(`${window.location.pathname}/${first['reader:path']}`, {replace: true})
  } catch (err) {
    console.error(err)
  }
})
app.get('/reader/:bookId/:bookPath*', async function (context) {
  await import('./annotations.js')
  console.log(context)
  console.log('Welcome to chapter')
})

app.navigate(window.location.pathname)
