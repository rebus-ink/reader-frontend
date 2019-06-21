import { html } from 'lit-html'
import { component, useState, useEffect, useContext } from 'haunted'
import { classMap } from 'lit-html/directives/class-map.js'
import { navigate } from '../hooks/useRoutes.js'
import { ApiContext } from '../api-provider.component.js'

export const Library = el => {
  const { req, route } = el
  const api = useContext(ApiContext)
  let name, view
  if (req.params.collection) {
    name = req.params.collection
    view = () => html`<ink-collection collection=${name}></ink-collection>`
  } else {
    name = 'Uploads'
    view = () => html`<upload-section></upload-section>`
  }
  const [tags, setTags] = useState([])
  useEffect(
    () => {
      api
        .library({ limit: 10 })
        .then(library => setTags(library.tags))
        .catch(err => console.error(err))
    },
    [req]
  )
  useEffect(() => {
    api.events.on('tag', () => {
      api
        .library({ limit: 10 })
        .then(library => setTags(library.tags))
        .catch(err => console.error(err))
    })
  }, [])
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
    z-index: 2;
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
  ${view()}
  <collection-sidebar id="modal-1" aria-hidden="true" .current=${
  req.params.collection
} .collections=${tags}></collection-sidebar>

<ink-collection-modal></ink-collection-modal>
<ink-modal id="create-collection" aria-hidden="true">
    <strong slot="modal-title" class="Modal-name">Create Collection</strong>
    <confirm-action slot="modal-body" .action=${() => {
    const name = document.getElementById('collection-name').value
    document.getElementById('collection-name').value = ''
    const tag = {
      type: 'reader:Tag',
      tagType: 'reader:Collection',
      name
    }
    return api.activity.create(tag).then(() => {
      api.events.emit('tag')
      navigate(`/library/${encodeURIComponent(name)}`)
    })
  }} name="Create"><label class="Label">Name<br><input type="text" name="collection-name" id="collection-name"></label></confirm-action></ink-modal>
<ink-modal id="delete-collection" aria-hidden="true">
    <strong slot="modal-title" class="Modal-name">Delete Collection</strong>
    <confirm-action dangerous slot="modal-body" .action=${() => {
    return Promise.resolve()
      .then(() => {
        console.log(tags)
        if (tags) {
          const tag = tags.filter(
            tag => tag.name === req.params.collection
          )[0]
          return api.activity.delete(tag)
        }
      })
      .then(() => {
        document.getElementById('delete-collection').closer = true
        return navigate('/library')
      })
  }} name="Delete"><p>Are you sure you want to delete this collection?</p><p>(This action will not delete the collection's items.)</p></confirm-action></ink-modal>

<ink-modal id="sign-out" aria-hidden="true">
    <strong slot="modal-title" class="Modal-name">Sign Out</strong>
    <confirm-action slot="modal-body" .action=${() =>
    api.logout()} name="Sign Out" dangerous>Are you sure that you want to sign out?</confirm-action></ink-modal>`
}
window.customElements.define(
  'ink-library',
  component(Library, window.HTMLElement, { useShadowDOM: false })
)

const LibraryHead = ({ name }) => {
  return html`<icon-button @click=${ev => {
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
