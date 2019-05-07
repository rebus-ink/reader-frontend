
import component, {html} from 'neverland'
import {processChapter} from '../state/process-chapter.js'

export const Reader = component((context, h) => {
  const dom = processChapter(context.chapter)
  console.log(dom)
  return html`<div id="chapter" class="Chapter">
  <div class="Chapter-body">${dom}</div></div>`
})
