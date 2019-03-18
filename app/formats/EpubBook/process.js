import {getGlobals} from '../context.js'
import {getText} from './utils.js'
export async function process (props) {
  const context = getGlobals()
  const zip = props.zip
  const parser = new context.DOMParser()
  // For each resource we...
  for (var index = 0; index < props.attachment.length; index++) {
    const resource = props.attachment[index]
    // Read it from the Zip file
    if (resource.mediaType === 'application/xhtml+xml') {
      const file = await zip.file(decodeURI(resource.path)).async('string')
      // Just going to use this to extract data, hence the 'text/html'
      const fileDoc = parser.parseFromString(file, 'text/html')
      // Let's get the name! The first H1 would be the most sensible place to find it
      const h1text = getText(fileDoc.querySelector('h1'))
      // But sometimes book CMSes are extremely borked
      const h2text = getText(fileDoc.querySelector('h2'))
      // And they almost never have useful text in their title tags (you'd think they'd add something useful, but you'd be wrong). Let's grab it as a fallback anwyway.
      const titleText = getText(fileDoc.querySelector('title'))
      resource.activity.name = h1text || h2text || titleText
    }
  }
  return props
}
