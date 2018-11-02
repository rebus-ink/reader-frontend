window.customElements.define(
  'nav-menu-toggle',
  class NavMenuToggle extends window.HTMLButtonElement {
    static get observedAttributes () {
      return ['color']
    }
    attributeChangedCallback (name, oldValue, newValue, nsValue) {
      this.style.color = newValue
    }
    connectedCallback () {
      this.updateVisibility()
      this.addEventListener('click', this)
    }
    disconnectedCallback () {
      this.removeEventListener('click', this)
    }
    updateVisibility () {
      this.menu = document.getElementById(this.dataset.menuId)
      this.visible = window.getComputedStyle(this.menu).display !== 'none'
      this.setAttribute('aria-expanded', this.visible)
      this.innerText = this.visible ? 'Hide Menu' : 'Show Menu'
    }
    handleEvent (event) {
      this.menu.closest('.Layout').classList.toggle('is-without-menu')
      this.visible = window.getComputedStyle(this.menu).display !== 'none'
      this.setAttribute('aria-expanded', this.visible)
      this.innerText = this.visible ? 'Hide Menu' : 'Show Menu'
    }
  },
  { extends: 'button' }
)
