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
  </div><button data-component="full-screen" class="Button Button--floating" aria-label="Full screen" id="full-screen-button"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg></button>
  </main>`
}
