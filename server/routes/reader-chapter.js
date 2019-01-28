const viperHTML = require('viperhtml')
const { pageBody } = require('../../views/reader-chapter.js')
const { page } = require('../../views/page.js')
const { ensureLogin } = require('../ensure-login.js')
const { getUserStreams } = require('../utils/get-user-streams.js')
const express = require('express')
const router = express.Router()
const { getBookState } = require('../utils/get-book-state.js')
const { arrify } = require('../utils/arrify.js')
const debug = require('debug')('vonnegut:routes:chapter')

router.get('/reader/:bookId/*', ensureLogin, getUserStreams, function (
  req,
  res,
  next
) {
  debug(req.path)
  return getBookState(req, res)
    .then(model => {
      debug('got model')
      if (model.chapter.type !== 'Document') {
        return res.redirect(getAlternate(model.chapter))
      }
      const render = viperHTML.wire
      res.set('Content-Type', 'text/html')
      return res.send(page(render, model, req, pageBody))
    })
    .catch(err => next(err))
})

function getAlternate (chapter) {
  const urls = arrify(chapter.url)
  const link = urls.filter(item => item.rel.indexOf('alternate') !== -1)[0]
  if (link) {
    return link.href
  } else {
    return '/static/placeholder-cover.png'
  }
}

module.exports = router
