export async function transition (selector, styles, step) {
  const transitionPromises = []
  const elements = document.querySelectorAll(selector)
  for (const element of elements) {
    transitionPromises.push(animate(element, styles))
    if (step) await delay(step)
  }
  return Promise.all(transitionPromises)
}

export function rafPromise () {
  return new Promise(resolve => window.requestAnimationFrame(resolve))
}

export function transitionPromise (element) {
  return new Promise(resolve => {
    element.addEventListener('transitionend', function handler (event) {
      if (event.target !== element) return null
      element.removeEventListener('transitionend', handler)
      resolve()
    })
  })
}

export function animate (element, styles) {
  Object.assign(element.style, styles)
  return transitionPromise(element)
    .then(_ => rafPromise())
}

export function delay (duration) {
  return new Promise((resolve, reject) => setTimeout(_ => resolve(), duration))
}
