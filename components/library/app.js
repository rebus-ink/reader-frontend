import { html } from 'lit-html'
import { component, useState, useEffect, useContext } from 'haunted'
import { useRoutes } from '../hooks/useRoutes.js'
import { ApiContext } from '../api-provider.component.js'
import '../widgets/button.js'
import '../widgets/text-button.js'
import 'inert-polyfill/inert-polyfill.js'

const library = {
  path: '/library/:collection*',
  render (req, route) {
    return html`<ink-library .req=${req} .route=${route}></ink-library>`
  }
}

const reader = {
  path: '/reader/:bookId/:bookPath*',
  render (req, route) {
    return html`<ink-reader .req=${req} .route=${route}></ink-reader>`
  }
}

const info = {
  path: '/info/:bookId',
  render (req, route) {
    return html`<ink-info .req=${req} .route=${route}></ink-info>`
  }
}
const fallback = {
  render () {
    return loading()
  },
  prop: 'prop3'
}

const routes = [library, reader, info, fallback]
export const App = el => {
  const [route, req] = useRoutes(routes)
  const [profile, setProfile] = useState({ type: 'loading' })
  const api = useContext(ApiContext)
  useEffect(() => {
    api.profile
      .whoami()
      .then(result => setProfile(result))
      .catch(err => {
        console.log(err.status, err.response)
        if (err.status === 401) {
          setProfile({ type: 'no-user' })
        } else if (err.status === 404) {
          setProfile({ type: 'create-profile' })
        }
      })
  }, [])
  let renderResult
  if (profile.type === 'loading') {
    renderResult = () => loading()
  } else if (profile.type === 'create-profile') {
    renderResult = () => createProfile(api, setProfile)
  } else if (profile.type === 'no-user') {
    renderResult = () => signIn()
  } else {
    renderResult = route.render
  }
  return html`<style>
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .App-working {
    padding-right: 1.75rem;
  }
  .App-working svg {
    display: inline-block;
    content: '';
      position: absolute;
      top: 7px;
      right: 10px;
    animation: spin 0.5s linear infinite;
    width: 16px;
    height: 16px;
  }
.Card {
  background-color: #fff;
  max-width: 95vw;
  max-height: 100vh;
  min-width: 300px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 1px 1px 14px -2px rgba(0,0,0,0.15);
  padding: 1rem;
  width: 400px;
}

.Card--flat {
  box-shadow: none;
  background-color: rgba(255,255,255, 0.5);
}
.TwoUp {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100vh;
}
.center {
  text-align: center;
}

@media (max-width: 840px) {
  .TwoUp {
    flex-direction: column;
  }
}
</style>
${renderResult(req, route)}`
}

function createProfile (api, setProfile) {
  return html`
  
  <p>Warning! Rebus ink is currently <em>pre-release software</em> which uses a <em>temporary</em> database. You data <strong><em>will be lost</em></strong> at some point!</p>
  <div class="TwoUp">
<div class="Card">
  <h2 id="modal-1-title" class="Modal-title">
  Do you want to create a Rebus Ink account?
  </h2>
  <div id="modal-1-content" class="Modal-content">
    <p class="Modal-text">Since this is your first time here, we just wanted to double-check that you want to create a Rebus Ink account and accept our terms of service.</p>
    <div class="center">
      <p><a href="https://google.com/">No thanks, I&rsquo;ll find something else to do</a></p>
      
      <p><ink-button @click=${event => {
    event.target.disable = 'true'
    event.target.setAttribute('working', 'true')
    api.profile.create().then(profile => setProfile(profile))
  }}>Yes, create an account</ink-button></p>
    </div>
  </div>
</div>
</div>`
}

function signIn () {
  return html`<div class="TwoUp">
<div class="Card">
  <h2 id="modal-1-title" class="Modal-title">
  New To Rebus Ink?
  </h2>
  <div id="modal-1-content" class="Modal-content">
    <p class="Modal-text"><em>Sign Up</em> and enjoy Rebus Ink</p>
    <div class="Modal-row">
      <span></span>
      <form action="/login?returnTo=%2Flibrary" method="POST" id="sign-up-form">
        <ink-button @click=${() =>
    document.getElementById('sign-up-form').submit()}>Sign Up</ink-button>
      </form>
    </div>
  </div>
</div>

<div class="Card Card--flat">
  <h2 id="modal-1-title" class="Modal-title">
  Already Using Rebus Ink?
  </h2>
  <div id="modal-1-content" class="Modal-content">
    <p class="Modal-text">Sign in to use Rebus Ink</p>
    <div class="Modal-row">
      <span></span>
      <form action="/login?returnTo=%2Flibrary" method="POST" id="sign-in-form">
        <text-button secondary @click=${() =>
    document
      .getElementById('sign-in-form')
      .submit()}>Sign In</text-button>
      </form>
    </div>
  </div>
</div>
  </div>`
}

function loading () {
  return html`<div class="App-working"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg></div>`
}
window.customElements.define(
  'ink-app',
  component(App, window.HTMLElement, { useShadowDOM: false })
)
