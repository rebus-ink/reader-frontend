const viperHTML = require('viperhtml')
const { pageHead } = require('../../views/page-head.js')
const { pageFoot } = require('../../views/page-foot.js')
const express = require('express')
const router = express.Router()
const { getUserStreams } = require('../utils/get-user-streams.js')
const debug = require('debug')('vonnegut:routes:front-page')

router.get('/', getUserStreams, function (req, res, next) {
  const render = viperHTML.wire
  if (req.user) {
    debug(req.user)
    res.send(
      pageHead(render, {}, req) +
        `<div class="FrontLayout">

    <form action="/logout" method="POST" class="FrontLayout-child">
    <button class="Button">Log Out</button>
    </form>
    <pre class="FrontLayout-child">${JSON.stringify(
    req.user,
    null,
    4
  )}</pre>
        </div>` +
        pageFoot(render, {}, req)
    )
  } else {
    res.send(
      pageHead(render, {}, req) +
        `<div class="FrontLayout">
    <form action="/login?returnTo=/library" method="POST" class="FrontLayout-child">
    <button class="Button">Log In</button>
    </form>
    </div>` +
        pageFoot(render, {}, req)
    )
  }
})

module.exports = router
