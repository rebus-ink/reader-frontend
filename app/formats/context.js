
let context = window
let parser = new context.DOMParser()
export function setWindowContext (window) {
  context = window
  parser = new context.DOMParser()
}

export function getParser () {
  return parser
}

export function getGlobals () {
  return context
}
