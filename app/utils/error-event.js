export function errorEvent (err) {
  document.body.dispatchEvent(
    new window.CustomEvent('reader:error', {
      detail: {error: err}
    })
  )
  return err
}
