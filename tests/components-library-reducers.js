const tap = require('tap')
require('basichtml').init()
const reducers = require('../app/library/state.js')

tap.test('setState', test => {
  const state = reducers.setState({ test: 'test' }, 'what-what')
  test.matches({ test: 'test' }, state)
  test.end()
})

tap.test('loading', async test => {
  const stateObj = { test: 'New State', updated: '2019-04-17T18:07:19.845Z' }
  let testState
  await reducers.loading(
    { updated: '2019-04-17T18:07:05.632Z', test: 'Old State' },
    ({ state }) => {
      testState = state
    },
    { library: () => Promise.resolve(stateObj) }
  )
  test.matches(stateObj, testState)
  test.end()
})

tap.test('create-collection', async test => {
  const tag = { name: 'test' }
  let testPayload
  await reducers.createCollection(
    {
      tag
    },
    ({ payload }) => {
      testPayload = payload
    }
  )
  test.matches(
    {
      type: 'reader:Stack',
      name: 'test'
    },
    testPayload
  )
  test.end()
})

tap.test('remove-from-collection', async test => {
  const tag = { type: 'reader:Stack', name: 'test', id: 'id' }
  const refPayload = {
    type: 'Remove',
    object: tag,
    target: {
      id: 'bookId'
    }
  }
  let testPayload
  await reducers.removeFromCollection(
    {
      tag,
      book: 'bookId'
    },
    ({ payload }) => {
      testPayload = payload
    }
  )
  test.matches(refPayload, testPayload)
  test.end()
})

tap.test('add-to-collection', async test => {
  const tag = { type: 'reader:Stack', name: 'test', id: 'id' }
  const refPayload = {
    type: 'Add',
    object: tag,
    target: {
      id: 'bookId'
    }
  }
  let testPayload
  await reducers.addToCollection(
    {
      tag,
      book: 'bookId'
    },
    ({ payload }) => {
      testPayload = payload
    }
  )
  test.matches(refPayload, testPayload)
  test.end()
})

tap.test('activities-update', async test => {
  const tag = { type: 'reader:Stack', name: 'test', id: 'id' }
  const activity = 'add'
  const refPayload = {
    type: 'Add',
    object: tag,
    target: {
      id: 'bookId'
    }
  }
  let testType, testPayload
  await reducers.activitiesUpdate(
    {
      activity,
      payload: refPayload
    },
    action => {
      testType = action.type
    },
    {
      add: payload => {
        testPayload = payload
        return Promise.resolve({ test: 'test' })
      }
    }
  )
  test.matches('loading', testType)
  test.matches(refPayload, testPayload)
  test.end()
})

tap.test('activities-update - 400 error', async test => {
  const activity = 'add'
  let testType
  await reducers.activitiesUpdate(
    {
      activity,
      payload: {}
    },
    action => {
      testType = action.type
    },
    {
      add: payload => {
        const err = new Error('test error')
        err.response = { status: 400 }
        throw err
      }
    }
  )
  test.matches('loading', testType)
  test.end()
})

tap.test('activities-update - regular error', async test => {
  const activity = 'add'
  let testType
  await reducers.activitiesUpdate(
    {
      activity,
      payload: {}
    },
    action => {
      testType = action.type
    },
    {
      add: payload => {
        const err = new Error('test error')
        throw err
      }
    }
  )
  test.matches('error-event', testType)
  test.end()
})

class Epub {
  initAsync (config) {
    this._Epub = false
    this._Article = false
    if (config.detail) {
      this._Epub = true
    } else if (config) {
      this._Article = true
    }
    return Promise.resolve(this)
  }
  uploadMedia () {
    return Promise.resolve(this)
  }
  get activity () {
    return { type: 'Activity', epub: this._Epub, article: this._Article }
  }
}

tap.test('files - basic add', test => {
  let testActivity
  const context = {
    Epub,
    Article: Epub,
    zipModule: () => Promise.resolve(),
    activities: {
      create (activity) {
        testActivity = activity
      }
    },
    dispatch: act => {
      test.ok(act.type)
      if (act.type === 'loading') {
        test.matches(testActivity, {
          type: 'Activity',
          epub: true,
          article: false
        })
        count = ++count
      }
      if (count === 2) {
        test.end()
      }
    }
  }
  let count = 0
  const action = {
    files: [
      { name: 'file.epub', type: 'application/epub+zip' },
      { name: 'file2.epub', type: 'application/epub+zip' }
    ]
  }
  reducers.addFiles(action, context)
})

tap.test('files - article add', test => {
  let testActivity
  const context = {
    Epub,
    Article: Epub,
    zipModule: () => Promise.resolve(),
    activities: {
      create (activity) {
        testActivity = activity
      }
    },
    dispatch: act => {
      test.ok(act.type)
      if (act.type === 'loading') {
        test.matches(testActivity, {
          type: 'Activity',
          epub: false,
          article: true
        })
        test.end()
      }
    }
  }
  const action = {
    url: 'https://example.com/'
  }
  reducers.add(action, context)
})
