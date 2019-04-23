
import {addArticleModal} from './add-article-modal.js'
import MicroModal from 'micromodal'
import 'file-drop-element'
import { arrify } from '../utils/arrify.js'
import $, {html} from 'neverland'

export const shelf = $(({state}, {dispatch}) => {
  return html`<div>
  <div class="App-menu"><ol class="App-menu-list"><li><details class="MenuButton">
  <summary class="MenuButton-summary App-button" aria-label="Upload actions">...</summary>
  <details-menu role="menu" class="MenuButton-body">
  <button role="menuitem" class="MenuItem" onclick="${() => {
    addArticleModal(document.getElementById('modal-1'), dispatch)
    MicroModal.show('modal-1')
  }}">Add web article...</button>
  <label role="menuitem" class="MenuItem">Upload files...
<input type="file" hidden onchange="${() => dispatch({type: 'files', dispatch, files: document.getElementById('file-selector').files})}" name="file-selector" id="file-selector" accept=".epub,application/epub+zip" multiple></label>
  </details-menu>
  </details></li><li><h2 class="App-title">Uploads</h2></li><li><button class="App-sidebar-closer App-button" data-sidebar='right-sidebar' data-component="sidebar-toggle" aria-label="Close library shelf sidebar">&times;</button></li></ol></div>
  ${files(state.uploads)}
  <file-drop accept="application/epub+zip" class="Library-file-drop" id="shelf-file-drop" onfiledrop="${(event) => dispatch({type: 'files', dispatch, files: event.files})}" multiple>
</file-drop></div>`
})

const files = (state) => {
  if (state && state.length !== 0) {
    return html`<div><h3 class="App-nav-label">In Progress
    <span class="Spinner">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="square" stroke-linejoin="arcs"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg></span></h3>
      <ol class="Library-upload-list">${arrify(state).map(upload => {
    html`<li>${upload.activity.name} (${upload.type})</li>`
  })}</ol></div>`
  } else {
    return html`<p class="Library-no-uploads">Drop file here to get started</p>`
  }
}
