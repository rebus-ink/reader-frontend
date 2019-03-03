import wickedElements from 'wicked-elements'
import {render} from 'lighterhtml'
import { chapter } from '../views/chapter.js'
import { chapterLoading } from '../views/chapter-loading.js'
import * as activities from '../state/activities.js'

wickedElements.define('[data-component="reader"]', {
  async onconnected (event) {
    this.element = event.currentTarget
    this.element.id = 'reader'
    this.cache = new Map()
    this.render()
    const {chapterId, bookId, bookPath} = this.element.dataset
    if (chapterId && bookId) {
      this.book = await activities.book(bookId)
      const items = this.book.orderedItems
      for (let index = 0; index < items.length; index++) {
        const chapter = items[index]
        this.cache.set(chapter.id, await activities.get(chapter.id))
      }
      const data = this.cache.get(chapterId)
      const dom = await activities.chapter(data, bookId)
      this.state = {data, dom, bookPath, chapterId, bookId, book: this.book}
    }
    this.render()
  },
  ondisconnected (event) { },
  render () {
    if (this.state) {
      render(this.element, () => chapter(this.state))
    } else {
      render(this.element, () => chapterLoading())
    }
  },
  async onattributechanged (event) {
    const {attributeName, oldValue, newValue} = event
    if (attributeName === 'data-current-position') {
      if (oldValue === newValue) { return }
      const target = document.querySelector(`[data-location="${newValue}"]`)
      if (target !== this.currentElement) {
        if (this.currentElement) {
          this.currentElement.classList.remove('is-position')
        }
        this.currentElement = target
        this.currentElement.classList.add('is-position')
      }
      // if (target) { target.scrollIntoView({behaviour: 'smooth'}) }
    } else {
      this.state = null
      this.render()
      const {chapterId, bookId, bookPath} = this.element.dataset
      const data = this.cache.get(chapterId)
      const dom = await activities.chapter(data, bookId)
      this.state = {data, dom, bookPath, chapterId, bookId, book: this.book}
      this.render()
    }
  },
  attributeFilter: ['data-book-id', 'data-chapter-id', 'data-current-position']
})
