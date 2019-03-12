import wickedElements from 'wicked-elements'
import {render} from 'lighterhtml'
import {library} from '../views/library.js'
import {libraryLoading} from '../views/library-loading.js'
import * as activities from '../state/activities.js'

wickedElements.define('[data-component="library"]', {
  async onconnected (event) {
    this.element = event.currentTarget
    this.render()
    this.state = await activities.library(this.element.dataset.tag)
    this.reader = await activities.getProfile()
    this.render()
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
      this.state = await activities.library(this.element.dataset.tag)
    }
    this.render()
  },
  'onreader:create-collection': async function (event) {
    const payload = event.detail.collection
    await activities.create(payload)
    this.state = await activities.library()
    this.render()
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
    } catch (err) {
      console.error(err)
    }
    this.state = await activities.library()
    this.render()
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
    } catch (err) {
      console.error(err)
    }
    this.state = await activities.library()
    this.render()
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
