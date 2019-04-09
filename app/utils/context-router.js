
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

export const router = createContext()
const paths = {}

function handleEvent (event) {
  const old = router.value
  for (const key in paths) {
    if (paths.hasOwnProperty(key)) {
      const info = paths[key]
      const match = info.re.exec(window.location.pathname)
      if (match) {
        const {options} = info
        const request = Object.assign({
          protocol: window.location.protocol,
          origin: window.location.origin,
          url: window.location.href,
          pathname: window.location.pathname,
          search: window.location.search,
          query: new URLSearchParams(window.location.search),
          params: createParams(match, info.keys),
          type: event.type
        }, options.request)
        router.provide(Object.assign({request, old}, options))
      }
    }
  }
}
handleEvent({type: 'samestate'})
window.addEventListener('popstate', handleEvent, false)
window.addEventListener('pushstate', handleEvent, false)

export function addRoutes (routes = []) {
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
}

export function navigate (pathname, options) {
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
}
