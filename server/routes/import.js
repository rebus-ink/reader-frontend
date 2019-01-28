const viperHTML = require('viperhtml')
const { pageBody } = require('../../views/import-body.js')
const { page } = require('../../views/page.js')
const { ensureLogin } = require('../ensure-login.js')
const { getUserStreams } = require('../utils/get-user-streams.js')
const express = require('express')
const router = express.Router()
const debug = require('debug')('vonnegut:routes:import')

const getImportState = () => Promise.resolve({})

router.get('/library/import', ensureLogin, getUserStreams, function (
  req,
  res,
  next
) {
  debug(req.path)
  return getImportState(req, res)
    .then(model => {
      const render = viperHTML.wire
      debug('got model')
      res.set('Content-Type', 'text/html')
      res.send(page(render, model, req, pageBody))
    })
    .catch(err => next(err))
})

module.exports = router
