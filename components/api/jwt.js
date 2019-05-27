import { jwtDecode } from '../../js/vendor/jwt-decode.js'
import { createError } from '../../app/utils/http-error.js'

export async function getJWT (context, global) {
  if (!context.token) {
    const response = await refreshJWT(context, global)
    context.token = response.token
  } else {
    const decoded = jwtDecode(context.token)
    const date = decoded.exp * 1000
    const nowish = Date.now() + 60000
    if (date < nowish) {
      const response = await refreshJWT(context, global)
      context.token = response.token
    }
  }
  return context.token
}

async function refreshJWT ({ csrfToken }, global) {
  // const csurfMeta = document.querySelector('meta[name="csrf-token"]')
  // let csurf
  // if (csurfMeta) {
  //   csurf = csurfMeta.getAttribute('content')
  // }
  const response = await global.fetch('/refresh-token', {
    credentials: 'include',
    method: 'POST',
    headers: new global.Headers({
      'content-type': 'application/ld+json',
      'csrf-token': csrfToken
    })
  })
  if (response.status === 403) {
    document.body.dispatchEvent(
      new global.CustomEvent('reader:login', {
        detail: { response }
      })
    )
  }
  if (!response.ok) {
    throw createError('POST/JWT Refresh', response.statusText, response)
  }
  return response.json()
}
