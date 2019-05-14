
import component, {html, useLayoutEffect} from 'neverland'
import {processChapter} from '../state/process-chapter.js'

export const Reader = component((context, h) => {
  const rootEl = document.querySelector('#reader')
  const dom = processChapter(context.chapter)
  if (rootEl.dataset.active) {
    // Switch this to use the hash. If hash then scroll to
    useLayoutEffect(() => {
      let current
      if (document.location.hash) {
        console.log('scrolling to hash')
        if (document.location.hash.startsWith('#/')) {
          current = document.querySelector(`[data-location="${document.location.hash.replace('#', '')}"]`)
        } else {
          current = document.querySelector(document.location.hash)
        }
        if (current) current.scrollIntoView()
      } else {
        console.log('scrolling to top')
        window.scrollTo(0, 0)
      }
    }, [context.chapter.id, document.location.hash])
  }
  return html`<div id="chapter" class="Chapter">
  <div class="Chapter-body">${dom}</div></div>`
})
