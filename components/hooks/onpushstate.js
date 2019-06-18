// Heavily based on 'onpushstate' by Andrea Giammarchi, ISC License https://raw.githubusercontent.com/WebReflection/onpushstate/master/index.js
/* istanbul ignore next */
document.addEventListener(
  'click',
  function (event) {
    // find the link node (even if inside an opened Shadow DOM)
    // Changed to support Firefox
    let target = event.target.shadowRoot
      ? testClicker(event.composedPath())
      : event.target
    // find the anchor
    const anchor = (
      target.closest ||
      function (A) {
        while (target && target.nodeName !== A) target = target.parentNode
        return target
      }
    ).call(target, 'A')

    if (
      // it was found
      anchor &&
      // it's for the current page
      /^(?:_self)?$/i.test(anchor.target) &&
      // it's not a download
      !anchor.hasAttribute('download') &&
      // it's not a resource handled externally
      anchor.getAttribute('rel') !== 'external' &&
      // it's not a click with ctrl/shift/alt keys pressed
      // => (let the browser do it's job instead)
      !event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      // all states are simply fully resolved URLs
      // pushstate will be the new page with old one as state
      // popstate will be old page with previous one as state.
      const next = new URL(anchor.href)
      const curr = window.location
      // only if in the same origin
      if (next.origin === curr.origin) {
        // verify it's not just an anchor change
        var redirect = next.pathname + next.search
        var hash = next.hash
        var scrollIntoView = true
        // in every case prevent the default action
        event.preventDefault()
        // but don't stop propagation, other listeners
        // might want to be triggered regardless the history
        if (redirect === curr.pathname + curr.search) {
          // anchors should do what anchors do, only if valid
          // https://www.w3.org/TR/html4/types.html#type-name
          if (/^#[a-z][a-z0-9.:_-]+$/i.test(hash)) {
            const target = document.querySelector(
              hash + ',[name="' + hash.slice(1) + '"]'
            )
            if (target) {
              // verify if other listeners tried to prevent the default
              event.preventDefault = function () {
                scrollIntoView = false
              }
              // after this event has captured and bubbled the DOM
              setTimeout(function () {
                // if nobody else prevented the default
                // simulate what an anchor would've done
                if (scrollIntoView) target.scrollIntoView(true)
              })
            }
          }
          // replace the history to ignore the popstate on anchor
          window.history.replaceState(
            window.history.state,
            document.title,
            redirect + hash
          )
        } else {
          // trigger a new pushstate notification
          var customEvent = new window.CustomEvent('pushstate')
          customEvent.current = curr.href
          customEvent.next = next
          // being sure it happens after so the new location should be available
          setTimeout(function () {
            // dispatch the event
            window.dispatchEvent(customEvent)
            // also trigger Level 0 if possible
            if (window.onpushstate) window.onpushstate(customEvent)
          })
          window.history.pushState(
            customEvent.state,
            document.title,
            redirect + hash
          )
        }
      }
    }
  },
  true
)

function testClicker (path) {
  if (path[0]) {
    let clicker = path[0].closest('a')
    if (!clicker) {
      clicker = path[0]
    }
    return clicker
  } else {
    return false
  }
}
