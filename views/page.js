const { getId } = require('./utils/get-id.js')
module.exports.page = (render, model, req, body) => {
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
<script src="/js/vendor/document-register-element.js"></script>
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
document.documentElement.classList.remove('no-js')
document.documentElement.classList.add('js-loading')
</script>`
  ]}
<meta name="csrf-token" content="${req.csrfToken()}">
<meta name="rebus-user-id" content="${req.user.id}" id="sub-user-id">
${[base]}
<link rel="icon" 
      type="image/png" 
      href="/static/rebus-ink-square-512.png">
      <link rel="apple-touch-icon" sizes="512x512" href="/static/rebus-ink-square-512.png">
</head>
${body(render, model, req)}
</html>`
}
