module.exports.login = (render, model = { returnTo: '/' }) => {
  const action = `/login?returnTo=${encodeURIComponent(model.returnTo)}`
  return render()`<body>
  <div class="Login">
    <div tabindex="-1" class="Modal-overlay">
    <div role="dialog" class="Modal-container" aria-modal="true" aria-labelledby="modal-1-title" >
      <header>
        <h2 id="modal-1-title" class="Modal-title">
          Sign In
        </h2>
        <button aria-label="Close modal" class="Modal-close App-button"></button>
      </header>
      <div id="modal-1-content" class="Modal-content">
        <p class="Modal-text">Sign in to use Rebus Ink</p>
      <div class="Modal-row">
        <span></span>
        <form action="${action}" method="POST">
    <button class="TextButton">Sign In</button>
    </form></div>
      </div>
    </div>
  </div>
  </div></body>`
}
