import EventEmitter from 'eventemitter3'
const bus = new EventEmitter()

export const main = { state: {} }

export function getState () {
  return main.state
}

export function getContext () {
  return main.context
}
export function setState (state) {
  main.state = state
  bus.emit('state', state)
}
export function setContext (context) {
  main.context = context
  bus.emit('context', context)
}
export function on (eventName, listener) {
  bus.on(eventName, listener)
}
export function once (eventName, listener) {
  bus.once(eventName, listener)
}
export function removeListener (eventName, listener) {
  bus.removeListener(eventName, listener)
}
