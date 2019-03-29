import DOMPurify from 'dompurify'
import {HTTPError} from '../utils/http-error.js'
import {getAlternate} from '../state/get-alternate.js'

async function fetchWrap (...args) {
  const response = await window.fetch(...args)
  if (!response.ok) {
    throw new HTTPError('Activities Request', response.statusText, response)
  }
  return response
}

const purifyConfig = {
  KEEP_CONTENT: false,
  RETURN_DOM: true,
  RETURN_DOM_FRAGMENT: true,
  RETURN_DOM_IMPORT: true,
  FORBID_TAGS: ['style', 'link'],
  FORBID_ATTR: ['style']
}

export async function processToC (activity, book) {
  const alt = getAlternate(activity)
  const response = await fetchWrap(alt)
  const text = await response.body()
  const clean = DOMPurify.sanitize(text, purifyConfig)
  const base = new URL(activity['reader:path'], book.base)
  const links = clean.querySelectorAll('[href]')
  links.forEach(link => {
    const href = link.getAttribute('href')
    const full = new URL(href, base).href
    link.setAttribute('href', full)
  })
  const contents = clean.querySelector('[epub\\:type="toc"]')
  const landmarks = clean.querySelector('[epub\\:type="landmarks"]')
  return {contents, landmarks}
}
