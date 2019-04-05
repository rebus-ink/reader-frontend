
import 'onpushstate'
import path2regexp from 'path-to-regexp'
import {createContext} from 'neverland'

function asPath2RegExp (path, keys) {
  if (typeof path !== 'string') {
    path = path.toString()
    path = path.slice(1, path.lastIndexOf('/'))
  }
  return path2regexp(path, keys)
}
// Need to make sure all values from URL are decoded properly
function createParams (match, keys) {
  for (var
    value,
    params = {},
    i = 1,
    length = match.length;
    i < length; i++
  ) {
    value = match[i]
    if (value) params[keys[i - 1].name] = decodeURIComponent(value)
  }
  return params
}

function remove () {
  this.parentNode.removeChild(this)
}

export function createRouter (routes = [], {request, h}) {
  const context = createContext()
  const paths = {}
  let state = {}
  for (const route of routes) {
    const {path = '(.*)'} = route
    const keys = []
    const re = asPath2RegExp(path, keys)
    const info = paths[re] || (paths[re] = {
      keys: keys,
      re: re
    })
    info.options = route
  }
  const router = {
    routes,
    request,
    h,
    navigate (pathname, options) {
      switch (true) {
        case !!options:
          switch (true) {
            case !!options.replace:
            case !!options.replaceState:
              window.history.replaceState(window.history.state, document.title, pathname)
              break
          }
          break
        case pathname === (window.location.pathname + window.location.search):
          this.handleEvent({type: 'samestate'})
          break
        default:
          var doc = document
          var html = doc.documentElement
          var navigator = doc.createElement('a')
          navigator.href = pathname
          navigator.onclick = remove
          html.insertBefore(navigator, html.firstChild)
          navigator.click()
          break
      }
      return this
    },
    async handleEvent (event) {
      for (const key in paths) {
        if (paths.hasOwnProperty(key)) {
          const info = paths[key]
          const match = info.re.exec(window.location.pathname)
          if (match) {
            const {options} = info
            const request = Object.assign(router.request, {
              url: window.location,
              params: createParams(match, info.keys),
              type: event.type
            }, options.request)
            const h = Object.assign(router.h, options.h)
            if (options.state) state = await options.state({request, h, oldState: state}, options.stateOptions)
            context.provide({router, request, h, state, options})
          }
        }
      }
    }
  }
  context.provide({router})
  window.addEventListener('popstate', router, false)
  window.addEventListener('pushstate', router, false)
  return context
}
