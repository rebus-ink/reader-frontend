import { createElement, wrapClass } from './create-element.js'
import { html } from 'lit-html'

function wrapEl (CustomClass) {
  return class Base extends wrapClass(CustomClass) {
    styleConfig (style = '') {
      const name = this.tagName.toLowerCase()
      style = `${style}
${name} {
  display: block;
}

${name} > * + * {
  margin-top: var(--s1);
}`
      super.styleConfig(style)
      this.i = `Stack-${[this.space || 'var(--s1)', this.recursive].join('')}`
      this.dataset.i = this.i
      if (!document.getElementById(this.i)) {
        document.head.innerHTML += `
        <style id="${this.i}">
          [data-i="${this.i}"]${this.recursive ? '' : ' >'} * + * {
            margin-top: ${this.space || 'var(--s1)'}
          }
        </style>
        `
          .replace(/\s\s+/g, ' ')
          .trim()
      }
    }
  }
}

export const createStack = (name, render, config) => {
  config.wrapEl = wrapEl
  config.observedAttributes = []
    .concat(config.observedAttributes)
    .concat(['space', 'recursive'])
  return createElement(name, render, config)
}

// Preview code below

export const title = 'Create Stack'
export const description = `Create Stack with included styles`

export const preview = () => {
  const style = `
  test-el p {
    margin: 0;
    padding: 0;
    color: green;
  }
  `
  const render = el => {
    return html`<div><p>Paragraph 1</p>
    <p>Paragraph 2</p>
    <p>Paragraph 3</p></div>
    <div>Paragraph 2</div>
    <div>Paragraph 3</div>`
  }
  createStack('test-el', render, { style })
  return html`<test-el></test-el>`
}
