import { html } from 'lit-html'
import { useModal } from '../hooks/useModal.js'
import { classMap } from 'lit-html/directives/class-map.js'
import { component, useEffect } from 'haunted'
import '../modals/modal-closer.js'
import '../widgets/button.js'

export const title = 'Collection Sidebar: `<collection-sidebar>`'

export const description = `Primary navigation for the menu.`

// http://localhost:8080/demo/?component=/components/library/collection-sidebar.js&imports=/test/test-files/test-tags.js
export const preview = () => {
  return html`<ink-button @click=${() => {
    document.getElementById('modal-1').open = true
    document.getElementById('modal-1').collections = window.testTags
  }}>open modal</ink-button><ink-button @click=${() => {
    document.getElementById('modal-1').open = true
    document.getElementById('modal-1').current = 'This is a test collection'
  }}>open modal</ink-button><collection-sidebar id="modal-1" aria-hidden="true"></collection-sidebar>`
}

export const CollectionSidebar = ({ collections = [], open, current }) => {
  const [opener, closer] = useModal({ animation: true })
  useEffect(
    () => {
      if (open) {
        opener()
      }
    },
    [open]
  )
  return html`<style>

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  display: flex;
  align-items: inherit;
  justify-content: inherit;
  z-index: 4;
}

header {
  border-bottom: 1px solid #ddd;
}

.container {
  background-color: #fff;
  max-width: 95vw;
  max-height: 100vh;
  min-width: 300px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 1px 1px 14px -2px rgba(0,0,0,0.15);
}
.full .container {
  width: 100%;
  max-width: 100vw;
}
@keyframes containerPop {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  50% {
    transform: translateX(20%);
    opacity: 0.3;
  }
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
}
// Make sure .full doesn't pop
[aria-hidden="true"] .container {
  opacity: 0;
  transform: translateX(-100%);
}
.container.is-closing  {
  animation: containerPop 0.25s ease-in-out;
}
.container.is-opening  {
  animation: containerPop 0.25s ease-in-out reverse;
}

.content {
  display: flex;
  flex-direction: column;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}
.content > * {
  margin: auto;
}

.title {
  font-weight: 600;
  font-size: 0.75rem;
  line-height: 1;
  box-sizing: border-box;
  text-transform: uppercase;
  padding: 1rem 2rem;
  text-align: center;
  margin: 0;
}

.row {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.text {
  margin: 2rem;
}
.list {
  list-style: none;
  padding: 0;
  margin: auto 0;
}
.list li {
  padding: 0;
  margin: 0;
}
.item {
  display: block;
  padding: 0.5rem 1.5rem;
  font-size: 0.75rem;
  text-decoration: none;
  line-height: 1;
  color: var(--medium);
}
@keyframes outlinePop {
  0% {
    box-shadow: 0 0 0 1px rgba(33, 33, 33, 0);
  }
  50% {
    box-shadow: 0 0 0 8px #f5ffff;
  }
  100% {
    box-shadow: 0 0 0 3px #f5ffff;
  }
}

.item.selected {
  font-weight: 600;
  color: var(--dark);
  background-color: var(--rc-lighter);
}
.item:focus {
  animation: outlinePop 0.25s ease-in-out;
  outline: solid transparent;
  color: var(--dark);
  background-color: #f5ffff;
}
.item:hover {
  color: white;
  background-color: var(--rc-darker);
}
  </style>
    <div tabindex="-1" class=${classMap({
    overlay: true
  })} data-modal-close>
      <div role="dialog" class="container" aria-modal="true" aria-labelledby="modal-1-title" >
        <header>
          <h2 class="title">Collections</h2>
          <modal-closer></modal-closer>
        </header>
        <div id="modal-1-content" class="content">
        <ol class="list">${allView(current, closer)}
  ${collections.map(tag => tagView(tag, current, closer))}</ol>
        </div>
      </div>
    </div>`
}

window.customElements.define(
  'collection-sidebar',
  component(CollectionSidebar, window.HTMLElement)
)

// These should handle aria-current
const allView = (current, closer) => {
  return html`<li><a class="${classMap({
    item: true,
    selected: !current
  })}" aria-current=${
    !current ? 'page' : 'false'
  } href="/library" @click=${() =>
    closer()}><span class="label">All Items</span></a></li>`
}

const tagView = (tag, current, closer) => {
  return html`<li><a class="${classMap({
    item: true,
    selected: tag.name === current
  })}" aria-current=${current ? 'page' : 'false'} href="${`/library/${
    tag.name
  }`}" @click=${() => closer()}><span class="label">${tag.name}</span></a></li>`
}
