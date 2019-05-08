import wickedElements from 'wicked-elements'

const config = {
  rootMargin: '50px 0px',
  threshold: 0.01
}
const imageObserver = new window.IntersectionObserver(loadImage, config)

wickedElements.define('[data-lazy-src]', {
  init (event) {
    if (!('IntersectionObserver' in window)) {
      loadImage(event.currentTarget)
    } else {
      imageObserver.observe(event.currentTarget)
    }
  }
})

function loadImage (entries) {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0) {
    // Stop watching and load the image
      imageObserver.unobserve(entry.target)
      getImage(entry.target)
    }
  })
}

function getImage (image) {
  if (image.getAttribute('src') !== image.dataset.lazySrc) {
    image.src = image.dataset.lazySrc
  }
}
