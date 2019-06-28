import { createContext } from 'haunted'
import { createAPI } from './api.state.js'

export const api = createAPI()

export const ApiContext = createContext(api)

window.customElements.define('api-provider', ApiContext.Provider)
