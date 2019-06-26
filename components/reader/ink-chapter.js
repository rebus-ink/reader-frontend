import { html } from 'lit-html'
import { component, useContext, useState, useEffect } from 'haunted'
import { ApiContext } from '../api-provider.component.js'
import { getRange } from 'shadow-selection-polyfill'

export const title = 'Ink Chapter display: `<ink-chapter>`'

export const description = `This renders the chapter HTML with processed CSS.`

// http://localhost:8080/demo/?component=/components/reader/ink-chapter.js
export const preview = () => {
  return html`<ink-chapter chapter="/demo/chapter/demo.html"></ink-chapter>`
}

export const InkChapter = el => {
  const { location, chapter, readable, setSelection, setHighlight } = el
  const api = useContext(ApiContext)
  const [resource, setChapter] = useState(
    html`<div class="loading">Loading</div>`
  )
  useEffect(
    () => {
      const element = el.shadowRoot.getElementById(location)
      if (location && resource && element) {
        window.requestAnimationFrame(() => {
          element.scrollIntoView({ behaviour: 'smooth' })
        })
      }
    },
    [location, resource]
  )
  useEffect(() => {
    function handleSelection () {
      const range = getRange(el.shadowRoot)
      if (range && range.collapsed !== true) {
        setSelection({ selectionRange: range, root: el.shadowRoot })
      } else {
        setSelection({})
      }
    }
    document.addEventListener('-shadow-selectionchange', handleSelection)
    function handleHighlight (event) {
      if (event.type === 'reader:highlight-selected') {
        setHighlight({ noteId: event.detail.id, root: el.shadowRoot })
      } else {
        setHighlight({})
      }
    }
    window.addEventListener('reader:highlight-selected', handleHighlight)
    window.addEventListener('reader:highlight-deselected', handleHighlight)
    return () => {
      document.removeEventListener('-shadow-selectionchange', handleSelection)
      window.removeEventListener('reader:highlight-selected', handleHighlight)
      window.removeEventListener('reader:highlight-deselected', handleHighlight)
    }
  }, [])
  useEffect(
    () => {
      if (chapter) {
        el.updateComplete = api.book
          .chapter(chapter, readable)
          .then(dom => {
            setChapter(dom)
          })
          .catch(err => console.error(err))
      }
    },
    [chapter, readable]
  )
  useEffect(
    () => {
      const { lang } = resource
      if (lang) {
        el.setAttribute('lang', lang)
      }
      if (resource) {
        followLocations(el)
      }
    },
    [resource]
  )
  return html`
    <style>
:host {
  all: initial;
  position: relative;
  line-height: var(--reader-line-height);
  font-size: var(--reader-font-size);
  color: var(--reader-text-color);
  font-family: var(--reader-font-family);
  background-color: var(--reader-background-color);
  line-height: var(--reader-line-height);
  display: block;
  contain: content;
  padding: 0;
  display: grid;
  grid-template-columns: minmax(var(--reader-left-margin), 0.5fr) minmax(var(--reader-min-column-width), var(--reader-max-column-width)) minmax(var(--reader-left-margin), 0.5fr);
  grid-template-areas: 'leftmargin maintext rightmargin';
}
.Highlight {
  background-color: #ffff98;
}

.Highlight--selected {
  background-color: #ddddd0;
}

.chapter-body {
  grid-area: maintext;
  min-width: var(--reader-min-column-width);
  max-width: var(--reader-max-column-width);
  margin: 0;
}
[hidden],
template {
  display: none !important;
}
head {
  display: none;
}blockquote {
  margin-left: 2.5em;
}

blockquote,
blockquote p {
  font-size: 0.75rem;
  font-size: calc(var(--reader-font-size) * 0.85);
  line-height: 1.2;
}

blockquote * + * {
  margin-top: calc(var(--reader-paragraph-spacing) * 0.85);
}
blockquote * {
  margin-bottom: 0;
}
blockquote :first-child {
  margin: 0;
}h1 {
  font-size: 2em;
  font-size: calc(var(--reader-font-size) * 3);
  font-weight: 600;
  margin: 0;
}

h2 {
  font-weight: 600;
  font-size: calc(var(--reader-font-size) * 2);
  margin: 0;
}
h3 {
  font-weight: 400;
  font-style: italic;
  font-size: calc(var(--reader-font-size) * 1.5);
  margin: 0;
}
h4 {
  font-weight: normal;
  font-size: calc(var(--reader-font-size) * 1.25);
  margin: 0;
}
h5 {
  font-weight: normal;
  font-size: var(--reader-font-size);
  text-transform: uppercase;
  margin: 0;
}

h6 {
  font-weight: normal;
  font-size: var(--reader-font-size);
  margin: 0;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin-bottom: var(--reader-paragraph-spacing);
}


p, div, td, figure, figcaption {
  line-height: var(--reader-line-height);
  font-size: 0.85rem;
  font-size: var(--reader-font-size, 0.85rem);
}

a[href] {
  transition: box-shadow 0.1s cubic-bezier(0.9, 0.03, 0.69, 0.22),
    transform 0.1s cubic-bezier(0.9, 0.03, 0.69, 0.22);
  text-decoration: underline;
}
:link {
  color: var(--link);
}
:visited {
  color: var(--visited);
}
a:link:hover {
  color: var(--hover);
}
a {
  border-radius: 2rem;
}
@keyframes outlinePop {
  0% {
    box-shadow: 0 0 0 1px rgb(228, 255, 254, 0.2);
    background-color: rgb(228, 255, 254, 0.2);
    transform: scale(0.5);
  }
  50% {
    box-shadow: 0 0 0 8px var(--rc-lighter);
    transform: scale(1.5);
  }
  100% {
    box-shadow: 0 0 0 3px var(--rc-lighter);
    background-color: var(--rc-lighter);
    transform: scale(1);
  }
}
a:focus {
  background-color: var(--rc-lighter);
  box-shadow: 0 0 0 5px var(--rc-lighter);
  outline: solid transparent;
  animation: outlinePop 0.25s ease-in-out;
}

a:link:active {
  color: var(--active);
}
b,
strong,
b > *,
strong > * {
  font-weight: 600;
}
svg,
img {
  max-height: 88vh;
  width: auto;
  height: auto;
  max-width: 100%;
}
.is-current {
  background-color: #f9f9f9;
  box-shadow: 0 0 0 0.25rem #f9f9f9;
}
/* .is-current:before {
  content: '';
  position: absolute;
  bottom: 0;
  right: -1rem;
  width: 0.15rem;
  height: 100%;
  display: block;
  background-color: var(--rc-medium);
  top: 0;
} */
    </style>
    <div class="chapter-body">${resource.dom}</div>
    `
}
InkChapter.observedAttributes = ['chapter', 'location', 'readable']

window.customElements.define(
  'ink-chapter',
  component(InkChapter, window.HTMLElement)
)

const positionObserver = new window.IntersectionObserver(onPosition, {
  rootMargin: '0px 0px -75% 0px'
})

let highest
let visible = []
function onPosition (entries) {
  const enteringView = entries
    .filter(entry => entry.isIntersecting)
    .map(entry => entry.target)
  const leavingView = entries
    .filter(entry => !entry.isIntersecting)
    .map(entry => entry.target)
  visible = visible.filter(entry => !leavingView.includes(entry))
  visible = visible.concat(enteringView)
  if (visible[1]) {
    highest = visible[1]
  } else {
    highest = visible[0]
  }
  let root
  if (highest) {
    root = highest.getRootNode().host
    root.shadowRoot
      .querySelectorAll('.is-current')
      .forEach(element => element.classList.remove('is-current'))
    highest.classList.add('is-current')
    root.setAttribute('current', highest.id)
  }
}

function followLocations (el) {
  window.requestAnimationFrame(() => {
    el.shadowRoot.querySelectorAll('[id]').forEach(element => {
      positionObserver.observe(element)
    })
  })
}
