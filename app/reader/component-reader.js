
import component, {html, useLayoutEffect} from 'neverland'
import {processChapter} from '../state/process-chapter.js'

export const Reader = component((context, h) => {
  const rootEl = document.querySelector('#reader')
  if (rootEl.dataset.active) {
    const dom = processChapter(context.chapter)
    // Switch this to use the hash. If hash then scroll to
    // Then make library add the hash.
    useLayoutEffect(() => {
      console.log('use effect')
      let current
      if (document.location.hash) {
        if (document.location.hash.startsWith('#/')) {
          current = document.querySelector(`[data-location="${document.location.hash.replace('#', '')}"]`)
        } else {
          current = document.querySelector(document.location.hash)
        }
      }
      if (current) current.scrollIntoView()
    }, [context.location, dom])
    return html`<div id="chapter" class="Chapter">
    <div class="Chapter-body">${dom}</div></div>`
  } else {
    return html`<div id="chapter" class="Chapter">
    <div class="Chapter-body">${''}</div></div>`
  }
})
