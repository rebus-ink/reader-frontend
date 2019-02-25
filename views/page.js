const { getId } = require('./utils/get-id.js')
module.exports.page = (render, model, req, body) => {
  let token, id, streams
  if (req.user) {
    token = req.user.token
    id = req.user.id
    streams = req.user.streams
  } else {
    token = id = ''
    streams = {}
  }
  let base
  if (model.chapter) {
    const url = `/reader/${encodeURIComponent(getId(model.book.id))}/${
      model.chapter['reader:path']
    }`
    base = `<base href="${url}">`
  } else {
    base = ''
  }
  return render(model, ':pagehead')`
<!DOCTYPE html>
<html class="no-js">
<head>
<link media="all" rel="stylesheet" href="/static/styles/app.css">
<title>Rebus Reader</title>
<script src="/js/document-register-element.js"></script>
<script src="/js/s.min.js"></script>
${[
    `<script>
import('/js/module/index.js');
window.supportsDynamicImport = true
</script>
<script>
if (!window.supportsDynamicImport) {
  System.import('/js/nomodule/index.js')
}
</script>`
  ]}
<meta name="jwt-meta" content="${token}">
<meta name="csrf-token" content="${req.csrfToken()}">
<meta name="rebus-user-id" content="${id}">
<link href="${streams.outbox}" rel="rebus-outbox">
<link href="${streams.library}" rel="rebus-library">
<link href="${streams.upload}" rel="rebus-upload">
${[base]}
</head>
${body(render, model, req)}
</html>`
}
