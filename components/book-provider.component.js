import { createContext } from 'haunted'

export const BookContext = createContext({
  book: {
    name: '',
    id: '',
    attributedTo: [{ name: '' }],
    resources: [{ rel: ['cover'], url: '/static/placeholder-cover.jpg' }],
    position: {}
  },
  chapter: { type: 'initial-chapter', id: '', position: {} },
  location: { saved: '', callout: '' }
})

window.customElements.define('book-provider', BookContext.Provider)
