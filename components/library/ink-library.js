import { html } from 'lit-html'
import { component, useState, useEffect, useContext } from 'haunted'
import { classMap } from 'lit-html/directives/class-map.js'

export const Library = el => {
  const { req, route } = el
  console.log(req, route)
  let name
  if (req.params.collection) {
    name = req.params.collection
  } else {
    name = 'Uploads'
  }
  return html`<style>
  ink-library {
    display: block;
    padding: 0;
  }
  library-head {
    background-color: white;
    margin: 0;
    padding: 0.25rem 1rem;
    position: sticky;
    top: 0;
    max-height: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  upload-section {
    display: block;
    padding: 1rem;
  }
  library-head .Library-name {
    text-transform: uppercase;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--medium);
  }
  </style><library-head name=${name}></library-head>
  <upload-section></upload-section>
  <collection-sidebar id="modal-1" aria-hidden="true"></collection-sidebar>`
}
window.customElements.define(
  'ink-library',
  component(Library, window.HTMLElement, { useShadowDOM: false })
)

const LibraryHead = ({ name }) => {
  return html`<icon-button .click=${ev => {
    document.querySelector('collection-sidebar').open = true
  }} name="menu">Menu Sidebar</icon-button> <span class="Library-name">${name}</span> <span></span>`
}
LibraryHead.observedAttributes = ['name']

window.customElements.define(
  'library-head',
  component(LibraryHead, window.HTMLElement, { useShadowDOM: false })
)

const UploadSection = el => {
  return html`
  <ink-uploader></ink-uploader>
  <recent-books></recent-books>`
}

window.customElements.define(
  'upload-section',
  component(UploadSection, window.HTMLElement, { useShadowDOM: false })
)
