export const login = (render, model = { returnTo: '/' }) => {
  const action = `/login?returnTo=${encodeURIComponent(model.returnTo)}`
  return render`<div class="FrontLayout">
  <form action=${action} method="POST">
  <button class="Button">Log In</button>
  </form>
  </div>${console.log('Login')}`
}
