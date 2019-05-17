
import {render, html} from 'lighterhtml'
import * as activities from '../state/activities.js'

export function logoutModal (element) {
  const csurfMeta = document.querySelector('meta[name="csrf-token"]')
  let csurf
  if (csurfMeta) {
    csurf = csurfMeta.getAttribute('content')
  }
  return render(element, () => html`
    <div tabindex="-1" data-micromodal-close class="Modal-overlay">
      <div role="dialog" class="Modal-container" aria-modal="true" aria-labelledby="modal-1-title" >
        <header>
          <h2 id="modal-1-title" class="Modal-title">
            Sign Out
          </h2>
          <button aria-label="Close modal" data-micromodal-close class="Modal-close App-button">&times;</button>
        </header>
        <div id="modal-1-content" class="Modal-content">
          <p class="Modal-text">Are you sure you want to sign out?</p>
        <form action="/logout" class="Modal-row" method="post">
          <input type="hidden" name="_csrf" value="${csurf}">
          <button type="button" aria-label="Close modal" data-micromodal-close class="App-button">Cancel</button>
          <button class="TextButton">Sign Out</button>
        </form>
        </div>
      </div>
    </div>`)
}
export function loginModal (element) {
  return render(element, () => html`
  <div tabindex="-1" data-micromodal-close class="Modal-overlay">
    <div role="dialog" class="Modal-container" aria-modal="true" aria-labelledby="modal-1-title" >
      <header>
        <h2 id="modal-1-title" class="Modal-title">
          Sign In
        </h2>
        <button aria-label="Close modal" data-micromodal-close class="Modal-close App-button"></button>
      </header>
      <div id="modal-1-content" class="Modal-content">
        <p class="Modal-text">Sign in to use Rebus Ink</p>
      <div class="Modal-row">
        <span></span>
        <form action="/login" method="POST">
    <button class="TextButton">Sign In</button>
    </form></div>
      </div>
    </div>
  </div>`)
}
