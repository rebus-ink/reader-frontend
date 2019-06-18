import { html } from 'lit-html'
import { component, useState } from 'haunted'
import { close } from '../hooks/useModal.js'
import '../widgets/button.js'
import '../widgets/text-button.js'

export const title = 'Confirm Action modal body: `<confirm-action>`'

export const description = `This is the body of the sign out modal.`

// http://localhost:8080/demo/?component=/components/modals/confirm-action.js
export const preview = () => {
  async function logout () {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({ done: true }), 3000)
    })
  }
  return html`<confirm-action .action=${logout} name="Sign Out" question="Are you sure that you want to sign out?" dangerous></confirm-action>`
}

export const ConfirmBody = ({ action, name, question, dangerous }) => {
  const [working, setWorking] = useState(false)
  return html`
  <style>
  confirm-action {
    display: block;
    padding: 1rem;
  }
  confirm-action .Modal-paragraph {
  text-align: center;
}
confirm-action .Modal-name {
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.25;
  box-sizing: border-box;
  text-transform: uppercase;
  margin: 0 2rem 1rem;
  text-align: center;
  display: block;
}

confirm-action .Modal-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}
confirm-action[dangerous] {
  border-bottom: 0.5rem solid #af4014;
  border-top: 0.5rem solid #af4014;
}
  </style>
  <strong slot="modal-title" class="Modal-name">${name}</strong>
  <div slot="modal-body">
  <p class="Modal-paragraph">${question}</p>
  <div class="Modal-row"><ink-text-button closer>Cancel</ink-text-button> <ink-button ?working=${working} ?disabled=${working} ?dangerous=${dangerous} @click=${() => {
  action().then(() => {
    setWorking(false)
    close()
  })
  setWorking(true)
}}>${name}</ink-button></div>
  </div>`
}
ConfirmBody.observedAttributes = ['name', 'question', 'dangerous']

window.customElements.define(
  'confirm-action',
  component(ConfirmBody, window.HTMLElement, { useShadowDOM: false })
)
