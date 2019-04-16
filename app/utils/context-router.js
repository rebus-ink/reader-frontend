import 'onpushstate'
import path2regexp from 'path-to-regexp'
import {createContext} from 'neverland'
import {arrify} from './arrify.js'

function asPath2RegExp (path, keys) {
  if (typeof path !== 'string') {
    throw new Error('Path must be string')
  }
  return path2regexp(path, keys)
}
// Need to make sure all values from URL are decoded properly
function createParams (match, keys) {
  const params = {}
  for (var
    value,
    i = 1,
    length = match.length;
    i < length; i++
  ) {
    value = match[i]
    params[keys[i - 1].name] = decodeURIComponent(value)
  }
  return params
}

function remove () {
  this.parentNode.removeChild(this)
}

export class Router {
  constructor (routes) {
    this._paths = {}
    this._context = createContext()
    window.addEventListener('popstate', this, false)
    window.addEventListener('pushstate', this, false)
    this.route(routes)
  }
  get context () { return this._context }
  get init () { return () => this.handleEvent({type: 'samestate'}) }
  get handleEvent () { return (event) => handleEvent(event, this, window.location) }
  get route () { return (routes = []) => route(routes, this._paths) }
  get navigate () { return (pathname, options) => navigate(pathname, options, this) }
  get refresh () { return () => refresh(this) }
}

// Props are the properties that should be on every route.
export function createRouter (routes) {
  const router = new Router(routes)
  return router
}

function route (routes, paths) {
  for (const routeOptions of arrify(routes)) {
    const {path = '(.*)'} = routeOptions
    const keys = []
    const re = asPath2RegExp(path, keys)
    const info = paths[re] = {
      keys: keys,
      re: re
    }
    info.options = routeOptions
  }
}
export function handleEvent (event, {context, _paths}, location) {
  const paths = _paths
  const old = context.value
  for (const key in paths) {
    const info = paths[key]
    const match = info.re.exec(location.pathname)
    if (match) {
      const {options} = info
      const request = Object.assign({
        protocol: location.protocol,
        origin: location.origin,
        href: location.href,
        pathname: location.pathname,
        hash: location.hash,
        absolute: location.pathname + location.search,
        search: location.search,
        query: new URLSearchParams(location.search),
        params: createParams(match, info.keys),
        type: event.type
      })
      const focusEffect = () => {
        let element
        if (request.hash) {
          element = document.querySelector(request.hash)
        } else {
          const focusable = document.querySelectorAll('button, [href]:not(link), input, select, textarea, [contentEditable=true], [tabindex]:not([tabindex="-1"])')
          for (const el of focusable) {
            const hidden = el.closest('[hidden]')
            if (!hidden && !element) {
              element = el
            }
          }
        }
        if (element) {
          element.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'})
          element.focus()
        }
      }
      return context.provide(Object.assign({request, old, focusEffect}, options))
    }
  }
}

export function refresh (router) {
  const pathname = window.location.pathname + window.location.search
  return navigate(pathname, false, router)
}

export function navigate (pathname, replace, router) {
  if (replace) {
    window.history.replaceState(window.history.state, document.title, pathname)
  } else if (pathname === (window.location.pathname + window.location.search)) {
    router.handleEvent({type: 'samestate'})
  } else {
    const navigator = document.createElement('a')
    navigator.href = pathname
    navigator.onclick = remove
    document.documentElement.insertBefore(navigator, document.documentElement.firstChild)
    navigator.click()
  }
}
