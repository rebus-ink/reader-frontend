const viperHTML = require('viperhtml')
const { pageBody } = require('../../views/info-body.js')
const { pageHead } = require('../../views/page-head.js')
const { pageFoot } = require('../../views/page-foot.js')
const { ensureLogin } = require('../ensure-login.js')
const { getUserStreams } = require('../utils/get-user-streams.js')
const express = require('express')
const router = express.Router()

const viewModel = require('../../library-mock.json')
const getInfoState = (req, res) => {
  return Promise.resolve().then(() => {
    const book = viewModel.books.filter(
      book => book.id === req.params.bookId
    )[0]
    return book || {}
  })
}

router.get('/library/info/:bookId', ensureLogin, getUserStreams, function (
  req,
  res,
  next
) {
  return getInfoState(req, res)
    .then(model => {
      const render = viperHTML.wire
      res.send(
        pageHead(render, model) +
          pageBody(render, model, req) +
          pageFoot(render, model)
      )
    })
    .catch(err => next(err))
})

module.exports = router
