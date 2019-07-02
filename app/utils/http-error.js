import { errorEvent } from './error-event.js'
export class HTTPError extends Error {
  constructor (type, message, response) {
    super(message)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HTTPError)
    }
    this.httpMethod = type
    this.status = response.status
    this.response = response
  }
}

export function createError (type, message, response) {
  const err = new HTTPError(type, message, response)
  return errorEvent(err)
}
