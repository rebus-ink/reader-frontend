/* global it, describe */
import { html, fixture, expect, nextFrame } from '@open-wc/testing'

import { preview } from '../components/ink-chapter.js'
import { preview as previewBookList } from '../components/library/book-list.js'
import { preview as previewCollection } from '../components/library/collection.js'
import { preview as previewUploader } from '../components/library/uploader.js'
import { preview as previewButton } from '../components/widgets/button.js'
import { preview as previewDropdown } from '../components/widgets/dropdown.js'
import { preview as previewContents } from '../components/ink-contents.js'
import { names } from '../components/widgets/icon-button.js'

describe('<ink-chapter>', () => {
  it('ink-chapter basic render', async () => {
    const el = await fixture(preview())
    await el.updateComplete
    expect(el).dom.to.equalSnapshot()
    expect(el).shadowDom.to.equalSnapshot()
  })
})

describe('<book-list>', () => {
  it('book-list basic render', async () => {
    const el = await fixture(previewBookList())
    expect(el).dom.to.equalSnapshot()
    expect(el).shadowDom.to.equalSnapshot()
  })
})

describe('<ink-collection>', () => {
  it('ink-collection basic render', async () => {
    const el = await fixture(previewCollection())
    expect(el).dom.to.equalSnapshot()
  })
})

describe('<ink-uploader>', () => {
  it('ink-uploader basic render', async () => {
    const el = await fixture(previewUploader())
    expect(el).dom.to.equalSnapshot()
  })
})
describe('<ink-button>', () => {
  it('ink-button basic render', async () => {
    const el = await fixture(previewButton())
    expect(el).dom.to.equalSnapshot()
    expect(el).shadowDom.to.equalSnapshot()
  })
})
describe('<ink-dropdown>', () => {
  it('ink-dropdown basic render', async () => {
    const el = await fixture(previewDropdown())
    expect(el).dom.to.equalSnapshot()
    expect(el).shadowDom.to.equalSnapshot()
  })
})
describe('<ink-contents>', () => {
  it('ink-contents basic render', async () => {
    const el = await fixture(previewContents())
    await el.updateComplete
    await nextFrame()
    expect(el).dom.to.equalSnapshot()
    expect(el).shadowDom.to.equalSnapshot()
  })
})
describe('<icon-button>', () => {
  it('icon-button basic render', async () => {
    for (const name of names) {
      const el = await fixture(
        html`<icon-button selected name="${name}">Icon Label - Selected</icon-button>`
      )
      expect(el).dom.to.equalSnapshot()
      expect(el).shadowDom.to.equalSnapshot()
      const el2 = await fixture(
        html`<icon-button name="${name}">Icon Label - Not Selected</icon-button>`
      )
      expect(el2).dom.to.equalSnapshot()
      expect(el2).shadowDom.to.equalSnapshot()
    }
  })
})
