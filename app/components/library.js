import wickedElements from 'wicked-elements'
import {render} from 'lighterhtml'
import {library} from '../views/library.js'
import {libraryLoading} from '../views/library-loading.js'
import * as activities from '../state/activities.js'
import {errorEvent} from '../utils/error-event.js'

wickedElements.define('[data-component="library"]', {
  async onconnected (event) {
    this.element = event.currentTarget
    this.render()
    try {
      this.state = await activities.library(this.element.dataset.tag)
      this.reader = await activities.getProfile()
      this.render()
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
  render () {
    if (this.state) {
      const query = {order: this.element.dataset.sortOrder, desc: this.element.dataset.sortDesc}
      this.state.items = sortBooks(this.state.items, query)
      render(this.element, () => library(this.state))
    } else {
      render(this.element, () => libraryLoading())
    }
  },
  async onattributechanged (event) {
    const {attributeName} = event
    if (attributeName === 'data-tag') {
      try {
        this.state = await activities.library(this.element.dataset.tag)
      } catch (err) {
        return errorEvent(err)
      }
    }
    this.render()
  },
  'onreader:create-collection': async function (event) {
    const payload = event.detail.collection
    try {
      await activities.create(payload)
      this.state = await activities.library(this.element.dataset.tag)
      this.render()
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
      this.state = await activities.library(this.element.dataset.tag)
      this.render()
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
      this.state = await activities.library(this.element.dataset.tag)
      this.render()
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
