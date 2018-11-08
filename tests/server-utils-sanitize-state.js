const tap = require('tap')
const { clean, makeModelSafe } = require('../server/utils/sanitize-state.js')

tap.test('clean', test => {
  const dirtyHTML = `<h3>&quot;What if I want to allow only specific values on some attributes?&quot;</h3><p>When configuring the attribute in <code>allowedAttributes</code> simply use an object with attribute <code>name</code> and an allowed <code>values</code> array. In the following example <code>sandbox=&quot;allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-scripts&quot;</code> would become <code>sandbox=&quot;allow-popups allow-scripts&quot;</code>:</p>`
  test.equals(clean(dirtyHTML + '<script></script>'), dirtyHTML)
  test.end()
})

tap.test('makeModelSafe', test => {
  const dirtyHTML = `<h3>&quot;What if I want to allow only specific values on some attributes?&quot;</h3><p>When configuring the attribute in <code>allowedAttributes</code> simply use an object with attribute <code>name</code> and an allowed <code>values</code> array. In the following example <code>sandbox=&quot;allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-scripts&quot;</code> would become <code>sandbox=&quot;allow-popups allow-scripts&quot;</code>:</p>`
  const model = {
    toc: dirtyHTML + '<script></script>',
    content: dirtyHTML + '<script></script>'
  }
  const safe = makeModelSafe(model)
  test.equals(safe.toc, dirtyHTML)
  test.equals(safe.content, dirtyHTML)
  test.end()
})
