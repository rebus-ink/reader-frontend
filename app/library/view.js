import {html} from 'lighterhtml'
import {arrify} from '../utils/arrify.js'
import {viewBook} from './view-book.js'

export function view (items, tags) {
  const path = window.location.pathname
  const url = new URL(document.location)
  const query = url.searchParams
  return html`
  <div class="Library-header">
    <h2 class="Library-collectionName">${query.get('tag') || 'All'}</h2>
<p class="Library-info Library-info--order">Ordered by <select class="LibrarySelect" onchange="${orderChange}">
<option value="${path}" selected=${!query.get('order')}>Date added, descending</option>
<option value="${`${path}?order=added&desc=false`}" selected=${query.get('order') === 'added' && query.get('desc') === 'true'}>Date added, ascending</option>
<option value="${`${path}?order=alpha`}" selected=${query.get('order') === 'alpha' && !query.get('desc')}>A-Z</option>
<option value="${`${path}?order=alpha&desc=true`}" selected=${query.get('order') === 'alpha' && query.get('desc') === 'true'}>Z-A</option>
</select></p>
    
  </div>
  <div class="Library-books">${arrify(items).map(book =>
    viewBook(book, arrify(tags))
  )}</div><button data-component="full-screen" class="Button Button--floating" aria-label="Full screen" id="full-screen-button"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg></button>`
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
