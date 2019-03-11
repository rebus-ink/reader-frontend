import wickedElements from 'wicked-elements'

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
  document.getElementById('reader').dataset.currentPosition =
    highest.target.dataset.location
  window.location.hash = '#' + highest.target.dataset.location
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
