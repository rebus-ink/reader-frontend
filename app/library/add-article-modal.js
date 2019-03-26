
import {render, html} from 'lighterhtml'

export function addArticleModal (element) {
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
        <form onsubmit="${submit}" class="AddForm">
          <label for="article-url">URL</label>
          <input type="url" onchange="${change}" name="article-url" id="article-url">
          <button class="Button">Add</button>
        </form>
      </div>
    </div>
  </div>`)
}

function change (event) {
  console.log(event)
}
function submit (event) {
  event.preventDefault()
}
