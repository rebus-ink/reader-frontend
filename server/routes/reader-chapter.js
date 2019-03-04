const viperHTML = require('viperhtml')
const { pageBody } = require('../../views/render-body.js')
const { page } = require('../../views/page.js')
const { ensureLogin } = require('../ensure-login.js')
const { getUserStreams } = require('../utils/get-user-streams.js')
const express = require('express')
const router = express.Router()
const debug = require('debug')('vonnegut:routes:chapter')
const { getBookState } = require('../utils/get-book-state.js')
const { arrify } = require('../utils/arrify.js')
const csurf = require('csurf')

router.get('/reader/:bookId/*', ensureLogin, csurf(), getUserStreams, function (
  req,
  res,
  next
) {
  debug(req.path)
  return getBookState(req, res)
    .then(model => {
      debug('got model')
      debug(getAlternate(model.chapter))
      if (model.chapter.type === 'Document') {
        const render = viperHTML.wire
        res.type('html')
        res.send(page(render, {}, req, pageBody))
      } else {
        return res.redirect(getAlternate(model.chapter))
      }
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
