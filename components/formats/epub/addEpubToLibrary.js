export async function addEpubToLibrary (contextPromise, api, global) {
  const context = await contextPromise
  const identifier = await api.activity.createAndGetID(context.book)
  context.book.id = identifier
  return context
}
