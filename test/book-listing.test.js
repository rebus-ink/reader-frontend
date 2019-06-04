/* global it, describe */
import { html, fixture, expect } from '@open-wc/testing'

import '../components/book-listing.component.js'

describe('<book-listing>', () => {
  it('Listing with basic info', async () => {
    const el = await fixture(
      html`<book-listing .book=${{
        name: 'Book Title',
        id: 'https://example.com/id',
        attributedTo: [{ name: 'Fancy Author' }]
      }}></book-listing>`
    )
    expect(el).dom.to.equal(`<book-listing>
<a
  class=""
  href="/library/id"
>
  <img
    alt="undefined"
    class="BookCard-icon"
    data-lazy-src="/images/resize/240/0/%2Fstatic%2Fplaceholder-cover.jpg"
    src="/images/resize/240/0/%2Fstatic%2Fplaceholder-cover.jpg"
  >
</a>
<div class="BookCard-group">
  <h4 class="BookCard-title">
    <a
      class="BookCard-link"
      href="/library/id"
    >
      Book Title
    </a>
  </h4>
  <p class="BookCard-paragraph">
    <span class="BookCard-attribution">
      Fancy Author
    </span>
  </p>
  <p class="BookCard-total">
  </p>
</div></book-listing>`)
  })
  it('No render if no info', async () => {
    const el = await fixture(html`<book-listing></book-listing>`)
    expect(el).dom.to.equal(`<book-listing></book-listing>`)
  })
})
