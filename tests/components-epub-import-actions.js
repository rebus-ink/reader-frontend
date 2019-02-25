const path = require('path')
const cappadonna = require('./utils/cappadonna-modules-fork.js')
const test = cappadonna(
  path.join(__dirname, '../app/importer/epub/actions.js'),
  { require: { expose: 'epub-import-actions' } }
)
const fs = require('fs')
const jszip = fs.readFileSync(path.join(__dirname, 'test-files/jszip.js'), {
  encoding: 'utf8'
})
const testEpub = fs.readFileSync(
  path.join(__dirname, 'test-files/test-epub.base64.js'),
  { encoding: 'utf8' }
)

// Test load - file is in event
test('load', async (page, t) => {
  try {
    await page.addScriptTag({
      content: jszip
    })
    await page.addScriptTag({
      content: testEpub
    })
  } catch (error) {
    console.log(error.message)
  }
  await page.evaluate(async () => {
    const { actions } = require('epub-import-actions')
    const context = {}
    try {
      const result = await actions.load(context, {
        detail: { file: window.testEpub, base64: true }
      })
      t.equals(result.opfPath, 'OEBPS/content.opf')
    } catch (err) {
      console.log(err.message)
    }
  })
  t.end()
})

// test parse
test('parse', async (page, t) => {
  try {
    await page.addScriptTag({
      content: jszip
    })
    await page.addScriptTag({
      content: testEpub
    })
  } catch (error) {
    console.log(error.message)
  }
  await page.evaluate(async () => {
    const { actions } = require('epub-import-actions')
    let context, result
    try {
      const meta = document.createElement('meta')
      meta.setAttribute('name', 'rebus-user-id')
      meta.setAttribute('content', 'test-value')
      document.head.appendChild(meta)
      const testEpubBlob = await window
        .fetch(`data:application/epub+zip;base64,${window.testEpub}`)
        .then(res => res.blob())
      const testEpub = new window.File([testEpubBlob], 'test-epub.epub', {
        type: 'application/epub+zip'
      })
      context = await actions.load({}, { detail: { file: testEpub } })
      result = await actions.parse(context)
    } catch (err) {
      console.error(err.message)
    }
    t.equals(result.fileName, 'test-epub.epub')
    t.matches(result, {
      epubVersion: '2.0',
      title: 'Minimal Test File',
      identifier: 'urn:D35116F7-9AF8-4C13-B348-85E031B31080',
      lang: 'en',
      ncx: `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">

<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
    <head>
        <meta name="dtb:uid" content="urn:D0B4528D-AF80-4A7B-81AD-B9F05C2E69B4"></meta>
        <meta name="dtb:depth" content="1"></meta>
        <meta name="dtb:totalPageCount" content="0"></meta>
        <meta name="dtb:maxPageNumber" content="0"></meta>
    </head>
    <docTitle>
        <text>Test file</text>
    </docTitle>
    <navMap>
        <navPoint id="navPoint-2" playOrder="1">
            <navLabel>
                <text>Test content
</text>
            </navLabel>
            <content src="aftermath.xhtml"></content>
        </navPoint>
    </navMap>
</ncx>`
    })
    t.ok(
      result.opfURL.href.startsWith(
        'https://storage.googleapis.com/rebus-default-bucket/'
      )
    )
    t.ok(result.opfURL.href.endsWith(result.opfPath))
    t.ok(result.url[0])
    t.notOk(result.icon)
    t.matches(result.attributedTo, [
      {
        type: 'Person',
        name: 'Baldur Bjarnason'
      }
    ])
  })
  t.end()
})
