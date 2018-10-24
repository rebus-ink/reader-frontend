class GKeyV {
  constructor ({ datastore }) {
    this.ttlSupport = false
    this.store = datastore
  }
  set (key, value, expires) {
    const store = this.store
    const doc = {
      key: this.store.key([this.namespace, key]),
      data: {
        value,
        expires
      },
      excludeFromIndexes: ['value', 'expires']
    }
    return store.upsert(doc)
  }
  get (key) {
    const store = this.store
    key = store.key([this.namespace, key])
    return store.get(key).then(data => {
      data = data[0]
      if (!data) {
        return data
      } else if (expired(data)) {
        return store.delete(key).then(data => undefined)
      } else {
        return data.value
      }
    })
  }
  delete (key) {
    const store = this.store
    key = store.key([this.namespace, key])
    return store.delete(key)
  }
  clear () {
    const store = this.store
    const query = store.createQuery(this.namespace).select('__key__')
    return query.run().then(data => {
      const keys = data[0].map(function (entity) {
        return entity[store.KEY]
      })
      return store.delete(keys)
    })
  }
}

function expired (data) {
  return typeof data.expires === 'number' && data.expires <= Date.now()
}

module.exports.GKeyV = GKeyV
