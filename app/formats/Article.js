import {Book} from './Book.js'
import {getGlobals} from './context.js'

export class Article extends Book {
  async initAsync (url) {
    const processURL = this.activities.processURL
    const data = await processURL(url)
    this._props = dataToProps(data)
    this._microformats = data.microformats
    this._html = data.html
    if (data.mercury) {
      this._article = data.mercury.content
    }
    return this
  }
  get activity () {
    return this._props
  }
  async uploadMedia () {
    const context = getGlobals()
    const upload = this.activities.upload
    const props = this._props
    try {
      const data = new context.FormData()
      const filename = 'article.html'
      const file = new context.File([this._html], filename, {
        type: 'text/html'
      })
      data.append('files', file)
      const result = await upload(data)
      props.url[0].href = result[filename]
      const articleData = new context.FormData()
      const articleFile = new context.File([this._article], filename, {
        type: 'text/html'
      })
      articleData.append('files', articleFile)
      const articleResult = await upload(data)
      props.attachment[0].url[0].href = articleResult[filename]
    } catch (err) {
      err.httpMethod = 'Article Parser'
      throw err
    }
  }
}

function dataToProps ({html, mercury, microformats, url}) {
  const props = {}
  props.url = [
    {
      type: 'Link',
      href: url,
      rel: ['alternate'],
      mediaType: 'text/html'
    }
  ]
  if (mercury) {
    props.name = mercury.title
    props.attachment = [{
      type: 'Document',
      name: mercury.title,
      summary: `Article named ${mercury.title}`,
      'reader:path': 'article',
      url: [
        {
          type: 'Link',
          href: '/',
          rel: ['alternate'],
          mediaType: 'text/html'
        }
      ],
      position: 0
    }]
    if (mercury.lead_image_url) {
      props.icon = {
        type: 'Image',
        url: [
          {
            type: 'Link',
            href: 'mercury.lead_image_url',
            rel: ['alternate']
          }
        ],
        rel: ['cover']
      }
    }
    if (mercury.author) { props.attributedTo = [{ type: 'Person', name: mercury.author }] }
  }
}

export function createArticle (url) {
  const article = new Article()
  return article.initAsync(url)
}
