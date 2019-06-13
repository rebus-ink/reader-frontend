import { html } from 'lit-html'
import { component, useContext, useState, useEffect } from 'haunted'
import { ApiContext } from './api-provider.component.js'

export const title = 'Ink Chapter display: `<ink-chapter>`'

export const description = `This renders the chapter HTML with processed CSS.`

export const preview = () => {
  return html`<ink-chapter chapter="/demo/chapter/demo.html"></ink-chapter>`
}

export const InkChapter = ({ location, chapter }) => {
  const api = useContext(ApiContext)
  const [chapterDOM, setChapter] = useState(
    html`<div class="loading">Loading</div>`
  )
  useEffect(
    () => {
      if (chapter) {
        return api.book
          .chapter(chapter)
          .then(dom => setChapter(dom))
          .catch(err => console.error(err))
      }
    },
    [chapter]
  )
  return html`
    <style>
:host() {
  position: relative;
  all: initial;
  line-height: var(--reader-line-height);
  font-size: var(--reader-font-size);
  color: var(--reader-text-color);
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
    </style>
    ${chapterDOM}
    `
}
InkChapter.observedAttributes = ['chapter', 'location']

window.customElements.define(
  'ink-chapter',
  component(InkChapter, window.HTMLElement)
)
