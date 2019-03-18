import {Book} from '../Book.js'
import {formData} from './formData.js'
import {load} from './load.js'

class EpubBook extends Book {
  async initAsync (event) {
    try {
      this._props = await load(this._props, event)
      this._props.resources = this._props.attachment
      this._props.readingOrder = this._props.orderedCollection
      this._props.links = this._props.url
      this._props.creator = this._props.attributedTo
      return this
    } catch (err) {
      console.error('something went wrong', err.message)
      return null
    }
  }
  uploadMedia (upload) {
    // returns an array of FormData objects to upload
    return formData(this._props, upload)
  }
  get activity () {
    const publication = {
      type: 'reader:Publication',
      name: this._props.name
    }
    publication.attachment = this._props.attachment.map(item => item.activity)
    publication.totalItems = this._props.totalItems
    publication.attributedTo = this._props.attributedTo
    publication.url = this._props.url
    if (this._props.icon && this._props.icon.activity) {
      publication.icon = this._props.icon.activity
    }
    return publication
  }
}

export function createBook (event) {
  const book = new EpubBook()
  return book.initAsync(event)
}
