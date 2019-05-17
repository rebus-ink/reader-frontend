
import {render, html} from 'lighterhtml'

export function addArticleModal (element, dispatch) {
  return render(element, () => html`
  <div tabindex="-1" data-micromodal-close class="Modal-overlay">
    <div role="dialog" class="Modal-container" aria-modal="true" aria-labelledby="modal-1-title" >
      <header>
        <h2 id="modal-1-title" class="Modal-title">
          Add Article
        </h2>
        <button aria-label="Close modal" data-micromodal-close class="Modal-close App-button">&times;</button>
      </header>
      <div id="modal-1-content" class="Modal-content">
        <label class="Modal-text">
            URL:
          <input type="url" onchange="${change}" name="article-url" id="article-url" class="Dialog-input" autocomplete="off" autofocus>
          </label>
        <div class="Modal-row">
          <button aria-label="Close modal" data-micromodal-close class="App-button">Cancel</button>
          <button class="TextButton" data-micromodal-close onclick="${() => dispatch({type: 'article', url: document.getElementById('article-url').value})}">Add</button>
        </div>
      </div>
    </div>
  </div>`)
}

function change (event) {
  console.log(event)
}
