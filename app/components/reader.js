import wickedElements from 'wicked-elements'
import {render} from 'lighterhtml'
import { chapter } from '../views/chapter.js'
import { chapterLoading } from '../views/chapter-loading.js'
import * as activities from '../state/activities.js'
import {processChapter} from '../state/process-chapter.js'
import { highlightNote } from '../annotations/highlight-actions.js'

wickedElements.define('[data-component="reader"]', {
  async onconnected (event) {
    this.element = event.currentTarget
    this.element.id = 'reader'
    this.render()
    const {chapterId, bookId, bookPath} = this.element.dataset
    if (chapterId && bookId) {
      this.book = await activities.book(bookId)
      const data = await activities.get(chapterId)
      if (data.replies) {
        data.replies.forEach(note => activities.saveNote(note))
      }
      const markup = await activities.getChapterMarkup(data, bookId)
      const dom = processChapter(markup, data)
      this.state = {data, dom, bookPath, chapterId, bookId, book: this.book}
    }
    this.render()
    this.handleTarget()
    highlightNotes(this.state.data)
  },
  ondisconnected (event) { },
  render () {
    if (this.state) {
      render(this.element, () => chapter(this.state))
    } else {
      render(this.element, () => chapterLoading())
    }
  },
  handleTarget (oldValue) {
    const targetValue = this.element.dataset.target
    if (oldValue === targetValue) { return }
    let target
    if (targetValue[0] === '#') {
      target = document.querySelector(targetValue)
    } else {
      target = document.querySelector(`[data-location="${targetValue}"]`)
      if (target && target !== this.currentElement) {
        if (this.currentElement) {
          this.currentElement.classList.remove('is-position')
        }
        this.currentElement = target
        this.currentElement.classList.add('is-position')
      }
    }
    if (target) { target.scrollIntoView() }
  },
  async onattributechanged (event) {
    const {attributeName, oldValue} = event
    if (attributeName === 'data-target') {
      this.handleTarget(oldValue)
    } else if (attributeName === 'data-book-id' || attributeName === 'data-chapter-id') {
      this.state = null
      this.render()
      const {chapterId, bookId, bookPath} = this.element.dataset
      const data = await activities.get(chapterId)
      if (data.replies) {
        data.replies.forEach(note => activities.saveNote(note))
      }
      const markup = await activities.getChapterMarkup(data, bookId)
      const dom = processChapter(markup, data)
      this.state = {data, dom, bookPath, chapterId, bookId, book: this.book}
      this.render()
      this.handleTarget()
    }
  },
  attributeFilter: ['data-book-id', 'data-chapter-id', 'data-current-position', 'data-target']
})

function highlightNotes (chapter) {
  const highlights = chapter.replies.filter(reply => {
    const selector = reply['oa:hasSelector']
    if (selector.type === 'RangeSelector') {
      return true
    } else if (selector.start || selector.end) {
      return true
    } else {
      return false
    }
  })
  highlights.map(note => highlightNote(note))
}
