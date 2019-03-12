module.exports.page = (render, model, req, body) => {
  return render(model, ':pagehead')`
<!DOCTYPE html>
<html class="no-js login">
<head>
<link media="all" rel="stylesheet" href="/static/styles/app.css">
<title>Rebus Reader</title>
</head>
${body(render, model, req)}
</html>`
}
