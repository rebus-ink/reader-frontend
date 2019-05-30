import { uploadMedia } from '../uploadMedia.js'
import { initEpub } from './initEpub.js'
import { addEpubToLibrary } from './addEpubToLibrary.js'

export async function createEpub (file, context, api, global) {
  const zip = await global.JSZip.loadAsync(file, { base64: false })
  const bookContext = { file, books: context.books, zip }
  const init = await initEpub(bookContext, api, global)
  const created = await addEpubToLibrary(init, api, global)
  const uploaded = await uploadMedia(created, api, global)
  return uploaded
}
