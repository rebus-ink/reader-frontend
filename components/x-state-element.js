import ky from 'ky'

// To use you need to subclass, add your own machine and set up event listening in either your constructor or connectedCallback.
// Should be hidden by default

export class XStateElement extends window.HTMLElement {
  static get machine () {
    return {}
  }
  static get eventName () {
    return 'xstate:transition'
  }
  async connectedCallback () {
    // first get the context either from textContent or from URL
    // The state machine is responsible for updating context if initial context is provided locally
    try {
      this.context = JSON.parse(this.textContent)
    } catch (err) {
      this.context = await this.loadState()
    }
    this.machine = this.constructor.machine.withContext(this.context)
    this.state = this.machine.initialState
  }
  disconnectedCallback () {}
  async loadState () {
    if (this.dataset.src) {
      try {
        const initialData = await ky.get(this.dataset.src)
        return initialData.json()
      } catch (err) {
        this.dataset.error = err.message
        return {}
      }
    }
  }
  handleEvent (event) {
    this.state = this.machine.transition(this.state, event, this.context)
    this.context = this.state.context
    const { actions } = this.state
    actions.forEach(action => {
      if (action.exec) {
        return action.exec(this.context, event)
      }
      if (action.type === 'xstate.log') {
        const expr = action.expr ? action.expr(this.context, event) : undefined
        if (action.label) {
          console.log(action.label, expr)
        } else {
          console.log(expr)
        }
      }
    })
    const broadcastEvent = new window.CustomEvent(this.contructor.eventName, {
      detail: { state: this.state, context: this.context }
    })
    this.dispatchEvent(broadcastEvent)
  }
}
