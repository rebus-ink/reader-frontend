import { BookListing } from './book-listing.js'
import { render, html } from 'lit-html'
const tap = window.tap
// Render component to body, test it.

tap.test('test test', function (t) {
  render(
    BookListing(
      {
        book: { name: 'Book Title', id: 'https://example.com/id' }
      },
      html
    ),
    document.body
  )
  console.log(document.body.innerHTML)
  t.ok(document.querySelector('.BookCard-title'))
  t.end()
})
