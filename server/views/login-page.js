module.exports.page = (render, model, req, body) => {
  return render(model, ':pagehead')`
<!DOCTYPE html>
<html class="no-js login">
<head>
<link media="all" rel="stylesheet" href="/static/styles/app.css">
<title>Rebus Reader</title>

<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
${body(render, model, req)}
</html>`
}
