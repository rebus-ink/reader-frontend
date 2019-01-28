const viperHTML = require('viperhtml')
const { pageBody } = require('../../views/settings-body.js')
const { page } = require('../../views/page.js')
const { ensureLogin } = require('../ensure-login.js')
const { getUserStreams } = require('../utils/get-user-streams.js')
const express = require('express')
const router = express.Router()
const getSettingsState = () => Promise.resolve({})

router.get('/library/settings', ensureLogin, getUserStreams, function (
  req,
  res,
  next
) {
  return getSettingsState(req, res)
    .then(model => {
      const render = viperHTML.wire
      res.set('Content-Type', 'text/html')
      res.send(page(render, model, req, pageBody))
    })
    .catch(err => next(err))
})

module.exports = router
