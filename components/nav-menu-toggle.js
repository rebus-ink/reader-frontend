window.customElements.define(
  'nav-menu-toggle',
  class NavMenuToggle extends window.HTMLButtonElement {
    connectedCallback () {
      this.updateVisibility()
      this.addEventListener('click', this)
    }
    disconnectedCallback () {
      this.removeEventListener('click', this)
    }
    get menu () {
      return document.getElementById(this.dataset.menuId)
    }
    updateVisibility () {
      this.checkVisibility()
      this.setAttribute('aria-expanded', this.visible)
      this.innerText = this.visible ? 'Hide Menu' : 'Show Menu'
    }
    checkVisibility () {
      if (
        window.getComputedStyle(this.menu).getPropertyValue('display') ===
        'none'
      ) {
        this.visible = false
      } else {
        this.visible = true
      }
    }
    handleEvent (event) {
      this.checkVisibility()
      if (this.visible) {
        this.menu.closest('.Layout').classList.add('is-without-menu')
        this.menu.closest('.Layout').classList.remove('is-with-menu')
      } else {
        this.menu.closest('.Layout').classList.add('is-with-menu')
        this.menu.closest('.Layout').classList.remove('is-without-menu')
      }
      this.visible = !this.visible
      this.setAttribute('aria-expanded', this.visible)
      this.innerText = this.visible ? 'Hide Menu' : 'Show Menu'
    }
  },
  { extends: 'button' }
)
