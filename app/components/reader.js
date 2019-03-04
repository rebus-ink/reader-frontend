import wickedElements from 'wicked-elements'
import {render} from 'lighterhtml'
import { chapter } from '../views/chapter.js'
import { chapterLoading } from '../views/chapter-loading.js'
import * as activities from '../state/activities.js'
import {processChapter} from '../state/process-chapter.js'

wickedElements.define('[data-component="reader"]', {
  async onconnected (event) {
    this.element = event.currentTarget
    this.element.id = 'reader'
    const chapters = this.chapters = new Map()
    const chapterMarkup = this.chapterMarkup = new Map()
    this.render()
    const {chapterId, bookId, bookPath} = this.element.dataset
    if (chapterId && bookId) {
      this.book = await activities.book(bookId)
      const items = this.book.orderedItems
      const chapterData = []
      for (let index = 0; index < items.length; index++) {
        const chapter = items[index]
        chapterData.push(activities.get(chapter.id).then(chapter => chapters.set(chapter.id, chapter)))
        chapterData.push(activities.getChapterMarkup(chapter, bookId).then(markup => chapterMarkup.set(chapter.id, markup)))
      }
      await Promise.all(chapterData)
      const data = this.chapters.get(chapterId)
      const markup = this.chapterMarkup.get(chapterId)
      const dom = processChapter(markup, data)
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
      const data = this.chapters.get(chapterId)
      const markup = this.chapterMarkup.get(chapterId)
      const dom = processChapter(markup, data)
      this.state = {data, dom, bookPath, chapterId, bookId, book: this.book}
      this.render()
    }
  },
  attributeFilter: ['data-book-id', 'data-chapter-id', 'data-current-position']
})
