/* global it, describe, beforeEach */
import { expect } from '@open-wc/testing'
import { createAPI } from '../components/api.state.js'

function once (emitter, eventName) {
  return new Promise(resolve => {
    function listener (event) {
      resolve(event)
    }
    emitter.once(eventName, listener)
  })
}

describe('api.uploads', () => {
  beforeEach(() => {
    window.api = createAPI()
  })
  it('correctly uses upload queue', async () => {
    let epubCalled = false
    let libraryCalled = false
    window.api.formats = {
      epub (file) {
        epubCalled = true
        return Promise.resolve({ type: 'Publication' })
      }
    }
    window.api.events.on('library', book => {
      libraryCalled = true
    })
    // window.api.events.on('importing', () => {
    //   console.log('importing')
    // })
    // window.api.events.on('imported', () => {
    //   console.log('imported')
    // })
    window.api.uploads.add(
      new window.File(['test'], 'epub.epub', {
        type: 'application/epub+zip'
      })
    )
    await once(window.api.events, 'queue-empty')
    expect(window.api.uploads.queue.length()).to.equal(0)
    expect(epubCalled).to.equal(true)
    expect(libraryCalled).to.equal(true)
  })
  it('does nothing if no available format', async () => {
    let libraryCalled = false
    window.api.library = () => {
      libraryCalled = true
      return Promise.resolve()
    }
    window.api.uploads.add(
      new window.File(['test'], 'text.text', {
        type: 'text/plain'
      })
    )
    await once(window.api.events, 'queue-empty')
    expect(window.api.uploads.queue.length()).to.equal(0)
    expect(libraryCalled).to.equal(false)
  })
})
