const viperHTML = require('viperhtml')
const { pageBody } = require('../../views/reader-chapter.js')
const { pageHead } = require('../../views/page-head.js')
const { pageFoot } = require('../../views/page-foot.js')
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
      if (model.chapter.type !== 'Document') {
        return res.redirect(getAlternate(model.chapter))
      }
      const render = viperHTML.wire
      return res.send(
        pageHead(render, model, req) +
          pageBody(render, model, req) +
          pageFoot(render, model)
      )
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
