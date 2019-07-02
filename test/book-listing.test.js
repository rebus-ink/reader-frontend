/* global it, describe */
import { html, fixture, expect } from '@open-wc/testing'

import '../components/library/book-listing.js'

describe('<book-listing>', () => {
  it('Listing with basic info', async () => {
    const el = await fixture(
      html`<book-listing .book=${{
        name: 'Book Title',
        id: 'https://example.com/id',
        attributedTo: [{ name: 'Fancy Author' }]
      }}></book-listing>`
    )
    expect(el).dom.to.equalSnapshot()
    expect(el).shadowDom.to.equalSnapshot()
  })
})
