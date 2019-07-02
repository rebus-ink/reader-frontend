import { hook, Hook } from 'haunted'
import assert from '../../js/vendor/nanoassert.js'

let pathArg, result
function fullPath (path) {
  if (path !== pathArg || !result) {
    pathArg = path
    result = new URL(path, window.location.href).href
  }
  return result
}

export const useScripts = hook(
  class extends Hook {
    constructor (id, el) {
      super(id, el)
      this.el = el
    }
    update (paths = [], checker) {
      assert(Array.isArray(paths))
      if (!checker()) {
        paths = paths
          .map(path => fullPath(path))
          .map(path => loadJS(path, () => this.el.update(), true))
        return false
      } else {
        return true
      }
    }
  }
)

// loadJS from https://github.com/filamentgroup/loadJS/blob/master/loadJS.js MIT license

const srcMap = {}

function loadJS (src, cb, ordered) {
  if (srcMap[src]) return srcMap[src]
  var tmp
  var ref = document.getElementsByTagName('script')[0]
  var script = document.createElement('script')
  srcMap[src] = script

  if (typeof cb === 'boolean') {
    tmp = ordered
    ordered = cb
    cb = tmp
  }

  script.src = src
  script.async = !ordered
  ref.parentNode.insertBefore(script, ref)

  if (cb && typeof cb === 'function') {
    script.onload = cb
  }
  return script
}
