import wickedElements from 'wicked-elements'

wickedElements.define('.Marker-textarea', {
  onconnected (event) {
    this.el = event.currentTarget
    this.parent = this.el.closest('.Marker')
    this.el.addEventListener('change', this)
  },
  onchange (event) {
    this.parent.classList.add('Marker--hasContent')
  }
})
