import {html} from 'lighterhtml'

export function importPage (context) {
  return html`
  <main class="Import" id="Import">
  <nav class="Menu Menu--reader" id="NavMenu"><a href="/library">Return</a></nav>
  <div>
  <h1>Import</h1>
  <p>Please stay on this page while your books are being uploaded. Navigating away from this page or reloading it will disrupt imports that are in progress.</p>
  <form is='epub-import'>
    <input type='file'>
    <div data-upload-progress></div>
    <ul data-upload-log></ul>
  </form>
  </div>
  </main>`
}
