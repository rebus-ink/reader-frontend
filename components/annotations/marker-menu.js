const wickedElements = require('wicked-elements').default
const { html } = require('lighterhtml')

function markerMenu (element) {
  return html`<div class="Marker"><details class="MenuButton MenuButton--marker">
  <summary class="MenuButton-summary" aria-label="Add marker to sidebar"><svg viewBox="0 0 10 10" fill="currentColor" stroke="transparent" width="15" height="15">
  <path d="m1 4h8v2h-8zm3-3h2v8h-2z"></path>
</svg></summary>
<div class="MenuButton-body MenuButton-body--right MarkerMenu">
  <dl>
    <dt><strong>Markers</strong></dt>
  <dd>
    <ol>
    <li>${button('✓', 'agree')}</li>
    <li>${button('x', 'disagree')}</li>
    <li>${button('~', 'interesting')}</li>
    <li>${button('*', 'important')}</li>
    </ol>
  </dd>
    <dt><strong>Hands</strong></dt>
  <dd>
    <ol>
    <li>${button('👍', 'thumbs up')}</li>
    <li>${button('👎', 'thumbs down')}</li>
    <li>${button('✋', 'open hand')}</li>
    <li>${button('👏', 'clapping')}</li>
    </ol>
  </dd>
  <dt><strong>Smileys</strong></dt>
  <dd>
    <ol>
    <li>${button('🙂', 'slightly smiling face')}</li>
    <li>${button('🤨', 'face with raised eyebrows')}</li>
    <li>${button('😍', 'smiling face with heart-shaped eyes')}</li>
    <li>${button('😱', 'face screaming in fear')}</li>
    <li>${button('😐', 'neutral face')}</li>
    <li>${button('🙄', 'face with rolling eyes')}</li>
    </ol>
  </dd>
</dl></div>
  </details></div>`
}

function button (character, description) {
  const label = `Add ${description} sidebar marker`
  return html`<button class="Button Button--marker" aria-label="${label}" is="add-marker-button" data-description="${description}">${character}</button>`
}

wickedElements.define('[is="add-marker-button"]', {
  onconnected (event) {
    this.el = event.currentTarget
    this.el.addEventListener('click', this)
  },
  onclick (event) {
    const newMarker = marker(this.el)
    const parent = this.el.closest('.Marker')
    const reference = parent.querySelector('.MenuButton')
    parent.insertBefore(newMarker, reference)
  },
  ondisconnected (event) {
    this.el.removeEventListener('click', this)
  }
})

function marker (element) {
  const description = element.dataset.description
  const character = element.textContent
  const label = `Remove ${description} sidebar marker`
  return html`<button class="Button Button--marker" aria-label="${label}" is="marker-button" data-description="${description}">${character}</button>`
}

wickedElements.define('[is="marker-button"]', {
  onconnected (event) {
    this.el = event.currentTarget
    this.el.addEventListener('click', this)
  },
  onclick (event) {
    const parent = this.el.parentElement
    parent.removeChild(this.el)
  },
  ondisconnected (event) {
    this.el.removeEventListener('click', this)
  }
})

module.exports.markerMenu = markerMenu
