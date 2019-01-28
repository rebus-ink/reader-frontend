const viperHTML = require('viperhtml')
const { pageBody } = require('../../views/notes-body.js')
const { page } = require('../../views/page.js')
const { ensureLogin } = require('../ensure-login.js')
const { getUserStreams } = require('../utils/get-user-streams.js')
const express = require('express')
const router = express.Router()

const getNotesState = () => Promise.resolve({})

router.get('/library/notes/:nodeId', ensureLogin, getUserStreams, function (
  req,
  res,
  next
) {
  return getNotesState(req, res)
    .then(model => {
      const render = viperHTML.wire
      res.send(page(render, model, req, pageBody))
    })
    .catch(err => next(err))
})

router.get('/library/notes', ensureLogin, getUserStreams, function (
  req,
  res,
  next
) {
  return getNotesState(req, res)
    .then(model => {
      const render = viperHTML.wire
      res.set('Content-Type', 'text/html')
      res.send(page(render, model, req, pageBody))
    })
    .catch(err => next(err))
})

module.exports = router
