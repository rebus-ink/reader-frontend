const viperHTML = require('viperhtml')
const { pageBody } = require('../../views/reader-chapter.js')
const { pageHead } = require('../../views/page-head.js')
const { pageFoot } = require('../../views/page-foot.js')
const { ensureLogin } = require('../ensure-login.js')
const { getUserStreams } = require('../utils/get-user-streams.js')
const express = require('express')
const router = express.Router()

const viewModel = require('../../library-mock.json')
const getBookState = (req, res) => {
  return Promise.resolve().then(() => {
    const id = `${process.env.API_DOMAIN}/${req.params.bookId}`
    const book = viewModel.books.filter(book => book.id === id)[0]
    const chapter = book.orderedItems[0]
    return { book, chapter }
  })
}

router.get('/reader/:bookId', ensureLogin, getUserStreams, function (
  req,
  res,
  next
) {
  return getBookState(req, res)
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
