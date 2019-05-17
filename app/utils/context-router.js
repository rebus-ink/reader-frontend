import 'onpushstate'
import path2regexp from 'path-to-regexp'
import { arrify } from './arrify.js'
import component, {
  render,
  useContext,
  useEffect,
  createContext
} from 'neverland'

function asPath2RegExp (path, keys) {
  if (typeof path !== 'string') {
    throw new Error('Path must be string')
  }
  return path2regexp(path, keys)
}
// Need to make sure all values from URL are decoded properly
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

function remove () {
  this.parentNode.removeChild(this)
}

export class Router {
  constructor (routes, defaultContext = {}) {
    this._paths = {}
    this._roots = []
    this._context = createContext(defaultContext)
    window.addEventListener('popstate', this, false)
    window.addEventListener('pushstate', this, false)
    this.route(routes)
  }
  get context () {
    return this._context
  }
  get init () {
    return () => this.handleEvent({ type: 'samestate' })
  }
  get handleEvent () {
    return event => handleEvent(event, this, window.location)
  }
  get route () {
    return (routes = []) => route(routes, this._paths, this._roots)
  }
  get navigate () {
    return (pathname, options) => navigate(pathname, options, this)
  }
  get refresh () {
    return () => refresh(this)
  }
}

// Props are the properties that should be on every route.
export function createRouter (routes) {
  const router = new Router(routes)
  return router
}

function route (routes, paths, roots) {
  for (const routeOptions of arrify(routes)) {
    const { path = '(.*)' } = routeOptions
    const keys = []
    const re = asPath2RegExp(path, keys)
    const info = (paths[re] = {
      keys: keys,
      re: re
    })
    info.options = routeOptions
  }
  arrify(routes).forEach(route => roots.push(route.root))
}
export function handleEvent (event, { context, _paths, _roots }, location) {
  const paths = _paths
  const old = context.value
  for (const key in paths) {
    const info = paths[key]
    const match = info.re.exec(location.pathname)
    if (match) {
      const { options } = info
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
        if (request.hash && !request.hash.startsWith('#/')) {
          element = document.querySelector(request.hash)
        } else {
          const focusable = document.querySelectorAll(
            'button, [href]:not(link), input, select, textarea, [contentEditable=true], [tabindex]:not([tabindex="-1"])'
          )
          for (const el of focusable) {
            const hidden = el.closest('[hidden]')
            if (!hidden && !element) {
              element = el
            }
          }
        }
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          })
          element.focus()
        } else {
          document.body.focus()
        }
      }
      return context.provide({
        request,
        old,
        focusEffect: options.focusEffect || focusEffect,
        route: options
      })
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
  } else if (
    pathname === window.location.pathname + window.location.search &&
    router
  ) {
    router.handleEvent({ type: 'samestate' })
  } else {
    const navigator = document.createElement('a')
    navigator.href = pathname
    navigator.onclick = remove
    document.documentElement.insertBefore(
      navigator,
      document.documentElement.firstChild
    )
    navigator.click()
  }
}

// This needs to have per-route roots
export function createRouterComponent (componentRoutes, options) {
  const router = createRouter(componentRoutes)
  router.init()
  const roots = router._roots
  const h = {
    setActivity (selector) {
      for (const root of roots) {
        if (root !== selector) {
          document.querySelector(root).hidden = true
          document.querySelector(root).removeAttribute('data-active')
        } else {
          document.querySelector(root).dataset.active = 'true'
          document.querySelector(root).hidden = false
        }
      }
    },
    navigate: router.navigate,
    refresh: router.refresh,
    provides (name, value) {
      if (!this[name]) {
        this[name] = value
      }
    }
  }
  for (const routeOptions of componentRoutes) {
    const root = document.querySelector(routeOptions.root)
    root.hidden = true
    render(
      root,
      component(() => {
        const { request, old, focusEffect, route } = useContext(router.context)
        const context = { request, old, focusEffect }
        h.setActivity(route.root)
        // useEffect(focusEffect)
        return routeOptions.render(context, h)
      })
    )
  }
}
