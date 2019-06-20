import { html } from 'lit-html'
import { component, useContext, useState, useEffect } from 'haunted'
import { ApiContext } from '../api-provider.component.js'
import { createAPI } from '../api.state.js'
import { classMap } from 'lit-html/directives/class-map.js'
import '../widgets/button.js'
import '../widgets/dropdown.js'
import '../widgets/icon-button.js'
import '../modals/menu-modal.js'
import './book-list.js'

// function animationPromise (elem) {
//   return new Promise((resolve, reject) => {
//     function animation (event) {
//       elem.removeEventListener('transitionend', animation)
//       resolve()
//     }
//     elem.addEventListener('animationend', animation, {once: true})
//   })
// }

export const title = 'Collection: `<ink-collection>`'

export const description = `The upload section of the recents view`

// http://localhost:8080/demo/?component=/components/library/collection.js
export const preview = () => {
  const api = createAPI()

  const books = [
    {
      name: 'Book Title 1',
      id: 'https://example.com/id',
      attributedTo: [{ name: 'Fancy Author' }],
      resources: [{ rel: ['cover'], url: '/static/placeholder-cover.png' }]
    },
    {
      name: 'Book Title 2',
      id: 'https://example.com/id',
      attributedTo: [{ name: 'Fancy Author' }]
    },
    {
      name: 'Book Title 3',
      id: 'https://example.com/id',
      attributedTo: [{ name: 'Fancy Author' }]
    },
    {
      name: 'Book Title 4',
      id: 'https://example.com/id',
      attributedTo: [{ name: 'Fancy Author' }],
      resources: [{ rel: ['cover'], url: '/static/placeholder-cover.png' }]
    },
    {
      name: 'Book Title 5',
      id: 'https://example.com/id',
      attributedTo: [{ name: 'Fancy Author' }]
    },
    {
      name: 'Book Title 6',
      id: 'https://example.com/id',
      attributedTo: [{ name: 'Fancy Author' }],
      resources: [{ rel: ['cover'], url: '/static/placeholder-cover.png' }]
    },
    {
      name: 'Book Title 7',
      id: 'https://example.com/id',
      attributedTo: [{ name: 'Fancy Author' }]
    },
    {
      name: 'Book Title 8',
      id: 'https://example.com/id',
      attributedTo: [{ name: 'Fancy Author' }]
    },
    {
      name: 'Book Title 9',
      id: 'https://example.com/id',
      attributedTo: [{ name: 'Fancy Author' }],
      resources: [{ rel: ['cover'], url: '/static/placeholder-cover.png' }]
    },
    {
      name: 'Book Title 10',
      id: 'https://example.com/id',
      attributedTo: [{ name: 'Fancy Author' }]
    }
  ]
  api.library = params => {
    return new Promise((resolve, reject) => {
      setTimeout(
        () =>
          resolve({ totalItems: 100, items: books, page: params.page || 1 }),
        3000
      )
    })
  }
  return html`<api-provider .value=${api}>
    <ink-collection></ink-collection>
    <ink-collection-modal id="collection-modal-1"></ink-collection-modal>
  </api-provider>
`
}
function defaultViewConfig (collection) {
  const viewConfig = {
    name: collection || 'All',
    params: {
      limit: 100,
      page: 1
    }
  }
  if (collection) {
    viewConfig.params.stack = collection
  }
  return viewConfig
}

function setLibrary ({
  collection,
  viewConfig,
  setViewConfig,
  library,
  setState,
  api
}) {
  if (collection) {
    viewConfig.params.stack = collection
    viewConfig.name = collection
  }
  if (library.state !== 'loading') {
    library.state = 'loading'
    setState(library)
  }
  setViewConfig(viewConfig)
  return api.library(viewConfig.params).then(library => {
    library.state = 'loaded'
    setState(library)
  })
}

let setModalRef
export const InkCollection = ({ collection }) => {
  const api = useContext(ApiContext)
  const [viewConfig, setViewConfig] = useState(defaultViewConfig(collection))
  const [library, setState] = useState({ state: 'loading', items: [], page: 1 })
  const [button, setButton] = useState({ loading: false })
  useEffect(
    () => {
      setLibrary({
        collection,
        viewConfig,
        setViewConfig,
        library,
        setState,
        api
      })
    },
    [collection]
  )
  return html`<style>
    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.25rem 1rem;
    }

    .label {
      font-size: 0.8rem;
      text-transform: uppercase;
      color: var(--medium);
      margin: 0;
    }
    icon-button {
      height: 30px;
    display: inline-block;
    }
    span {
      margin: 0;
      padding: 0;
      line-height: 1;
    }
    .loading {
      min-height: 5rem;
    }
    .loading-svg {
      display: none;
    }
    book-list {
      display: block;
    }
    .loading book-list {
      opacity: 0;
    }
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      50% {
        transform: rotate(180deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    .loading svg {
      display: block;
      margin: auto;
      width: 24px;
      height: 24px;
      animation: spin 1s linear infinite;
    }
  @keyframes bookList {
    0% {
      opacity: 0;
      filter: blur(40px);
    }
    50% {
      opacity: 0.3;
      filter: blur(10px);
    }
    100% {
      opacity: 1;
      filter: blur(0);
    }
  }
  .loaded book-list {
    animation: bookList 0.25s ease-in-out;
  }
  .changing book-list {
    animation: bookList 0.25s ease-in-out reverse;
  }
  .changed book-list {
    opacity: 0;
  }
  .loader {
    display: block;
    text-align: center;
  }
  .complete .loader, .loading .loader {
    display: none;
  }
  </style><div class=${classMap({
    'header-row': true
  })}><span class="label">${library.items.length ||
    ''} Items</span> <span><icon-button .click=${event => {
  const modal = document.querySelector('ink-collection-modal')
  if (modal) {
    modal.state = { viewConfig, setViewConfig, library, setState, api }
  }
  if (setModalRef) {
    setModalRef(event.target)
  }
}} name="settings" label="Settings"></icon-button></span>
</div><div class=${classMap({
    loading: library.state === 'loading',
    loaded: library.state === 'loaded',
    changing: library.state === 'changing',
    changed: library.state === 'changing',
    complete: library.totalItems === library.items.length
  })}>${loader(library.state)}<book-list @animationend=${event =>
  removeAnimationClasses(event)} .books=${library.items}></book-list>
<ink-button secondary class="loader" ?working=${button.loading} ?disabled=${
  button.loading
} @click=${async event => {
  setButton({ loading: true })
  try {
    const libraryAdditions = await api.library(
      Object.assign({}, viewConfig.params, { page: library.page + 1 })
    )
    const newLibrary = Object.assign({}, library, libraryAdditions)
    newLibrary.items = library.items.concat(libraryAdditions.items)
    setState(newLibrary)
  } catch (err) {
    console.error(err)
  }
  setButton({ loading: false })
}}>Show More...</ink-button>
</div>`
}

function removeAnimationClasses (event) {
  const path = event.composedPath()
  const parent = path[0].parentElement
  const classNames = ['changing', 'loaded']
  classNames.forEach(className => {
    if (parent.classList.contains(className)) {
      parent.classList.remove(className)
    }
  })
}

function loader (state) {
  if (state === 'loading') {
    return html`<svg class="loading-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`
  }
}

export const SettingsModal = ({
  state = { viewConfig: defaultViewConfig }
}) => {
  const { viewConfig, setViewConfig, library = {}, setState, api } = state
  const [ref, setRef] = useState(false)
  setModalRef = setRef
  const options = [
    {
      text: 'Newest first',
      value: 'datePublished',
      selected: true
    },
    {
      text: 'Oldest first',
      value: 'datePublished-reversed',
      selected: false
    },
    {
      text: 'A-Z',
      value: 'title',
      label: 'Alphabetical, ascending',
      selected: false
    },
    {
      text: 'Z-A',
      value: 'title-reversed',
      label: 'Alphabetical, descending',
      selected: false
    }
  ]
  function onSelectChange (event) {
    const path = event.composedPath()
    const target = path[0]
    const value = target.value.split('-')
    const newOrder = {
      orderBy: value[0],
      reversed: value[1] ? 'true' : 'false',
      page: 1
    }
    const newParams = Object.assign({}, viewConfig.params, newOrder)
    const newConfig = Object.assign({}, viewConfig, { params: newParams })
    return getChanges(newConfig)
  }
  async function getChanges (newConfig) {
    library.state = 'changing'
    setState(library)
    try {
      const newLibrary = await api.library(
        Object.assign({}, newConfig.params, { page: library.page })
      )
      newLibrary.state = 'loaded'
      setViewConfig(newConfig)
      setState(newLibrary)
    } catch (err) {
      console.error(err)
    }
  }
  return html`<menu-modal .open=${ref}><strong slot="modal-title">View Settings for &lsquo;${
    viewConfig.name
  }&rsquo;</strong><form slot="modal-body"><p style="text-align: center;"><ink-dropdown .change=${onSelectChange} .options=${options}>Ordered by </ink-dropdown></p></form></menu-modal>`
}
window.customElements.define(
  'ink-collection',
  component(InkCollection, window.HTMLElement)
)
window.customElements.define(
  'ink-collection-modal',
  component(SettingsModal, window.HTMLElement, { useShadowDOM: false })
)
