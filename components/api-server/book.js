import { fetchWrap, get } from './fetch.js'

export function createBookAPI (context, api, global) {
  return {
    get chapter () {
      return url => getChapter(url, global)
    },
    async get (bookId) {
      const url = `/${bookId}`
      if (context.books.get(url)) {
        return context.books.get(url)
      } else {
        const data = await get(url, context, global)
        context.books.get(url, data)
        return data
      }
    }
  }
}

export async function getChapter (url, global) {
  const response = await fetchWrap(url, {
    credentials: 'include',
    headers: new global.Headers({
      'content-type': 'application/ld+json'
    })
  })
  return response.json()
}
