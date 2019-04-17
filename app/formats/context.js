
let context
(function (global) {
  context = global
}).call(this, typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {})

let parser
if (context.DOMParser) {
  parser = new context.DOMParser()
}
export function setWindowContext (window) {
  context = window
  if (context.DOMParser) {
    parser = new context.DOMParser()
  }
}

export function getParser () {
  return parser
}

export function getGlobals () {
  return context
}
