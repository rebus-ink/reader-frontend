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
<script src="/js/swup.min.js"></script>
<script src="/js/quill.min.js"></script>
<script src="/components/page-transitions.js" type="module"></script>
<script src="/components/nav-menu-toggle.js" type="module"></script>
<script src="/components/fetch.js" type="module"></script>
<script src="/js/importer.js" type="module"></script>
<script src="/js/annotations.js" type="module"></script>
<meta name="jwt-meta" content="${token}">
<meta name="rebus-user-id" content="${id}">
<link href="${streams.outbox}" rel="rebus-outbox">
<link href="${streams.upload}" rel="rebus-upload">
${[base]}
</head>
${body(render, model, req)}
</html>`
}
