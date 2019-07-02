import { hook, Hook } from 'haunted'
import assert from '../../js/vendor/nanoassert.js'

const moduleMap = new Map()

let pathArg, result
function fullPath (path) {
  if (path !== pathArg || !result) {
    pathArg = path
    result = new URL(path, window.location.href).href
  }
  return result
}

export const useModule = hook(
  class extends Hook {
    constructor (id, el) {
      super(id, el)
      this.module = null
    }
    update (path) {
      assert(typeof path === 'string')
      path = fullPath(path)
      return this.getModule(path)
    }
    getModule (path) {
      if (moduleMap.get(path)) {
        this.module = moduleMap.get(path)
      } else {
        this.el.host.moduleReady = getModule(path, this)
      }
      return this.module
    }
  }
)

async function getModule (path, hook) {
  hook.module = await import(path).catch(err =>
    console.error('Something went wrong', err)
  )
  moduleMap.set(path, hook.module)
  hook.el.update()
  return hook.module
}

// // useLazyModule needs an intersection observer

// const config = {
//   rootMargin: '50% 0px',
//   threshold: 0.01
// }
// const positionObserver = new window.IntersectionObserver(onIntersection, config)
// const hostToHook = new WeakMap()

// function onIntersection (entries) {
//   entries.forEach(entry => {
//     if (entry.intersectionRatio > 0) {
//       // Stop watching and load the image
//       positionObserver.unobserve(entry.target)
//       setVisibility(hostToHook.get(entry.target))
//     }
//   })
// }

function setVisibility (hook) {
  hook.visible = true
  return getModule(hook.path, hook)
}

// export const useLazyModule = hook(
//   class extends Hook {
//     constructor (id, el) {
//       super(id, el)
//       hostToHook.set(el.host, this)
//       positionObserver.observe(el.host)
//       this.module = null
//     }
//     update (path) {
//       this.path = fullPath(path)
//       return this.getModule(this.path)
//     }
//     getModule (path) {
//       if (moduleMap.get(path)) {
//         this.module = moduleMap.get(path)
//       } else if (this.visible) {
//         this.el.host.moduleReady = getModule(path, this)
//       }
//       return this.module
//     }
//   }
// )
