import { fetchWrap, get } from './fetch.js'
import { html } from 'lit-html'
import { testProp } from './allowed-css-props.js'
import Readability from '../../js/vendor/readability'
import createDOMPurify from 'dompurify'
const DOMPurify = createDOMPurify()

export function createBookAPI (context, api, global) {
  return {
    // Returns sanitised DOM for chapter
    get chapter () {
      return (url, readable, book) => getChapter(url, readable, book, api)
    },
    // Return the publication object
    async get (url, path) {
      return get(url, context, global).then(book => {
        book.navigation = addNav(book)
        return book
      })
    },
    // Load a given chapter, falling back to first or current chapter
    async load (book, path) {
      if (path) {
        return this.chapter(`${book.id}${path}`)
      } else if (book.position && book.position.path) {
        return this.chapter(`${book.id}${book.position.path}`)
      } else {
        const chapter = book.readingOrder[0]
        return this.chapter(`${book.id}${chapter.url}`)
      }
    },
    savePosition (publication, path, newLocation) {
      const activity = {
        type: 'Read',
        context: publication.id
      }
      if (newLocation) {
        activity['oa:hasSelector'] = {
          type: 'reader:Location',
          location: newLocation,
          path
        }
      }
      return api.activity.save(activity)
    },
    async notes (document, page = 1) {
      const notesEndpoint = await api.profile.notes()
      const bookId = document.match(/(publication-[^/]+)/)[0]
      document = document.replace(bookId + '/', bookId)
      const notesURL = `${notesEndpoint}?limit=100&page=${page}&document=${document}`
      try {
        let notes = await get(notesURL)
        // while (notes.items.length <= notes.totalItems) {
        //   page = page + 1
        //   const newNotes = await get(
        //     `${context.profile.id}/notes?limit=100&page=${page}&document=${document}`
        //   )
        //   notes.items = notes.items.concat(newNotes.items)
        // }
        return notes
      } catch (err) {
        console.error(err)
      }
    },
    // Returns sanitised DOM for navigation, generating if necessary
    async navigation (book) {
      const { resources = [] } = book
      const bookPath = new URL(book.id).pathname
      const navResource = resources.filter(resource =>
        resource.rel.includes('contents')
      )[0]
      if (navResource) {
        const navURL = new URL(navResource.url, book.id).href
        return this.chapter(navURL, true)
      } else {
        const dom = html`<ol class="Contents-list">${book.readingOrder.map(
          (resource, index) => {
            if (!resource.name) {
              resource.name = `Chapter ${index + 1}`
            }
            return html`<li class="Contents-item"><a  class="Contents-link" href=${`/reader${bookPath}${
              resource.url
            }`}>${resource.name}</a></li>`
          }
        )}</ol>`
        return { lang: 'en', dom }
      }
    }
  }
}
function DocumentFetch (url) {
  return new Promise((resolve, reject) => {
    let request = new window.XMLHttpRequest()
    request.responseType = 'document'
    request.withCredentials = true
    request.open('GET', url)
    request.onload = () => {
      if (request.status >= 200 && request.status < 300) {
        resolve(request.responseXML)
      } else {
        reject(request)
      }
    }
    request.onerror = () => reject(request)
    request.send()
  })
}

export async function getChapter (url, readable, book, api) {
  let next, notes
  if (book) {
    const rootPath = new URL(book.id).pathname
    const index = book.readingOrder
      .map(item => `${rootPath}${item.url}`)
      .indexOf(url)
    const nextItem = book.readingOrder[index + 1]
    if (nextItem) {
      next = `${rootPath}${nextItem.url}`
    }
    notes = await api.book.notes(url)
  }
  let response = await DocumentFetch(url)
  const baseURL = new URL(url, window.location)
  const baseHost = baseURL.host
  response.querySelectorAll('a[href]').forEach(element => {
    const href = element.getAttribute('href')
    try {
      const { pathname, hash, host } = new URL(href, baseURL)
      if (host === baseHost) {
        element.setAttribute(
          'href',
          `/reader${pathname}${hash ? `#${url}:${hash.slice(1)}` : ''}`
        )
        element.dataset.href = href
      }
    } catch (err) {
      console.error(err)
    }
  })
  let doc
  let stylesheets = []
  response = addLocations(response, url)
  const lang = getLang(response)
  let readability
  if (readable) {
    readability = new Readability(response).parse()
    doc = readability.content
  } else {
    doc = response.documentElement.outerHTML
    stylesheets = Array.from(
      response.querySelectorAll('link[rel="stylesheet"]')
    ).map(node => node.getAttribute('href'))
  }
  const nodes = await processChapter(doc, url)
  const styleNodes = []
  for (const cssURL of stylesheets) {
    const baseURL = new URL(url, window.location)
    const baseHost = baseURL.host
    const { host, href } = new URL(cssURL, baseURL)
    if (host === baseHost) {
      const response = await fetchWrap(href, {
        credentials: 'include'
      })
      const text = await response.text()
      styleNodes.push(await processChapter(`<style>${text}</style>`, cssURL))
    }
  }
  return {
    lang,
    dom: styleNodes.concat(nodes),
    url,
    stylesheets,
    next,
    readability,
    notes
  }
}

function addLocations (doc, base) {
  doc.querySelectorAll('[id]').forEach(element => {
    element.id = `${base}:${element.id}`
  })
  let locationNumber = 0
  const symbols = doc.querySelectorAll(
    'p, h1, h2, h3, h4, h5, h6, li, table, dd, dt, div > img:only-child, figure > img'
  )
  symbols.forEach(element => {
    if (element.tagName.toLowerCase() === 'img') {
      element = element.parentElement
    }
    if (!element.id) {
      element.id = `${base}:${locationNumber}`
      locationNumber = locationNumber + 1
    }
  })
  return doc
}

function getLang (doc) {
  let lang = doc.documentElement.getAttribute('lang')
  if (!lang) {
    lang = doc.documentElement.getAttributeNS(
      'http://www.w3.org/XML/1998/namespace',
      'lang'
    )
  }
  if (!lang) {
    lang = doc.documentElement.getAttribute('xml:lang')
  }
  return lang
}

const purifyConfig = {
  KEEP_CONTENT: false,
  RETURN_DOM: true,
  RETURN_DOM_FRAGMENT: true,
  WHOLE_DOCUMENT: true,
  RETURN_DOM_IMPORT: true,
  ALLOW_TAGS: ['reader-highlight'],
  FORBID_TAGS: ['meta', 'form', 'title', 'link'],
  FORBID_ATTR: ['srcset', 'action', 'background', 'poster']
}

export function processChapter (chapter, base) {
  const baseURL = new URL(base, window.location)
  const clean = DOMPurify.sanitize(chapter, purifyConfig)
  // Move into function to process before Readability
  clean.querySelectorAll(`[src]`).forEach(element => {
    const src = element.getAttribute('src')
    try {
      const path = new URL(src, baseURL).pathname
      element.setAttribute('src', path)
    } catch (err) {
      console.error(err)
    }
  })
  // This probably only works for SVG inlined in HTML files, not for SVG in XHTML
  clean.querySelectorAll('image[*|href]').forEach(element => {
    const src = element.getAttributeNS('http://www.w3.org/1999/xlink', 'href')
    try {
      const path = new URL(src, baseURL).pathname
      element.setAttributeNS('http://www.w3.org/1999/xlink', 'href', path)
    } catch (err) {
      console.error(err)
    }
  })
  clean.querySelectorAll(`svg [href], link[href]`).forEach(element => {
    const src = element.getAttribute('href')
    try {
      const path = new URL(src, baseURL).pathname
      element.setAttribute('href', path)
    } catch (err) {
      console.error(err)
    }
  })
  const body = clean.querySelector('body')
  body.replaceWith(...body.childNodes)
  const head = clean.querySelector('head')
  if (head) {
    head.replaceWith(...head.childNodes)
  }
  return clean
}

// Based on sample from https://github.com/cure53/DOMPurify/tree/master/demos, same license as DOMPurify

const regex = /(url\("?)(?!data:)/gim

function replacer (match, p1) {
  try {
    const url = new URL(p1, window.location)
    if (url.host === window.location.host) {
      return p1
    } else {
      return ''
    }
  } catch (err) {
    console.error(err)
    return ''
  }
}

function addStyles (output, styles) {
  for (var prop = styles.length - 1; prop >= 0; prop--) {
    if (styles[styles[prop]]) {
      var url = styles[styles[prop]].replace(regex, replacer)
      styles[styles[prop]] = url
    }
    if (
      styles[styles[prop]] &&
      typeof styles[styles[prop]] === 'string' &&
      testProp(styles[prop])
    ) {
      output.push(styles[prop] + ':' + styles[styles[prop]] + ';')
    }
  }
}

function addCSSRules (output, cssRules) {
  for (var index = cssRules.length - 1; index >= 0; index--) {
    var rule = cssRules[index]
    // check for rules with selector
    if (rule.type === 1 && rule.selectorText) {
      output.push(rule.selectorText + '{')
      if (rule.style) {
        addStyles(output, rule.style)
      }
      output.push('}')
      // check for @media rules
    } else if (rule.type === rule.MEDIA_RULE) {
      output.push('@media ' + rule.media.mediaText + '{')
      addCSSRules(output, rule.cssRules)
      output.push('}')
      // check for @font-face rules
    } else if (rule.type === rule.FONT_FACE_RULE) {
      output.push('@font-face {')
      if (rule.style) {
        addStyles(output, rule.style)
      }
      output.push('}')
      // check for @keyframes rules
    } else if (rule.type === rule.KEYFRAMES_RULE) {
      output.push('@keyframes ' + rule.name + '{')
      for (var i = rule.cssRules.length - 1; i >= 0; i--) {
        var frame = rule.cssRules[i]
        if (frame.type === 8 && frame.keyText) {
          output.push(frame.keyText + '{')
          if (frame.style) {
            addStyles(output, frame.style)
          }
          output.push('}')
        }
      }
      output.push('}')
    }
  }
}

DOMPurify.addHook('uponSanitizeElement', function (node, data) {
  if (data.tagName === 'style') {
    var output = []
    addCSSRules(output, node.sheet.cssRules)
    node.textContent = output.join('\n')
  }
})

DOMPurify.addHook('afterSanitizeAttributes', function (node) {
  if (node.hasAttribute('style')) {
    var styles = node.style
    var output = []
    for (var prop = styles.length - 1; prop >= 0; prop--) {
      // we re-write each property-value pair to remove invalid CSS
      if (node.style[styles[prop]] && regex.test(node.style[styles[prop]])) {
        var url = node.style[styles[prop]].replace(regex, replacer)
        node.style[styles[prop]] = url
      }
      output.push(styles[prop] + ':' + node.style[styles[prop]] + ';')
    }
    // re-add styles in case any are left
    if (output.length) {
      node.setAttribute('style', output.join(''))
    } else {
      node.removeAttribute('style')
    }
  }
})

function addNav (book) {
  const rootPath = new URL(book.id).pathname
  const navigation = {}
  let index
  if (book.position && book.position.path) {
    navigation.current = {
      path: book.position.path,
      location: book.position.location
    }
    index = book.readingOrder
      .map(item => `${rootPath}${item.url}`)
      .indexOf(book.position.path)
  } else {
    index = 0
    navigation.current = {
      path: `${rootPath}${book.readingOrder[0].url}`,
      location: ''
    }
  }
  const nextItem = book.readingOrder[index + 1]
  if (nextItem) {
    navigation.next = {
      path: `${rootPath}${nextItem.url}`
    }
  }
  const prevItem = book.readingOrder[index - 1]
  if (prevItem) {
    navigation.previous = {
      path: `${rootPath}${prevItem.url}`
    }
  }
  return navigation
}
