const viperHTML = require('viperhtml')
const { pageBody } = require('../../views/info-body.js')
const { pageHead } = require('../../views/page-head.js')
const { pageFoot } = require('../../views/page-foot.js')
const { ensureLogin } = require('../ensure-login.js')
const { getUserStreams } = require('../utils/get-user-streams.js')
const { arrify } = require('../utils/arrify.js')
const express = require('express')
const router = express.Router()

const viewModel = require('../../library-mock.json')
const getBookState = (req, res) => {
  return Promise.resolve().then(() => {
    const id = `${process.env.API_DOMAIN}/${req.params.bookId}`
    const book = viewModel.books.filter(book => book.id === id)[0]
    return book || {}
  })
}

const getChapterState = (req, res) => {
  return getBookState(req, res).then(book => {
    const chapter = arrify(book.orderedItems)[req.params.chapter]
    return {
      book,
      chapter
    }
  })
}

router.get('/reader/:bookId/:chapter', ensureLogin, getUserStreams, function (
  req,
  res,
  next
) {
  return getChapterState(req, res)
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
