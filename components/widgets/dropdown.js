import { html } from 'lit-html'
import { component } from 'haunted'

export const title = 'Dropdown: `<rebus-dropdown>`'

export const description = `The default dropdown`

// http://localhost:8080/demo/?component=/components/widgets/dropdown.js
export const preview = () => {
  const options = [
    {
      text: 'Option the first',
      value: '1',
      selected: false
    },
    {
      text: 'Option the second',
      value: '2',
      selected: true
    },
    {
      text: 'Option the third',
      value: '3',
      label: 'The third option',
      selected: false
    },
    {
      text: 'Option the fourth',
      value: '4',
      selected: false
    }
  ]
  return html`<p><ink-dropdown .change=${event =>
    console.log(
      event
    )} .options=${options}>Fancy</ink-dropdown></p><p><ink-dropdown disabled .options=${options}>Disabled</ink-dropdown></p>`
}

export const InkDropdown = ({ disabled, change = () => {}, options = [] }) => {
  return html`<style>
label, select, option {
  font-size: 1em;
}
select {
  display: inline-block;
  color: var(--dark);
  padding: 0.5em 2.5em 0.5em 0.5em;
  min-width: 15rem
  max-width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: 1px solid var(--rc-dark);
  border-radius: 2px;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: transparent;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2332A5A5%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22square%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E'),
    linear-gradient(to bottom, transparent 0%, transparent 100%);
  background-repeat: no-repeat, repeat;
  background-position: right 0.7em top 50%, 0 0;
  background-size: 1em auto, 100%;
}
select::-ms-expand {
  display: none;
}
select:hover {
  border-color: var(--rc-main);
  cursor: pointer;
}
@keyframes outlinePop {
  0% {
    box-shadow: 0 0 0 1px rgba(33, 33, 33, 0);
  }
  50% {
    box-shadow: 0 0 0 8px var(--rc-darker);
  }
  100% {
    box-shadow: 0 0 0 3px var(--rc-dark);
  }
}
select:focus {
    box-shadow: 0 0 0 3px var(--rc-dark);
    
    outline: solid transparent;
    animation: outlinePop 0.25s ease-in-out;
}
select option {
  font-weight: normal;
  text-transform: none;
}
select[disabled] {
  background-color: var(--disabled);
  color: white;
  border-color: var(--disabled);
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22square%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E'),
    linear-gradient(to bottom, transparent 0%, transparent 100%);
}
  </style>
  <label><slot></slot> <select class="LibrarySelect" @change=${event =>
    change(event)} ?disabled=${disabled}>
${options.map(
    option =>
      html`<option value=${option.value} ?selected=${
        option.selected
      } aria-label=${option.label || option.text}>${option.text}</option>`
  )}
  </select></label>`
}

InkDropdown.observedAttributes = ['disabled', 'secondary']

window.customElements.define(
  'ink-dropdown',
  component(InkDropdown, window.HTMLElement)
)
