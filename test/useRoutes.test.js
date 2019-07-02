/* global it, describe */
import { html, fixture, expect } from '@open-wc/testing'
import './test-files/use-routes-element.js'
export function rafPromise () {
  return new Promise(resolve => window.requestAnimationFrame(resolve))
}

describe('useRoutes', () => {
  it('Renders initial route and updates', async () => {
    const el = await fixture(html`<use-routes></use-routes>`)
    expect(el).dom.to.equal(
      '<use-routes><p>prop1 and {"testParam":"context.html"}</p></use-routes>'
    )
    var customEvent = new window.CustomEvent('pushstate')
    customEvent.current = '/'
    customEvent.next = new URL('/test', window.location.href)
    window.dispatchEvent(customEvent)
    await rafPromise()
    expect(el).dom.to.equal(
      '<use-routes><p>prop1 and {"testParam":"test"}</p></use-routes>'
    )
  })
  it('Renders null params', async () => {
    const el = await fixture(html`<use-routes></use-routes>`)
    var customEvent = new window.CustomEvent('pushstate')
    customEvent.current = '/'
    customEvent.next = new URL('/test/test', window.location.href)
    window.dispatchEvent(customEvent)
    await rafPromise()
    expect(el).dom.to.equal(
      '<use-routes><p>prop2 and {"testParam":"test","testParam2":"test","testParam3":null}</p></use-routes>'
    )
  })
  it('Handles no routes', async () => {
    const el = await fixture(html`<useless-routes></useless-routes>`)
    var customEvent = new window.CustomEvent('pushstate')
    customEvent.current = '/'
    customEvent.next = new URL('/test/test', window.location.href)
    window.dispatchEvent(customEvent)
    await rafPromise()
    expect(el).dom.to.equal('<useless-routes><p> and </p></useless-routes>')
  })
})
