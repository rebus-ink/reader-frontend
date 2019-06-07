import { createContext } from 'haunted'
import { createAPI } from './api.state.js'

export const ApiContext = createContext(createAPI())

window.customElements.define('api-provider', ApiContext.Provider)
