import hyperApp from 'hyperhtml-app'
import 'intersection-observer'
import 'details-dialog-element'
import * as activities from './state/activities.js'
import {render, html} from 'lighterhtml'
import '@github/details-menu-element'
import {importPage} from './importer/import-page.js'
import './components/components.js'

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
    render(body, () => html`<main class="Library" id="Library" data-component="library" data-sort-order=${query.get('order') || 'added'}  data-sort-desc=${query.get('desc') || null} data-tag=${query.get('tag')}></main>`)
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

app.get('/login', function (context) {
  const returnTo = `/login?${
    encodeURIComponent(window.location.pathname + window.location.search)}`
  render(document.body, () => html`<div class="FrontLayout">
  <form action="${returnTo}" method="POST">
  <button class="Button">Log In</button>
  </form>
  </div>`)
})

app.get('/logout', function (context) {
  render(document.body, () => html`<div class="FrontLayout">
  <form action="/logout" method="POST">
  <button class="Button" onclick=${activities.logout()}>Log Out</button>
  </form>
  </div>`)
})

async function reader (book, data, params) {
  body.setAttribute('class', '')
  body.id = 'layout'
  const reader = document.getElementById('reader')
  let target
  if (window.location.hash.startsWith('#/') && !reader) {
    target = window.location.hash.replace('#', '')
  } else if (window.location.hash.startsWith('#/') && reader) {
    target = ''
  } else {
    target = window.location.hash
  }
  render(body, () => html`<div class="Layout Layout--reader" data-component="reader" data-chapter-id="${data.id}" data-book-id="${params.bookId}" data-book-path="${params.bookPath}" data-target="${target}"></div>`)
}

document.body.addEventListener('reader:navigation', event => app.navigate(event.detail.path))

document.body.addEventListener('reader:login', event => app.navigate('/login'))
document.body.addEventListener('reader:error', event => renderErr(event.detail.error))
// window.onerror = function (message, source, lineno, colno, err) {
//   console.log('onerror called')
//   renderErr(err)
// }

// window.onunhandledrejection = function (event) {
//   console.log('onunhandledrejection called')
//   renderErr(event.reason)
// }

async function renderErr (err) {
  console.error(err)
  console.log(err.response)
  const {response = {}} = err
  let text
  if (response && response.text) {
    text = await response.text()
  }
  console.log(text)
  const report = `
  message: ${err.message}
  error type: ${err.httpMethod}
  request url: ${response.url}
  response status: ${response.status}
  response message: ${text}
  location: ${err.fileName}:${err.lineNumber}:${err.columnNumber} 
  stack: ${err.stack}`
  render(body, () => errorView(report))
}

function errorView (report) {
  console.log(report)
  return html`<div class="FrontLayout">
      <h1>Oh no! Things blew up!</h1>
      <p>The following error made everything unhappy:</p>
      <pre><code>
        ${report}
      </code></pre>
</div>`
}

app.navigate(window.location.pathname + window.location.search)
