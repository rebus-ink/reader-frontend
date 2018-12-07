export const pageHead = (render, model, req) => {
  let token, id, streams
  if (req.user) {
    token = req.user.token
    id = req.user.id
    streams = req.user.streams
  } else {
    token = id = ''
    streams = {}
  }
  return render(model, ':pagehead')`
<!DOCTYPE html>
<html class="no-js">
<head>
<link media="all" rel="stylesheet" href="/static/styles/app.css">
<title>Rebus Reader</title>
<script src="/js/document-register-element.js"></script>
<script src="/js/jszip.min.js"></script>
<script src="/components/page-transitions.js" type="module"></script>
<script src="/components/nav-menu-toggle.js" type="module"></script>
<script src="/components/fetch.js" type="module"></script>
<script src="/components/epub-import-actions.js" type="module"></script>
<script src="/components/epub-import-component.js" type="module"></script>
<meta name="jwt-meta" content="${token}">
<meta name="rebus-user-id" content="${id}">
<link href="${streams.outbox}" rel="rebus-outbox">
<link href="${streams.upload}" rel="rebus-upload">
</head>
<body>`
}
