
import {library} from './component-library.js'
import {nav} from './component-nav.js'
import {shelf} from './component-shelf.js'
import {reducer} from './reducer.js'

const route = {
  path: '/library',
  name: 'library',
  main: library,
  leftSidebar: nav,
  rightSidebar: shelf,
  reducer
}

export default route
