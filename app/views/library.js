import {html} from 'lighterhtml'
import {arrify} from '../utils/arrify.js'
import {bookCard} from './book-card.js'

export function library (context) {
  const title = 'Library'
  const bookCount = arrify(context.items).length
  const path = window.location.pathname
  const url = new URL(document.location)
  const query = url.searchParams
  return html`
  <div class="Library-header">
    <h1 class="Library-title">${title}</h1>
    <nav class="Library-buttons">
    <ol class="Library-buttons-list">
    <!-- <li class="Library-buttons-item"><a href="/Import" class="MenuItem">Create Collection</a></li> -->
    <li class="Library-buttons-item"><a href="/library/import" class="MenuItem MenuItem--library">Import</a></li>
    <!-- <li class="Library-buttons-item"><a href="/logout" class="MenuItem">Sign Out</a></li> -->
    </ol></nav>
    
  <div class="Library-tags">${allView()}${arrify(context.tags).map(tag => tagView(tag))}
  <details class="Dialog Library-tag-dialog">
  <summary class="Library-tag TextButton" aria-label="Create a Collection">+ Collection</summary>
  <details-dialog class="Dialog-body">
    <p class="Dialog-title">Create Collection</p>
    <label for="collection-name" class="Dialog-label">Name</label>
    <input type="text" name="CollectionName" id="collection-name" size="25" class="Dialog-input">
    <button type="button" data-close-dialog class="TextButton Dialog-cancel">Cancel</button>
    <button type="button" data-close-dialog class="Button Dialog-save" onclick=${sendEvent}>Create Collection</button>
  </details-dialog>
</details></div>
<p class="Library-info Library-info--order">Ordered by <select class="LibrarySelect" onchange="${orderChange}">
<option value="${path}" selected=${!query.get('order')}>Date added</option>
<option value="${`${path}?order=added&desc=true`}" selected=${query.get('order') === 'added' && query.get('desc') === 'true'}>Date added, reversed</option>
<option value="${`${path}?order=alpha`}" selected=${query.get('order') === 'alpha' && !query.get('desc')}>Alphabetical</option>
<option value="${`${path}?order=alpha&desc=true`}" selected=${query.get('order') === 'alpha' && query.get('desc') === 'true'}>Alphabetical, reversed</option>
</select></p>
<p class="Library-info">${bookCount} items in “${query.get('tag') || 'All'}”</p>
    
  </div>
  <div class="Library-books">${arrify(context.items).map(book =>
    bookCard(book, arrify(context.tags))
  )}</div><a href="/logout" class="TextButton">Log Out</a><button data-component="full-screen" class="Button Button--floating" aria-label="Full screen" id="full-screen-button"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg></button>`
}

function allView () {
  const url = new URL(document.location)
  const query = url.searchParams
  let classList
  if (query.get('tag')) {
    classList = 'Library-tag Button Button--tag'
  } else {
    classList = 'Library-tag Button Button--tag Button--tag-selected'
  }
  query.delete('tag')
  return html`<a class=${classList} href="${url.href}">All</a>`
}
function tagView (tag) {
  const url = new URL(document.location)
  const query = url.searchParams
  let classList
  if (query.get('tag') === tag.name) {
    classList = 'Library-tag Button Button--tag Button--tag-selected'
  } else {
    classList = 'Library-tag Button Button--tag'
  }
  query.set('tag', tag.name)
  return html`<a class=${classList} href="${url.href}">${tag.name}</a>`
}

function orderChange (event) {
  const url = new URL(document.location)
  const query = url.searchParams
  const target = new URL(event.target.value, document.location)
  const targetQuery = target.searchParams
  if (query.get('tag')) {
    targetQuery.set('tag', query.get('tag'))
  }
  document.body.dispatchEvent(
    new window.CustomEvent('reader:navigation', {
      detail: { path: target.pathname + '?' + targetQuery.toString() }
    })
  )
}
function sendEvent (event) {
  const name = document.getElementById('collection-name').value
  const payload = {
    type: 'reader:Stack',
    name
  }
  document.body.dispatchEvent(
    new window.CustomEvent('reader:create-collection', {
      detail: { collection: payload }
    })
  )
}
