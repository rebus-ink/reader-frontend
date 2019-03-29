import {Book} from './Book.js'
import {cache} from './cache.js'
import {processChapter} from '../state/process-chapter.js'
import {processToC} from './process-toc.js'
import {renderToC} from '../views/chapter-book-menu.js'

export class ActivityBook extends Book {
  constructor (activity) {
    super()
    this.activity = activity
    this.publication = {}
    this.publication.resources = this.activity.attachment
    this.publication.readingOrder = this.activity.orderedCollection
    this.publication.links = this.activity.url
    this.publication.creator = this.activity.attributedTo
    this.publication.cover = this.activity.icon
    if (this.activity.tag) {
      this.activity.tags = this.activity.tag
    }
    this.current = this.readingOrder[0]['reader:path']
  }
  async notes (id) {
    if (id) {
      const activity = await ActivityBook.activities.get(id)
      return activity.replies
    } else if (this.currentChapter) {
      return this.currentChapter.replies
    } else {
      return null
    }
  }
  note (id) {
    return ActivityBook.activities.note(id)
  }
  async addNote (note) {
    return ActivityBook.activities.createAndGetId(note)
  }
  async chapter (id) {
    let activity
    if (!id && this.currentChapter) {
      this.emit('chapter', this.currentChapter)
      return this.currentChapter
    } else if (!id && !this.currentChapter) {
      activity = this.readingOrder[0]
    } else {
      activity = await ActivityBook.activities.get(id)
    }
    if (activity.replies) {
      activity.replies.forEach(note => ActivityBook.activities.saveNote(note))
    }
    let data
    try {
      const markup = await ActivityBook.activities.getChapterMarkup(activity, this.id)
      const nodes = processChapter(markup, activity)
      data = {activity, nodes}
      this.current = activity['reader:path']
      this.currentChapter = data
    } catch (err) {
      return this.emit('error', err)
    }
    this.emit('chapter', data)
    cache(this).then(() => this.emit('cached', this)).catch(err => this.emit('error', err))
    return data
  }
  async addToCollection (collection) {
    const payload = {
      type: 'Add',
      object: {
        type: 'reader:Stack',
        id: collection.id,
        name: collection.name
      },
      target: {
        id: this.id
      }
    }
    try {
      return ActivityBook.activities.add(payload)
    } catch (err) {
      this.emit('error', err)
    }
  }
  async removeFromCollection (collection) {
    const payload = {
      type: 'Remove',
      object: {
        type: 'reader:Stack',
        id: collection.id,
        name: collection.name
      },
      target: {
        id: this.id
      }
    }
    try {
      await ActivityBook.activities.remove(payload)
      this.state = await ActivityBook.activities.library(this.element.dataset.tag)
      this.render()
    } catch (err) {
      this.emit('error', err)
    }
  }

  isNext (chapter) {
    const paths = this.readingOrder.map(item => item['reader:path'])
    const index = paths.indexOf(this.current)
    return this.readingOrder.indexOf(chapter) === index + 1
  }
  isPrevious (chapter) {
    const paths = this.readingOrder.map(item => item['reader:path'])
    const index = paths.indexOf(this.current)
    return this.readingOrder.indexOf(chapter) === index - 1
  }
  isCurrent (chapter) {
    const paths = this.readingOrder.map(item => item['reader:path'])
    const index = paths.indexOf(this.current)
    return this.readingOrder.indexOf(chapter) === index
  }
  get id () {
    return this.activity.id
  }
  get next () {
    const paths = this.readingOrder.map(item => item['reader:path'])
    const index = paths.indexOf(this.current)
    return paths[index + 1]
  }
  get previous () {
    const paths = this.readingOrder.map(item => item['reader:path'])
    const index = paths.indexOf(this.current)
    return paths[index - 1]
  }
  get readingOrder () {
    return this.activity.orderedCollection
  }
  async contents () {
    if (this._toc) {
      return this._toc
    }
    const activity = this.readingOrder.filter(item => item.rel && item.rel.indexOf('contents') !== -1)[0]
    if (activity) {
      try {
        const {contents, landmarks} = processToC(activity, this)
        this._toc = {activity, contents, landmarks}
        this.emit('contents', this._toc)
        return {activity, contents, landmarks}
      } catch (err) {
        return this.emit('error', err)
      }
    } else {
      // Do the fallback thing.
      const contents = renderToC({ book: this, bookId: this.id, bookPath: this.current })
      this._toc = {activity, contents}
      this.emit('contents', this._toc)
      return {activity, contents}
    }
  }
  get name () {
    return this.activity.name
  }
  get creator () {
    return this.activity.attributedTo
  }
  get cover () {
    return this.activity.icon
  }

  toJSON () {
    return this.activity
  }
}
