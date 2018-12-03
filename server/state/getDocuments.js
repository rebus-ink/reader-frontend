
const { arrify } = require('../utils/arrify.js')
function getDocuments (publication) {
  const attachments = arrify(publication.attachment)
  const documents = {}
  attachments.forEach(item => {
    const path = item['reader:path']
    documents[path] = item
  })
  return documents
}

module.exports.getDocuments = getDocuments
