import {createRouterComponent} from './utils/context-router.js'
import 'intersection-observer'
import '@github/details-menu-element'
import {render} from 'neverland'
import libraryRoute from './library/index.js'
import './components/components.js'

document.body.id = 'app'

const body = createRouterComponent([libraryRoute])

render(document.body, body)
document.documentElement.classList.remove('js-loading')
