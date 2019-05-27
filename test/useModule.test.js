/* global it, describe */
import { html, fixture, expect, nextFrame } from '@open-wc/testing'
import { passes } from './test-files/use-module-element.js'

describe('useModule', () => {
  it('Renders fallback first then re-renders', async () => {
    const path = '/test/test-files/test-module.js'
    const el = await fixture(
      html`<use-module-element .path=${path}></use-module-element>`
    )
    expect(passes[0]).to.equal(null)
    await el.moduleReady
    await nextFrame()
    expect(passes[1].test).to.equal('This is a test module')
    expect(el).dom.to.equal(
      '<use-module-element><p>This is a test module</p></use-module-element>'
    )
  })
  it('Renders immediately with module if available', async () => {
    const el = await fixture(
      html`<use-module-element .path=${'/test/test-files/test-module.js'}></use-module-element>`
    )
    expect(el).dom.to.equal(
      '<use-module-element><p>This is a test module</p></use-module-element>'
    )
  })
})

describe('useLazyModule', () => {
  it('Renders fallback first then re-renders', async () => {
    const path = '/test/test-files/test-lazy-module.js'
    const el = await fixture(
      html`<use-lazy-module .path=${path}></use-lazy-module>`
    )
    expect(el).dom.to.equal(
      '<use-lazy-module><p>Module is loading</p></use-lazy-module>'
    )
    await el.moduleReady
    await nextFrame()
    expect(el).dom.to.equal(
      '<use-lazy-module><p>This is another test module</p></use-lazy-module>'
    )
  })
  it('Renders immediately with module if available', async () => {
    const path = '/test/test-files/test-lazy-module.js'
    const el = await fixture(
      html`<use-lazy-module .path=${path}></use-lazy-module>`
    )
    expect(el).dom.to.equal(
      '<use-lazy-module><p>This is another test module</p></use-lazy-module>'
    )
  })
})
