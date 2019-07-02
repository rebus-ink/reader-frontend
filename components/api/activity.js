import { fetchWrap } from './fetch.js'
import { getToken } from './csrf.js'

export function createActivityAPI (context, api, global) {
  return {
    async save (action) {
      const outbox = await api.profile.outbox()
      return saveActivity(action, outbox, global)
    },
    create (payload) {
      const action = wrap(payload, 'Create')
      return this.save(action)
    },
    add (payload) {
      const action = wrap(payload, 'Add')
      return this.save(action)
    },
    remove (payload) {
      return this.save(payload)
    },
    update (payload) {
      const action = wrap(payload, 'Update')
      return this.save(action)
    },
    delete (payload) {
      const action = wrap(payload, 'Delete')
      return this.save(action)
    },
    async createAndGetID (payload) {
      const location = await this.create(payload, global)
      const response = await fetchWrap(location, {
        credentials: 'include',
        headers: new global.Headers({
          'content-type': 'application/ld+json'
        })
      })
      const activity = await response.json()
      if (activity.object) return activity.object.id
    },
    async upload (payload, endpoint) {
      const upload = endpoint || (await api.profile.upload())
      const csrfToken = getToken()
      try {
        const response = await fetchWrap(upload, {
          credentials: 'include',
          method: 'POST',
          body: payload,
          headers: new global.Headers({
            'csrf-token': csrfToken
          })
        })
        return response.json()
      } catch (err) {
        err.httpMethod = 'POST/Upload Media'
        throw err
      }
    }
  }
}

export async function saveActivity (action, outbox, global) {
  try {
    const csrfToken = getToken()
    const response = await fetchWrap(outbox, {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify(action),
      headers: new global.Headers({
        'content-type': 'application/ld+json',
        'csrf-token': csrfToken
      })
    })
    return response.headers.get('location')
  } catch (err) {
    err.httpMethod = 'POST/Outbox'
    throw err
  }
}

function wrap (payload, type) {
  if (payload.type !== type) {
    return {
      '@context': [
        'https://www.w3.org/ns/activitystreams',
        { reader: 'https://rebus.foundation/ns/reader' }
      ],
      type,
      object: payload
    }
  } else {
    return payload
  }
}
