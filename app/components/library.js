import wickedElements from 'wicked-elements'
import {render} from 'lighterhtml'
import {library} from '../views/library.js'
import {libraryLoading} from '../views/library-loading.js'
import * as activities from '../state/activities.js'

wickedElements.define('[data-component="library"]', {
  async onconnected (event) {
    this.element = event.currentTarget
    this.render()
    this.state = await activities.library()
    const query = {order: this.element.dataset.sortOrder, desc: this.element.dataset.sortDesc}
    this.state.items = sortBooks(this.state.items, query)
    this.render()
  },
  ondisconnected (event) { },
  render () {
    if (this.state) {
      render(this.element, () => library(this.state))
    } else {
      render(this.element, () => libraryLoading())
    }
  },
  onattributechanged (event) {
    const query = {order: this.element.dataset.sortOrder, desc: this.element.dataset.sortDesc}
    this.state.items = sortBooks(this.state.items, query)
    this.render()
  },
  attributeFilter: ['data-sort-desc', 'data-sort-order']
})

function sortBooks (items, query) {
  const order = query.order
  if (order === 'alpha') {
    items = items.sort((first, second) => {
      return first.name.localeCompare(second.name)
    })
  } else {
    items = items.sort((first, second) => {
      return (first.published < second.published) ? -1 : ((first.published > second.published) ? 1 : 0)
    })
  }
  const direction = query.desc
  if (direction) {
    items = items.reverse()
  }
  return items
}
