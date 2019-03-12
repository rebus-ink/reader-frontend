module.exports.login = (render, model = { returnTo: '/' }) => {
  const action = `/login?returnTo=${encodeURIComponent(model.returnTo)}`
  return render()`<body>
  <div class="Login">
  <form action=${action} method="POST">
  <button class="Button">Log In</button>
  </form>
  </div></body>`
}
