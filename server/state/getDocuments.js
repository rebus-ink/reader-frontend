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

function getDocumentsById (publication) {
  const attachments = arrify(publication.attachment)
  const documents = {}
  attachments.forEach(item => {
    const id = item.id
    documents[id] = item
  })
  return documents
}

module.exports.getDocuments = getDocuments
module.exports.getDocumentsById = getDocumentsById
