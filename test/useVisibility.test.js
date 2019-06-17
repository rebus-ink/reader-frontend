/* global it, describe */
import { html, fixture, expect } from '@open-wc/testing'
import { styleMap } from 'lit-html/directives/style-map.js'
import './test-files/use-visibility-element.js'
export function rafPromise () {
  return new Promise(resolve => window.requestAnimationFrame(resolve))
}

describe('useVisibility', () => {
  it('Renders visible', async () => {
    const el = await fixture(html`<use-visibility></use-visibility>`)
    await rafPromise()
    expect(el).dom.to.equal('<use-visibility><p>visible</p></use-visibility>')
  })
  it.skip('Renders not visible', async () => {
    const el = await fixture(
      html`<div><p style=${styleMap({
        paddingTop: '3000px'
      })} id="test-p">&nbsp;</p><use-visibility></use-visibility></div>`
    )
    await rafPromise()
    expect(el).dom.to.equal(
      '<div><p style="padding-top: 3000px;" id="test-p">&nbsp;</p><use-visibility><p>not visible</p></use-visibility></div>'
    )
    document
      .getElementById('test-p')
      .parentElement.removeChild(document.getElementById('test-p'))
    await rafPromise()
    expect(el).dom.to.equal(
      '<div><use-visibility><p>visible</p></use-visibility></div>'
    )
  })
})
