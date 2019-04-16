const path = require('path')
const cappadonna = require('./utils/cappadonna-modules-fork.js')
const test = cappadonna(
  path.join(__dirname, '../app/utils/context-router.js'),
  {
    require: { expose: 'contextRouter' }
  }
)
const testRoute = {
  path: '/:testParam',
  prop1: 'prop1'
}
const testRoute2 = {
  path: '/:testParam/:testParam2',
  prop2: 'prop2'
}
const fallbackRoute = {
  prop3: 'prop3'
}
const routes = [testRoute, testRoute2, fallbackRoute]

test('basic router - invalid route', async (page, t) => {
  await page
    .evaluate(async () => {
      const { createRouter } = require('contextRouter')
      let tested
      try {
        createRouter([{ path: {} }])
      } catch (err) {
        tested = true
        t.equals(err.message, 'Path must be string')
      }
      if (!tested) throw new Error('Error not tested')
    })
    .catch(err => console.error(err))
  t.end()
})

test('basic router init', async (page, t) => {
  await page
    .evaluate(async routes => {
      const { createRouter } = require('contextRouter')
      const router = createRouter(routes)
      t.ok(router)
      router.init()
      t.equals(router.context.value.prop3, 'prop3')
    }, routes)
    .catch(err => console.error(err))
  t.end()
})

test('router init, no fallback', async (page, t) => {
  await page
    .evaluate(async routes => {
      const { createRouter } = require('contextRouter')
      const router = createRouter()
      t.ok(router)
      router.route([routes[0], routes[1]])
      router.init()
      t.notOk(router.context.value)
    }, routes)
    .catch(err => console.error(err))
  t.end()
})

test('router - simple routing', async (page, t) => {
  await page
    .evaluate(async routes => {
      const { createRouter, handleEvent } = require('contextRouter')
      const router = createRouter(routes)
      handleEvent({ type: 'popstate' }, router, {
        protocol: 'https:',
        origin: 'https://example.com',
        href: 'https://example.com/testing',
        pathname: '/testing',
        hash: '',
        absolute: '/testing',
        search: ''
      })
      t.matches(router.context.value, {
        request: {
          protocol: 'https:',
          origin: 'https://example.com',
          href: 'https://example.com/testing',
          pathname: '/testing',
          hash: '',
          absolute: '/testing',
          search: '',
          params: { testParam: 'testing' },
          type: 'popstate'
        },
        old: undefined,
        path: '/:testParam',
        prop1: 'prop1'
      })
    }, routes)
    .catch(err => console.error(err))
  t.end()
})

test('router - focusEffect, no match', async (page, t) => {
  await page
    .evaluate(async routes => {
      const { createRouter, handleEvent } = require('contextRouter')
      const router = createRouter(routes)
      handleEvent({ type: 'popstate' }, router, {
        protocol: 'https:',
        origin: 'https://example.com',
        href: 'https://example.com/testing',
        pathname: '/testing',
        hash: '',
        absolute: '/testing',
        search: ''
      })
      router.context.value.focusEffect()
      t.equals(document.activeElement.tagName, 'BODY')
    }, routes)
    .catch(err => console.error(err))
  t.end()
})

test('router - focusEffect, first anchor', async (page, t) => {
  await page
    .evaluate(async routes => {
      const { createRouter, handleEvent } = require('contextRouter')
      const anchor = document.createElement('a')
      anchor.href = 'http://example.com'
      anchor.id = 'test-anchor'
      document.documentElement.insertBefore(
        anchor,
        document.documentElement.firstChild
      )
      const div = document.createElement('div')
      div.href = 'http://example.com'
      div.id = 'test-div'
      div.hidden = true
      div.innerHTML = '<button id="buttonId">test</button>'
      document.documentElement.insertBefore(
        div,
        document.documentElement.firstChild
      )
      const router = createRouter(routes)
      handleEvent({ type: 'popstate' }, router, {
        protocol: 'https:',
        origin: 'https://example.com',
        href: 'https://example.com/testing',
        pathname: '/testing',
        hash: '',
        absolute: '/testing',
        search: ''
      })
      router.context.value.focusEffect()
      t.equals(document.activeElement.id, 'test-anchor')
      t.equals(document.activeElement.tagName, 'A')
    }, routes)
    .catch(err => console.error(err))
  t.end()
})

test('router - focusEffect, hash', async (page, t) => {
  await page
    .evaluate(async routes => {
      const { createRouter, handleEvent } = require('contextRouter')
      const paragraph = document.createElement('p')
      paragraph.href = 'http://example.com'
      paragraph.id = 'test-paragraph'
      paragraph.setAttribute('tabindex', '-1')
      document.documentElement.insertBefore(
        paragraph,
        document.documentElement.firstChild
      )
      const router = createRouter(routes)
      handleEvent({ type: 'popstate' }, router, {
        protocol: 'https:',
        origin: 'https://example.com',
        href: 'https://example.com/testing',
        pathname: '/testing',
        hash: '#test-paragraph',
        absolute: '/testing',
        search: ''
      })
      router.context.value.focusEffect()
      t.equals(document.activeElement.id, 'test-paragraph')
      t.equals(document.activeElement.tagName, 'P')
    }, routes)
    .catch(err => console.error(err))
  t.end()
})
test('router - focusEffect, options.focusEffect()', async (page, t) => {
  await page
    .evaluate(async routes => {
      const { createRouter, handleEvent } = require('contextRouter')
      let called
      routes[1].focusEffect = () => {
        called = true
      }
      const router = createRouter(routes)
      handleEvent({ type: 'popstate' }, router, {
        protocol: 'https:',
        origin: 'https://example.com',
        href: 'https://example.com/testing/testing',
        pathname: '/testing/testing',
        hash: '',
        absolute: '/testing/testing',
        search: ''
      })
      router.context.value.focusEffect()
      t.ok(called)
    }, routes)
    .catch(err => console.error(err))
  t.end()
})

test('router - first one route, then the other', async (page, t) => {
  await page
    .evaluate(async routes => {
      const { createRouter, handleEvent } = require('contextRouter')
      const router = createRouter(routes)
      const old = {
        request: {
          protocol: 'https:',
          origin: 'https://example.com',
          href: 'https://example.com/testing',
          pathname: '/testing',
          hash: '',
          absolute: '/testing',
          search: '',
          params: { testParam: 'testing' },
          type: 'popstate'
        },
        old: undefined,
        path: '/:testParam',
        prop1: 'prop1'
      }
      handleEvent({ type: 'popstate' }, router, {
        protocol: 'https:',
        origin: 'https://example.com',
        href: 'https://example.com/testing',
        pathname: '/testing',
        hash: '',
        absolute: '/testing',
        search: ''
      })
      handleEvent({ type: 'popstate' }, router, {
        protocol: 'https:',
        origin: 'https://example.com',
        href: 'https://example.com/testing/testing',
        pathname: '/testing/testing',
        hash: '',
        absolute: '/testing/testing',
        search: ''
      })
      t.matches(router.context.value, {
        request: {
          protocol: 'https:',
          origin: 'https://example.com',
          href: 'https://example.com/testing/testing',
          pathname: '/testing/testing',
          hash: '',
          absolute: '/testing/testing',
          search: '',
          params: { testParam: 'testing', testParam2: 'testing' },
          type: 'popstate'
        },
        old,
        path: '/:testParam/:testParam2',
        prop2: 'prop2'
      })
    }, routes)
    .catch(err => console.error(err))
  t.end()
})

test('navigate - same state', async (page, t) => {
  await page
    .evaluate(async routes => {
      const { createRouter } = require('contextRouter')
      const router = createRouter(routes)
      router.navigate(window.location.pathname)
      // A same state nav should call handleEvent which in this case should get the fallback route
      t.equals(router.context.value.prop3, 'prop3')
    }, routes)
    .catch(err => console.error(err))
  t.end()
})
test('refresh - same as navigate same state', async (page, t) => {
  await page
    .evaluate(async routes => {
      const { createRouter } = require('contextRouter')
      const router = createRouter(routes)
      router.refresh()
      // A same state nav/refresh should call handleEvent which in this case should get the fallback route
      t.equals(router.context.value.prop3, 'prop3')
    }, routes)
    .catch(err => console.error(err))
  t.end()
})
test('navigate - replace', async (page, t) => {
  await page
    .evaluate(async routes => {
      const { createRouter } = require('contextRouter')
      const router = createRouter(routes)
      let called = false
      window.history.replaceState = () => {
        called = true
      }
      router.navigate(window.location.pathname, true)
      // A replace nav should call window.history.replaceState
      t.equals(called, true)
    }, routes)
    .catch(err => console.error(err))
  t.end()
})
test('navigate - triggered click', async (page, t) => {
  await page
    .evaluate(async routes => {
      const { createRouter } = require('contextRouter')
      const router = createRouter(routes)
      router.navigate(window.location.pathname + '#hashname')
      // A same state nav should call handleEvent which in this case should get the fallback route
      t.equals(window.location.hash, '#hashname')
    }, routes)
    .catch(err => console.error(err))
  t.end()
})

// tap.test('context-router init and handleEvent', test => {
//   const {route, init, handleEvent, router} = contextRouter
//   route([testRoute, testRoute2, fallbackRoute])
//   init()
//   test.matches(router.value, { request:
//     { protocol: 'https:',
//       origin: 'https://example.com',
//       url: undefined,
//       pathname: '/testing',
//       hash: '',
//       absolute: '/testing',
//       search: '',
//       params: { testParam: 'testing' },
//       type: 'samestate' },
//   old: undefined,
//   path: '/:testParam',
//   prop1: 'prop1' })

//   window.location.pathname = '/testing1/test2'
//   handleEvent({type: 'popstate'})
//   const request2 = router.value.request
//   const prop2 = router.value.prop2
//   test.ok(router.value.old)
//   test.equal(request2.params.test2, 'testing1')
//   test.equal(request2.params.testParam2, 'test2')
//   test.equal(prop2, 'prop2')

//   window.location.pathname = '/'
//   handleEvent({type: 'popstate'})
//   const request3 = router.value.request
//   const prop3 = router.value.prop3
//   test.equal(request3.params[0], '/')
//   test.equal(prop3, 'prop3')
//   test.end()
// })

// tap.test('context-router navigate', test => {
//   const {navigate} = contextRouter
//   test.doesNotThrow(navigate.bind(undefined, '/path'))
//   window.location.pathname = '/path'
//   test.doesNotThrow(navigate.bind(undefined, '/path'))
//   test.end()
// })

// tap.test('context-router refresh', test => {
//   const {refresh} = contextRouter
//   test.doesNotThrow(refresh)
//   test.end()
// })
