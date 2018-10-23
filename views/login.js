export const login = (render, model) => {
  return render`<div class="FrontLayout">
  <form action="/login?returnTo=${encodeURIComponent(
    model.returnTo || '/'
  )}" method="POST">
  <button class="Button">Log In</button>
  </form>
  </div>`
}
