
import {render, html} from 'lighterhtml'
import * as activities from '../state/activities.js'

export function logoutModal (element) {
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
        <div class="Modal-row">
          <button aria-label="Close modal" data-micromodal-close class="App-button">Cancel</button>
          <button class="TextButton" onclick=${activities.logout}>Sign Out</button></div>
        </div>
      </div>
    </div>`)
}
export function loginModal (element) {
  return render(element, () => html`
  <div tabindex="-1" data-micromodal-close>
    <div role="dialog" aria-modal="true" aria-labelledby="modal-1-title" >
      <header>
        <h2 id="modal-1-title">
          Sign In
        </h2>
        <button aria-label="Close modal" data-micromodal-close></button>
      </header>
      <div id="modal-1-content">
      <form action="/login" method="POST">
    <button class="Button">Sign In</button>
    </form>
      </div>
    </div>
  </div>`)
}
