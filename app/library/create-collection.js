
import {render, html} from 'lighterhtml'

export function createCollectionModal (element, dispatch) {
  async function sendEvent (event) {
    const name = document.getElementById('collection-name').value
    document.getElementById('collection-name').value = ''
    const tag = {
      type: 'reader:Stack',
      name
    }
    dispatch({type: 'create-collection', dispatch, tag})
  }
  return render(element, () => html`
    <div tabindex="-1" data-micromodal-close class="Modal-overlay">
      <div role="dialog" class="Modal-container" aria-modal="true" aria-labelledby="modal-1-title" >
        <header>
          <h2 id="modal-1-title" class="Modal-title">
            Create a Collection
          </h2>
          <button aria-label="Close modal" data-micromodal-close class="Modal-close App-button">&times;</button>
        </header>
        <div id="modal-1-content" class="Modal-content">
          <label class="Modal-text">
            Name:
            <input type="text" id="collection-name" size="25" class="Dialog-input" autocomplete="off" autofocus>
          </label>
        <div class="Modal-row">
          <button aria-label="Close modal" data-micromodal-close class="App-button">Cancel</button>
          <button class="TextButton" data-micromodal-close onclick=${sendEvent}>Create</button></div>
        </div>
      </div>
    </div>`)
}
