import { createModal, closer } from '../utils/create-modal.js'
import { html } from 'lit-html'

const style = `
#ink-contents-document {
  background-color: #fff;
  max-width: 95vw;
  max-height: 100vh;
  min-width: 300px;
  box-sizing: border-box;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 1px 1px 14px -2px rgba(0,0,0,0.15);
  z-index: 10;
}
.full #ink-contents-document {
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
[aria-hidden="true"] #ink-contents-document {
  opacity: 0;
  transform: translateX(-100%);
}
#ink-contents-document.is-closing  {
  animation: containerPop 0.25s ease-in-out;
}
#ink-contents-document.is-opening  {
  animation: containerPop 0.25s ease-in-out reverse;
}

.content {
  display: flex;
  flex-direction: column;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

#ink-contents-document .content > * {
  margin: auto;
}

ink-contents-modal .title {
  font-weight: 600;
  font-size: 0.75rem;
  line-height: 1;
  box-sizing: border-box;
  text-transform: uppercase;
  padding: 0.25rem 2rem;
  text-align: center;
  margin: 0;
}

#ink-contents-document .row {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

#ink-contents-document .text {
  margin: 2rem;
}
#ink-contents-document .list {
  list-style: none;
  padding: 0;
  margin: auto 0;
}
#ink-contents-document .list li {
  padding: 0;
  margin: 0;
}
#ink-contents-document .item {
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

#ink-contents-document .item.selected {
  font-weight: 600;
  color: var(--dark);
  background-color: var(--rc-lighter);
}
#ink-contents-document .item:focus {
  animation: outlinePop 0.25s ease-in-out;
  outline: solid transparent;
  color: var(--dark);
  background-color: #f5ffff;
}
#ink-contents-document .item:hover {
  color: white;
  background-color: var(--rc-darker);
}
#ink-contents-document header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

#ink-contents-document .actions-button {
  text-align: left;
  border: none;
}`

const renderer = ({ book, current, returnPath }, config) => {
  return html`<header>
  <icon-button name="cancel" @click=${() =>
    closer()} data-autofocus="true">Close Menu</icon-button>
  <h2 class="title" data-autofocus="true">Contents</h2>
  <span></span>
</header>
    <p><a href=${returnPath} class="actions-button actions-button--secondary" @click=${() =>
  closer()}>&lt; Return</a></p>
<ink-contents id="modal-1-content" class="content" .book=${book} .current=${current} @click=${event =>
  closer()}>
</ink-contents>`
}

createModal('ink-contents', renderer, { style })
