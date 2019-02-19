const viperHTML = require('viperhtml')
const { page } = require('../../views/page.js')
const { getUserStreams } = require('../utils/get-user-streams.js')
const express = require('express')
const router = express.Router()
const debug = require('debug')('vonnegut:routes:import')

router.get('/logout', getUserStreams, function (req, res, next) {
  const render = viperHTML.wire
  debug(req.user)
  res.type('html')
  res.send(
    page(
      render,
      {},
      req,
      () => `<div class="FrontLayout"><form action="/logout" method="POST" class="FrontLayout-child">
    <button class="Button">Log Out</button>
    </form></div>`
    )
  )
})
router.post('/logout', (req, res) => {
  req.session = null
  req.logout()
  res.redirect('/')
})

module.exports = router
