import { fetchWrap } from './fetch.js'
import { getJWT } from './jwt.js'

export function createActivityAPI (context, api, global) {
  return {
    async save (action) {
      const JWT = await getJWT(context, global)
      const outbox = await api.profile.outbox()
      return saveActivity(action, outbox, JWT, global)
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
    async createAndGet (payload) {
      const location = await this.create(payload, global)
      const JWT = await getJWT(context, global)
      const response = await fetchWrap(location, {
        headers: new global.Headers({
          'content-type': 'application/ld+json',
          Authorization: `Bearer ${JWT}`
        })
      })
      return response.json()
    },
    async upload (payload) {
      const JWT = await getJWT(context, global)
      const upload = await api.profile.upload()
      try {
        const response = await fetchWrap(upload, {
          credentials: 'include',
          method: 'POST',
          body: payload,
          headers: new global.Headers({
            Authorization: `Bearer ${JWT}`
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

export async function saveActivity (action, outbox, JWT, global) {
  try {
    const response = await fetchWrap(outbox, {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify(action),
      headers: new global.Headers({
        'content-type': 'application/ld+json',
        Authorization: `Bearer ${JWT}`
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
