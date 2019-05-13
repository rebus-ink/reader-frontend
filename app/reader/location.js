import wickedElements from 'wicked-elements'
import {savePosition} from './state.js'
import lifecycle from 'page-lifecycle/dist/lifecycle.mjs'

lifecycle.addEventListener('statechange', function (event) {
  const root = document.getElementById('reader')
  if (lifecycle.state === 'passive' && event.oldState === 'active' && root.dataset.currentPosition) {
    savePosition(root.dataset.currentPosition)
  }
  console.log(lifecycle.state, event.oldState)
})

const positionObserver = new window.IntersectionObserver(onPosition, {
  threshold: 1,
  rootMargin: '0px 0px -50% 0px'
})

let highest
function onPosition (entries) {
  const nextHighest = entries.reduce((prev, current) => {
    if (
      current.intersectionRatio > prev.intersectionRatio &&
      current.intersectionRatio === 1
    ) {
      return current
    } else {
      return prev
    }
  })
  if (!highest) {
    highest = nextHighest
  } else if (nextHighest.intersectionRatio >= highest.intersectionRatio) {
    highest = nextHighest
  }
  const root = document.getElementById('reader')
  root.dataset.currentPosition =
    highest.target.dataset.location
  if (root.dataset.callout === 'true') {
    highest.target.classList.add('is-callout')
    document.querySelector('[data-location].is-callout').classList.remove('is-callout')
  }
  window.history.replaceState({}, document.title, `${window.location.pathname}#${highest.target.dataset.location}`)
  // window.location.hash = '#' + highest.target.dataset.location
}

wickedElements.define('[data-location]', {
  init: function (event) {
    positionObserver.observe(event.currentTarget)
  },
  onconnected (event) {
    // // add position attributes to marker
  },
  ondisconnected (event) {
    positionObserver.unobserve(event.currentTarget)
    // remove drop down marker element from sidebar
  }
})
