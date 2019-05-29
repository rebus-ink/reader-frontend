/* This module needs to:

- Get JWT, decode using https://github.com/auth0/jwt-decode and check expiry.
- Renew JWT if expired or less than 10 seconds away from expiry
- Get configuration from profile
- Send new activities to outbox. Including:
  - Create publication
  - Create document
  - Create note
  - Update publication/document/note
  - Delete publication/document/note
  - Read activity
- Upload file
- Fetch library
- Fetch publication
- Fetch chapter (including markup)

should be initially based on fetch.js

*/
import { get, fetchWrap } from './api/fetch.js'
import { createProfileAPI } from './api/profile.js'
import { createBookAPI } from './api/book.js'
import { createActivityAPI } from './api/activity.js'
import { createEventsApi } from './api/events.js'
import { createUploadApi } from './api/uploads.js'

export function createAPI ({ csrfToken, token = null }, global = window) {
  const context = { token, profile: null, books: new Map(), csrfToken }
  const api = {
    get logout () {
      return () => logout(context, global)
    },
    async library (tag) {
      const url = await this.profile.library()
      if (tag) {
        url.searchParams.set('stack', tag)
      }
      const collection = await get(url, context, global)
      api.events.emit('library', collection)
      return collection
    }
  }
  api.profile = createProfileAPI(context, api, global)
  api.book = createBookAPI(context, api, global)
  api.activity = createActivityAPI(context, api, global)
  api.events = createEventsApi(context, api, global)
  api.uploads = createUploadApi(context, api, global)
  return api
}

async function logout (context, global) {
  context.token = null
  await fetchWrap('/logout', {
    credentials: 'include',
    method: 'POST',
    headers: new global.Headers({
      'content-type': 'application/ld+json',
      'csrf-token': context.csrfToken
    })
  })
  global.location.reload(true)
}
