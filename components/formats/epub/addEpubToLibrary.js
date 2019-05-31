import assert from '../../../js/vendor/nanoassert.js'

export async function addEpubToLibrary (contextPromise, api, global) {
  const context = await contextPromise
  assert(context.book, 'No publication found to create')
  const identifier = await api.activity.createAndGetID(context.book)
  context.book.id = identifier
  return context
}
