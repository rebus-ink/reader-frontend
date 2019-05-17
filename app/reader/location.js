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
  threshold: [0, 0.25, 0.5, 0.75, 1],
  rootMargin: '30px 0px -75% 0px'
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
  const previousHighest = document.querySelector('[data-location].is-current')
  if (previousHighest) {
    previousHighest.classList.remove('is-current')
  }
  highest.target.classList.add('is-current')
  if (root.dataset.callout === 'true') {
    const previousCallout = document.querySelector('[data-location].is-callout')
    if (previousCallout) {
      previousCallout.classList.remove('is-callout')
    }
    highest.target.classList.add('is-callout')
  }
  // window.history.replaceState({}, document.title, `${window.location.pathname}#${highest.target.dataset.location}`)
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
