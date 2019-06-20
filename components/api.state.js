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
import { createFormatsAPI } from './formats/index.js'
import { getToken } from './api/csrf.js'

export function createAPI (global = window) {
  const context = { profile: null, books: new Map() }
  const api = {
    get logout () {
      return () => logout(context, global)
    },
    async library (params) {
      const url = await this.profile.library()
      const searchParams = new URLSearchParams(params).toString()
      const collection = await get(`${url}?${searchParams}`, context, global)
      return collection
    }
  }
  api.profile = createProfileAPI(context, api, global)
  api.book = createBookAPI(context, api, global)
  api.activity = createActivityAPI(context, api, global)
  api.events = createEventsApi(context, api, global)
  api.uploads = createUploadApi(context, api, global)
  api.formats = createFormatsAPI(context, api, global)
  return api
}

async function logout (context, global) {
  const csrfToken = getToken()
  await fetchWrap('/logout', {
    credentials: 'include',
    method: 'POST',
    headers: new global.Headers({
      'content-type': 'application/ld+json',
      'csrf-token': csrfToken
    })
  })
  global.location.reload(true)
}
