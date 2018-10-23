const viperHTML = require('viperhtml')
const { pageHead } = require('../../views/page-head.js')
const { pageFoot } = require('../../views/page-foot.js')
const express = require('express')
const router = express.Router()

router.get('/logout', function (req, res, next) {
  const render = viperHTML.wire
  res.send(
    pageHead(render) +
      `<div class="FrontLayout"><form action="/logout" method="POST" class="FrontLayout-child">
      <button class="Button">Log Out</button>
      </form></div>` +
      pageFoot(render)
  )
})
router.post('/logout', (req, res) => {
  req.session = null
  req.logout()
  res.redirect('/')
})

module.exports = router
