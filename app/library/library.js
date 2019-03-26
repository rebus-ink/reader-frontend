import wickedElements from 'wicked-elements'
import {render} from 'lighterhtml'
import {view} from './view.js'
import {viewLoading} from './view-loading.js'
import * as activities from '../state/activities.js'
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
  async setContext (context) {
    this.context = context
    try {
      if (context.query.get('tag')) {
        const tag = context.query.get('tag')
        const state = await activities.library()
        this.setState(state)
        state.items = state.items.filter(item => {
          const tags = item.tags.map(tag => tag.name)
          return tags.indexOf(tag) !== -1
        })
      } else {
        this.setState(await activities.library())
      }
    } catch (err) {
      return errorEvent(err)
    }
    this.render()
  },
  setState (state) {
    this.state = state
    setState(this.state)
    this.render()
  },
  render () {
    if (this.state) {
      const query = this.context.query
      this.state.items = sortBooks(this.state.items, query)
      render(this.element, () => view(this.state))
    } else {
      render(this.element, () => viewLoading())
    }
  },
  'onreader:create-collection': async function (event) {
    const payload = event.detail.collection
    try {
      await activities.create(payload)
      const state = await activities.library(this.element.dataset.tag)
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
    console.log(event)
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
      const state = await activities.library(this.element.dataset.tag)
      this.setState(state)
    } catch (err) {
      errorEvent(err)
    }
  },
  'onreader:remove-from-collection': async function (event) {
    console.log(event)
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
      const state = await activities.library(this.element.dataset.tag)
      this.setState(state)
    } catch (err) {
      errorEvent(err)
    }
  },
  attributeFilter: ['data-sort-desc', 'data-sort-order', 'data-tag']
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
