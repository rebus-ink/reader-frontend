const path = require('path')
const cappadonna = require('./utils/cappadonna-modules-fork.js')
const test = cappadonna(
  path.join(__dirname, '../app/formats/EpubBook/index.js'),
  { require: { expose: 'epubbook' } }
)
const fs = require('fs')
const jszip = fs.readFileSync(path.join(__dirname, 'test-files/jszip.js'), {
  encoding: 'utf8'
})
const testEpub = fs.readFileSync(
  path.join(__dirname, 'test-files/test-epub.base64.js'),
  { encoding: 'utf8' }
)

const {
  testactivity,
  testActivityAfter,
  guideAttachment
} = require('./test-files/testactivity.js')

const testepubs = {
  'test-epub-meta-cover.epub': fs
    .readFileSync(
      path.join(__dirname, './test-files/test-epub-meta-cover.epub')
    )
    .toString('base64'),
  'test-epub-guide-cover.epub': fs
    .readFileSync(
      path.join(__dirname, './test-files/test-epub-guide-cover.epub')
    )
    .toString('base64'),
  'test-epub-linear-cover.epub': fs
    .readFileSync(
      path.join(__dirname, './test-files/test-epub-linear-cover.epub')
    )
    .toString('base64')
}
const propertiesEpub = fs
  .readFileSync(
    path.join(__dirname, './test-files/test-epub-properties-cover.epub')
  )
  .toString('base64')

test('load', async (page, t) => {
  try {
    await page.addScriptTag({
      content: jszip
    })
    await page.addScriptTag({
      content: testEpub
    })
  } catch (error) {
    console.log('error: ', error.message)
  }
  await page.evaluate(async testactivity => {
    const { createBook } = require('epubbook')
    try {
      const book = await createBook({
        detail: {
          file: window.testEpub,
          fileName: 'test-epub.epub',
          base64: true,
          DOMAIN: 'http://example.com/'
        }
      })
      t.matches(book.activity, testactivity)
    } catch (err) {
      console.log('error: ', err.message)
      t.error(err)
    }
  }, testactivity)
  t.end()
})

test('load: propertiesEpub', async (page, t) => {
  try {
    await page.addScriptTag({
      content: jszip
    })
  } catch (error) {
    console.log('error: ', error.message)
  }
  await page.evaluate(
    async (testactivity, epub, key, testActivityAfter) => {
      const { createBook } = require('epubbook')
      testactivity.url[0].href = 'http://example.com/' + key
      testactivity.attachment.push({
        type: 'Image',
        url: [
          {
            type: 'Link',
            href: 'http://example.com/OEBPS/placeholder-cover.png',
            rel: ['alternate'],
            mediaType: 'image/png'
          }
        ],
        rel: ['cover'],
        'reader:path': 'OEBPS/placeholder-cover.png'
      })
      testactivity.attachment.push({
        type: 'Document',
        url: [
          {
            type: 'Link',
            href: 'http://example.com/OEBPS/content.opf',
            rel: ['alternate'],
            mediaType: 'application/oebps-package+xml'
          }
        ],
        'reader:path': 'OEBPS/content.opf'
      })
      testactivity.icon = {
        type: 'Image',
        url: [
          {
            type: 'Link',
            href: 'http://example.com/OEBPS/placeholder-cover.png',
            rel: ['alternate'],
            mediaType: 'image/png'
          }
        ],
        rel: ['cover'],
        'reader:path': 'OEBPS/placeholder-cover.png'
      }
      try {
        const book = await createBook({
          detail: {
            file: epub,
            fileName: key,
            base64: true,
            DOMAIN: 'http://example.com/'
          }
        })

        t.matches(testactivity, book.activity)
        t.ok(await book.uploadMedia(uploadMock))
        t.matches(testActivityAfter, book.activity)
      } catch (err) {
        console.log('error: ', err.message)
        t.error(err)
      }
      async function uploadMock (formdata) {
        const entries = formdata.getAll('files')
        t.ok(entries.length <= 10)
        t.ok(entries.length === 5 || entries.length === 1)
        const result = {}
        entries.forEach(entry => {
          result[entry.name] = new URL(
            entry.name,
            'http://example.com/pub-id/'
          ).href
        })
        return result
      }
    },
    testactivity,
    propertiesEpub,
    'test-epub-properties-cover.epub',
    testActivityAfter
  )
  t.end()
})

Object.keys(testepubs).forEach(key => {
  const epub = testepubs[key]
  test('load ' + key, async (page, t) => {
    try {
      await page.addScriptTag({
        content: jszip
      })
    } catch (error) {
      console.log('error: ', error.message)
    }
    await page.evaluate(
      async (testactivity, epub, key, guideAttachment) => {
        const { createBook } = require('epubbook')
        testactivity.url[0].href = 'http://example.com/' + key
        testactivity.attachment.push({
          type: 'Image',
          url: [
            {
              type: 'Link',
              href: 'http://example.com/OEBPS/placeholder-cover.png',
              rel: ['alternate'],
              mediaType: 'image/png'
            }
          ],
          'reader:path': 'OEBPS/placeholder-cover.png'
        })
        testactivity.attachment.push({
          type: 'Document',
          url: [
            {
              type: 'Link',
              href: 'http://example.com/OEBPS/content.opf',
              rel: ['alternate'],
              mediaType: 'application/oebps-package+xml'
            }
          ],
          'reader:path': 'OEBPS/content.opf'
        })
        testactivity.icon = {
          type: 'Image',
          url: [
            {
              type: 'Link',
              href: 'http://example.com/OEBPS/placeholder-cover.png',
              rel: ['alternate'],
              mediaType: 'image/png'
            }
          ],
          'reader:path': 'OEBPS/placeholder-cover.png'
        }
        if (key.includes('linear') || key.includes('guide')) {
          testactivity.attachment = guideAttachment
        }
        try {
          const book = await createBook({
            detail: {
              file: epub,
              fileName: key,
              base64: true,
              DOMAIN: 'http://example.com/'
            }
          })

          t.matches(testactivity, book.activity)
          t.ok(await book.uploadMedia(uploadMock))
        } catch (err) {
          console.log('error: ', err.message)
          t.error(err)
        }
        async function uploadMock (formdata) {
          const entries = formdata.getAll('files')
          t.ok(entries.length <= 10)
          if (key === 'test-epub-meta-cover.epub') {
            t.ok(entries.length === 5 || entries.length === 1)
          } else {
            t.ok(entries.length === 6 || entries.length === 1)
          }
          const result = {}
          entries.forEach(entry => {
            result[entry.name] = new URL(
              entry.name,
              'http://example.com/pub-id/'
            ).href
          })
          return result
        }
      },
      testactivity,
      epub,
      key,
      guideAttachment
    )
    t.end()
  })
})
