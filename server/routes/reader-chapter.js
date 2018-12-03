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

router.get('/reader/:bookId/:filePath', ensureLogin, getUserStreams, function (
  req,
  res,
  next
) {
  return getBookState(req, res)
    .then(model => {
      if (model.chapter.type !== 'Document') {
        res.redirect(getAlternate(model.chapter))
      }
      const render = viperHTML.wire
      res.send(
        pageHead(render, model, req) +
          pageBody(render, model, req) +
          pageFoot(render, model)
      )
    })
    .catch(err => next(err))
})

function getAlternate (chapter) {
  const urls = arrify(chapter.url)
  return urls.filter(item => item.rel === 'alternate')[0].href
}

module.exports = router
