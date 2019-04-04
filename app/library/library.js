import wickedElements from 'wicked-elements'
import {render} from 'lighterhtml'
import {view} from './view.js'
import {viewLoading} from './view-loading.js'
import * as activities from '../state/activities.js'
import {library, on as book} from './state.js'
import {errorEvent} from '../utils/error-event.js'
import {setState, getContext, on} from '../state/main.js'

wickedElements.define('[data-component="library"]', {
  async onconnected (event) {
    this.element = event.currentTarget
    this.render()
    try {
      this.reader = await activities.getProfile()
      this.setContext(getContext())
      on('context', (context) => this.setContext(context))
      book('added', (book) => this.addBook(book))
    } catch (err) {
      return errorEvent(err)
    }
    document.body.addEventListener('reader:create-collection', this)
    document.body.addEventListener('reader:add-to-collection', this)
    document.body.addEventListener('reader:remove-from-collection', this)
  },
  ondisconnected (event) {
    document.body.removeEventListener('reader:create-collection', this)
    document.body.removeEventListener('reader:add-to-collection', this)
    document.body.removeEventListener('reader:remove-from-collection', this)
  },
  async addBook (book) {
    this.setState(await library())
  },
  async setContext (context) {
    this.context = context
    try {
      this.setState(await library())
    } catch (err) {
      return errorEvent(err)
    }
  },
  setState (state) {
    this.state = state
    setState(this.state)
    this.render()
  },
  render () {
    if (this.state) {
      const query = this.context.query
      const state = this.state
      let items = state.items
      if (query.get('tag')) {
        const tag = query.get('tag')
        items = items.filter(item => {
          const tags = item.tags.map(tag => tag.name)
          return tags.indexOf(tag) !== -1
        })
      }
      items = sortBooks(items, query)
      render(this.element, () => view(items, this.state.tags))
    } else {
      render(this.element, () => viewLoading())
    }
  },
  'onreader:create-collection': async function (event) {
    const payload = event.detail.collection
    try {
      await activities.create(payload)
      const state = await library(this.element.dataset.tag)
      this.setState(state)
    } catch (err) {
      if (err.response && err.response.status === 400) {
        this.render()
      } else {
        errorEvent(err)
      }
    }
  },
  'onreader:add-to-collection': async function (event) {
    const payload = {
      type: 'Add',
      object: {
        type: 'reader:Stack',
        id: event.detail.tag.id,
        name: event.detail.tag.name
      },
      target: {
        id: event.detail.book
      }
    }
    try {
      await activities.add(payload)
      const state = await library(this.element.dataset.tag)
      this.setState(state)
    } catch (err) {
      errorEvent(err)
    }
  },
  'onreader:remove-from-collection': async function (event) {
    const payload = {
      type: 'Remove',
      object: {
        type: 'reader:Stack',
        id: event.detail.tag.id,
        name: event.detail.tag.name
      },
      target: {
        id: event.detail.book
      }
    }
    try {
      await activities.remove(payload)
      const state = await library(this.element.dataset.tag)
      this.setState(state)
    } catch (err) {
      errorEvent(err)
    }
  },
  attributeFilter: ['data-sort-desc', 'data-sort-order', 'data-tag']
})

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
