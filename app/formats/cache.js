
import {getAlternate} from '../state/get-alternate.js'

const link = document.createElement('link')
const supportsPreload = link.relList && link.relList.supports && link.relList.supports('preload')
export function cache (book) {
  const results = []
  book.readingOrder.forEach((item, index) => {
    if (book.isNext(item)) {
      const alt = getAlternate(item)
      results.push(preload(item.id))
      results.push(preload(`/process-chapter?resource=${encodeURIComponent(alt)}&path=${item['reader:path']}&bookId=${book.id}`))
    } else {
      const alt = getAlternate(item)
      results.push(prefetch(item.id))
      results.push(prefetch(`/process-chapter?resource=${encodeURIComponent(alt)}&path=${item['reader:path']}&bookId=${book.id}`))
    }
  })
  return Promise.all(results)
}

function preload (url) {
  return Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = supportsPreload ? 'preload' : 'prefetch'
    link.href = url
    link.as = 'fetch'
    link.onload = resolve
    link.onerror = reject
    document.head.appendChild(link)
  })
}

function prefetch (url) {
  return Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    link.as = 'fetch'
    link.onload = resolve
    link.onerror = reject
    document.head.appendChild(link)
  })
}
