let activities
export class Book {
  constructor () {
    this._props = {}
  }
  static activities (mod) {
    activities = mod
  }
  async initAsync (file) {
    this._props.file = file
  }
  get activities () {
    return activities
  }
  get readingOrder () {
    return this._props['readingOrder']
  }
  get resources () {
    return this._props['resources']
  }
  get links () {
    return this._props['links']
  }
  get tags () {
    return this._props['tags']
  }
  get creator () {
    return this._props['creator']
  }
  get url () {
    return this._props['url']
  }
  get type () {
    return this._props['type']
  }
  get id () {
    return this._props['id']
  }
  get name () {
    return this._props['name']
  }
  get cover () {
    // this should get cover from the resources list and extract html. If not there then extract from url
    return this._props['cover']
  }
  uploadMedia (upload) {
    return null
  }
  get contents () {
    // this should get contents from the resources list and extract html
  }
  get publication () {
    const {readingOrder, resources, links, creator, url, type, id, name, cover} = this
    return {readingOrder, resources, links, creator, url, type, id, name, cover}
  }
  toJSON () {
    return this.activity
  }
  get activity () {
    const {attachment, orderedCollection, totalItems, url, attributedTo, id, tag, tags, icon, name} = this._props
    return {attachment, orderedCollection, totalItems, url, attributedTo, id, tag, tags, icon, name}
  }
}

export class ActivityBook extends Book {
  constructor (activity) {
    super()
    this._props = activity
    this._props.resources = this._props.attachment
    this._props.readingOrder = this._props.orderedCollection
    this._props.links = this._props.url
    this._props.creator = this._props.attributedTo
    this._props.cover = this._props.icon
    if (this._props.tag) {
      this._props.tags = this._props.tag
    }
  }
}
