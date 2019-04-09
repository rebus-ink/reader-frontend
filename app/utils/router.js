// originally based on https://github.com/WebReflection/hyperhtml-app/blob/master/index.js, ISC License (MIT equivalent)
import 'onpushstate'
import path2regexp from 'path-to-regexp'
export class Router {
  constructor () {
    this._params = {}
    this._paths = {}
    window.addEventListener('popstate', this, false)
    window.addEventListener('pushstate', this, false)
  }
  get (path = '(.*)', callback) {
    const keys = []
    const re = asPath2RegExp(path, keys)
    const info = this._paths[re] || (this._paths[re] = {
      keys: keys,
      cb: [],
      re: re
    })
    info.cb.push(callback)
    return this
  }
  'delete' (path, callback) {
    const re = asPath2RegExp(path, [])
    const info = this._paths[re]
    var index = info ? info.cb.lastIndexOf(callback) : -1
    if (index !== -1) {
      info.cb.splice(index, 1)
    }
    return this
  }
  param (name, cb) {
    this._params[name] = cb
    return this
  }
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
  }
  async handleEvent (event) {
    const paths = this._paths
    for (const key in paths) {
      if (paths.hasOwnProperty(key)) {
        const info = paths[key]
        const match = info.re.exec(window.location.pathname)
        if (match) {
          const keys = []
          const params = this._params
          const context = {
            params: createParams(match, info.keys),
            type: event.type
          }
          for (const key in context.params) {
            if (params.hasOwnProperty(key)) {
              keys.push(key)
            }
          }
          if (keys.length) {
            for (const key of keys) {
              await params[key](context, context.params[key])
            }
          }
          for (const callback of info.cb) {
            await callback(context)
          }
        }
      }
    }
  }
}

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
    if (value) params[keys[i - 1].name] = value
  }
  return params
}

function remove () {
  this.parentNode.removeChild(this)
}
