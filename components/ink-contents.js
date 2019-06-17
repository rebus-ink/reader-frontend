import { html } from 'lit-html'
import { component, useContext, useState, useEffect } from 'haunted'
import { ApiContext } from './api-provider.component.js'

export const title = 'Ink Contents display: `<ink-contents>`'

export const description = `This renders the book's content HTML`

export const preview = () => {
  return html`<ink-contents .book=${{
    name: 'Book Title',
    id: '/demo',
    attributedTo: [{ name: 'Fancy Author' }],
    resources: [
      { rel: ['cover'], url: 'static/placeholder-cover.png' },
      { rel: ['contents'], url: 'contents.html' }
    ]
  }} current="chap_00012.xhtml"></ink-contents>`
}

export const InkChapter = el => {
  const { book, current } = el
  const api = useContext(ApiContext)
  const [resource, setContent] = useState(
    html`<div class="loading">Loading</div>`
  )
  useEffect(
    () => {
      if (book) {
        api.book
          .navigation(book)
          .then(dom => setContent(dom))
          .catch(err => console.error(err))
      }
    },
    [book]
  )
  useEffect(
    () => {
      const { lang } = resource
      if (lang) {
        el.setAttribute('lang', lang)
      }
    },
    [resource]
  )
  useEffect(
    () => {
      if (
        resource &&
        current &&
        el.shadowRoot.querySelector(`[href*="${current}"]`)
      ) {
        el.shadowRoot
          .querySelector(`[href*="${current}"]`)
          .setAttribute('aria-current', 'page')
      }
    },
    [resource, current]
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
  padding: var(--reader-left-margin);
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
}

a[href] {
  transition: box-shadow 0.1s cubic-bezier(0.9, 0.03, 0.69, 0.22),
    transform 0.1s cubic-bezier(0.9, 0.03, 0.69, 0.22);
  text-decoration:  none;
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
[aria-current="page"] {
  position: relative;
  background-color: #f5ffff;
  box-shadow: 0 0 0 5px #f5ffff;
  border-radius: 4px;
  font-weight: 600;
}
    </style>
    <div class="chapter-body">${resource.dom}</div>
    `
}
InkChapter.observedAttributes = ['current']

window.customElements.define(
  'ink-contents',
  component(InkChapter, window.HTMLElement)
)
