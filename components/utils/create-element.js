import { html } from 'lit-html'
import { classMap } from 'lit-html/directives/class-map.js'
import { component, useState, useEffect } from 'haunted'

export const wrapClass = CustomClass => {
  return class Base extends CustomClass {
    styleConfig (style = '') {
      const name = this.tagName.toLowerCase()
      if (!document.getElementById(name + '-style') && style) {
        const styleEl = document.createElement('style')
        styleEl.id = name + '-style'
        styleEl.textContent = style
        document.head.append(styleEl)
      }
    }
    get ref () {
      return this
    }
    set ref (ref) {
      if (ref.current !== this) {
        ref.current = this
      }
    }
  }
}

export const createElement = (
  render,
  { style, observedAttributes, wrapEl = wrapClass, Base = window.HTMLElement }
) => {
  function renderWrap (el) {
    useEffect(() => {
      console.log(el.tagName)
      el.styleConfig(style)
    }, [])
    return render(el)
  }
  if (observedAttributes) {
    renderWrap.observedAttributes = observedAttributes
  }
  const CustomElement = wrapEl(Base)
  return component(renderWrap, CustomElement, {
    useShadowDOM: false
  })
}

// Preview code below

export const title = 'Create Element'
export const description = `Create Element with included styles`

export const preview = () => {
  const render = el => {
    const {
      disabled,
      secondary,
      dropdown,
      compact,
      working,
      dangerous,
      name
    } = el
    const [count, setCount] = useState(0)
    return html`<button ?disabled=${disabled} class=${classMap({
      secondary,
      dropdown,
      compact,
      working,
      dangerous
    })} ?data-modal-close=${el['data-modal-close']} @click=${ev =>
      setCount(count + 1)}>${name || 'Button'} ${count} ${
      working
        ? html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`
        : ''
    }</button>`
  }
  const CustomElement = createElement(render, {
    observedAttributes: [
      'disabled',
      'secondary',
      'dropdown',
      'compact',
      'working',
      'dangerous',
      'data-modal-close',
      'name'
    ],
    style: `.dangerous {
    background-color: #af4014;
    --rc-main: #9f3a13;
    --rc-dark: #812f0f;
    --rc-darker: #63240c;
    color: white;
  }
  button {
    font-family: var(--sans-fonts);
    font-size: 0.65rem;
    flex: 0 1 auto;
    line-height: 1;
  
    display: inline-block;
  
    padding: 0.45rem 1.5rem 0.5rem;
  
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    text-align: center;
    white-space: nowrap;
    text-decoration: none;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--dark);
    border-radius: var(--border-radius);
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    background-color: var(--rc-main);
    border: 2px solid var(--rc-main);
    box-shadow: 1px 2px 4px 0 rgba(33, 33, 33, 0.1);
    text-decoration: none !important;
    position: relative;
  }
  .dropdown {
    padding-right: 1.5rem;
    padding-left: 1rem;
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23333333%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22square%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E'),
      linear-gradient(to bottom, transparent 0%, transparent 100%);
    background-repeat: no-repeat, repeat;
    background-position: right 0.7em top 50%, 0 0;
    background-size: 1em auto, 100%;
  }
  .dropdown.secondary {
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2337b5b5%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22square%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E'),
      linear-gradient(to bottom, transparent 0%, transparent 100%);
  }
  .dropdown:hover {
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23FFFFFF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22square%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E'),
      linear-gradient(to bottom, transparent 0%, transparent 100%);
  }
  
  button:hover {
    color: white !important;
    background-color: var(--rc-dark);
    border-color: var(--rc-dark);
    box-shadow: none;
    text-decoration: none;
  }
  .secondary {
    background-color: white;
    border: 2px solid var(--rc-main);
    color: var(--rc-main);
  }
  .secondary:hover {
    background-color: var(--rc-main);
  }
  button:active, .secondary:active {
    background-color: var(--active);
    border-color: var(--active);
  }
  button[disabled] {
    background-color: #eee;
    background-image: none;
    border-color: #eee;
    color: #bbb;
    cursor: not-allowed;
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
  button:focus {
      box-shadow: 0 0 0 3px var(--rc-dark);
      outline: solid transparent;
      animation: outlinePop 0.25s ease-in-out;
  }
  button[disabled]:focus, {
    border-color: #999;
    background-color: var(--disabled);
    box-shadow: inset 0 0px 2px 0 rgba(0, 66, 98, 0.15);
    background-image: none;
  }
  .compact {
    font-size: 0.5rem;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
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
  .working {
    padding-right: 1.75rem;
  }
  .working svg {
    display: inline-block;
    content: '';
      position: absolute;
      top: 7px;
      right: 10px;
    animation: spin 0.5s linear infinite;
    width: 16px;
    height: 16px;
  }`
  })
  window.customElements.define('test-el', CustomElement)
  return html`<test-el name="Fancy Button"></test-el> <test-el secondary name="Secondary Button"></test-el><test-el disabled>Disabled Button</test-el><test-el dropdown>Dropdown Button</test-el><test-el dropdown secondary>Dropdown Button</test-el><test-el dropdown compact secondary>Dropdown Button</test-el><test-el dropdown compact>Dropdown Button</test-el><test-el working>Fetching</test-el><test-el working secondary>Fetching</test-el>`
}
