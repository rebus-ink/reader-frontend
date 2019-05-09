import {createRouterComponent} from './utils/context-router.js'
import 'intersection-observer'
import '@github/details-menu-element'
// import {render} from 'neverland'
import libraryRoute from './library/index.js'
import readerRoute from './reader/index.js'
import './components/components.js'

document.body.innerHTML = ''
function createRoots (roots) {
  roots.forEach(id => {
    const el = document.createElement('div')
    el.id = id
    document.body.appendChild(el)
  })
}
createRoots(['library', 'reader'])
const library = document.getElementById('library')
library.dataset.toggleLeft = 'show'
library.dataset.toggleRight = 'hide'

createRouterComponent([libraryRoute, readerRoute])

// render(libraryElement, body)
document.documentElement.classList.remove('js-loading')
