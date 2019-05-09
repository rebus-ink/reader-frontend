
import {viewLoading} from './view-loading.js'
import component, {html, useContext} from 'neverland'
import {libraryState} from './state.js'
import {navigate} from '../utils/context-router.js'
import {arrify} from '../utils/arrify.js'
import {viewBook} from './view-book.js'
import {Shelf} from './component-shelf.js'
// Move router
export const Library = component((context, {dispatch}) => {
  const state = useContext(libraryState)
  const {query, pathname} = context.request
  if (state.items) {
    let items = state.items
    if (query.get('tag')) {
      const tag = query.get('tag')
      items = items.filter(item => {
        const tags = item.tags.map(tag => tag.name)
        return tags.indexOf(tag) !== -1
      })
    }
    items = sortBooks(items, query)
    return html`<div>
    <div class="Library-header">
      <h2 class="Library-collectionName">${query.get('tag') || 'All'}</h2>
      ${Shelf(context)}
    </div>
    <div class="Library-header">
      <div>All Types</div>
  <label class="Library-info Library-info--order">Ordered by <select class="LibrarySelect" onchange="${orderChange}">
  <option value="${pathname}" selected=${!query.get('order')}>Newest first</option>
  <option value="${`${pathname}?order=added&desc=false`}" selected=${query.get('order') === 'added' && query.get('desc') === 'true'}>Oldest first</option>
  <option value="${`${pathname}?order=alpha`}" selected=${query.get('order') === 'alpha' && !query.get('desc')} aria-label="Alphabetical, ascending">A-Z</option>
  <option value="${`${pathname}?order=alpha&desc=true`}" selected=${query.get('order') === 'alpha' && query.get('desc') === 'true'} aria-label="Alphabetical, descending">Z-A</option>
  </select></label>
    </div>
    <div class="Library-books">${arrify(items).map(book => viewBook(book, arrify(state.tags), dispatch))}</div></div>`
  } else {
    return viewLoading()
  }
})

function orderChange (event) {
  const url = new URL(document.location)
  const query = url.searchParams
  const target = new URL(event.target.value, document.location)
  const targetQuery = target.searchParams
  if (query.get('tag')) {
    targetQuery.set('tag', query.get('tag'))
  }
  navigate(target.pathname + '?' + targetQuery.toString())
}

function sortBooks (items, query) {
  const order = query.get('order')
  const direction = query.get('desc')
  if (!order && !direction) {
    items = items.sort((first, second) => {
      return (first.published < second.published) ? -1 : ((first.published > second.published) ? 1 : 0)
    })
    return items.reverse()
  } else if (order === 'added' && direction === 'false') {
    items = items.sort((first, second) => {
      return (first.published < second.published) ? -1 : ((first.published > second.published) ? 1 : 0)
    })
    return items
  } else if (order === 'alpha') {
    items = items.sort((first, second) => {
      return first.name.localeCompare(second.name)
    })
    if (direction) {
      items = items.reverse()
    }
    return items
  }
}
