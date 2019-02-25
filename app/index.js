import hyperApp from 'hyperhtml-app'
import * as activities from './state/activities.js'

const app = hyperApp()

app.get('/', function (ctx) {
  console.log('Welcome')
})
app.get('/library/import', async function (ctx) {
  await import('/js/jszip.min.js')
  await import('./importer/index.js')
  console.log('Welcome')
})
app.get('/library', async function (ctx) {
  console.log('Welcome to library')
})
app.get('/library/notes', async function (ctx) {
  base()
  console.log('Welcome to notes')
})
// This should only show book information
app.get('/reader/:bookId', async function (ctx) {
  await import('./annotations/index.js')
  console.log('Welcome to book')
})
app.get('/reader/:bookId/:bookPath*', async function (ctx) {
  base()
  await import('./annotations/index.js')
  console.log('Welcome to chapter')
})

app.navigate(window.location.pathname)