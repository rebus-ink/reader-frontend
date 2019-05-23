import { hook, Hook } from 'haunted'
import './onpushstate.js'
import path2regexp from '../../js/vendor/path-to-regexp.js'

// This is heavily based on 'onpushstate' and 'hyperhtml-app' both MIT licensed.

function asPath2RegExp (path, keys) {
  return path2regexp(path, keys)
}

function createParams (match, keys) {
  const params = {}
  for (var value, i = 1, length = match.length; i < length; i++) {
    value = match[i]
    if (value) {
      params[keys[i - 1].name] = decodeURIComponent(value)
    } else {
      params[keys[i - 1].name] = null
    }
  }
  return params
}

export const useRoutes = hook(
  class extends Hook {
    constructor (id, el, routes) {
      super(id, el)
      this._paths = {}
      window.addEventListener('popstate', this, false)
      window.addEventListener('pushstate', this, false)
      this.route(routes)
      this.args = makeArgs({ type: 'samestate', next: window.location }, this)
    }
    teardown () {
      window.removeEventListener('popstate', this, false)
      window.removeEventListener('pushstate', this, false)
    }
    handleEvent (event) {
      this.args = makeArgs(event, this)
      this.el.update()
    }
    get route () {
      return routes => route(routes, this._paths)
    }
    update () {
      return this.args
    }
  }
)

function route (routes = [], paths) {
  for (const routeOptions of routes) {
    const { path = '(.*)' } = routeOptions
    const keys = []
    const re = asPath2RegExp(path, keys)
    const info = (paths[re] = {
      keys: keys,
      re: re
    })
    info.options = routeOptions
  }
}

function makeArgs (event, { _paths, args }) {
  const paths = _paths
  const location = event.next
  let old = {}
  if (args) {
    old = args[0]
  }
  let request = {}
  let options = {}
  for (const key in paths) {
    const info = paths[key]
    const match = info.re.exec(location.pathname)
    if (match) {
      options = info.options
      request = Object.freeze({
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
      return Object.freeze([options, request, old])
    }
  }
  return Object.freeze([options, request, old])
}
