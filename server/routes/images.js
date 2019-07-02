const wrender = require('wrender')
const express = require('express')
const { ensureLogin } = require('../ensure-login.js')
const got = require('got')
const debug = require('debug')('vonnegut:route:images')
const path = require('path')
const fs = require('fs')
const placeholderPath = path.join(
  __dirname,
  '../../static/placeholder-cover.jpg'
)
const router = express.Router()

const customOrigin = wrender.createOrigin('/:source', async ({ source }) => {
  debug(source)
  try {
    const response = await got.head(source)
    if (response) return got.stream(source)
  } catch (err) {
    return fs.createReadStream(placeholderPath)
  }
})

const instance = wrender({
  convertGIF: false,
  convertPNG: false,
  maxAge: 31536000,
  recipes: [
    wrender.recipes.proxy,
    wrender.recipes.resize,
    wrender.recipes.crop
  ],
  origins: [customOrigin],
  onError: e => {
    console.error(e)
  }
})

router.use(ensureLogin)
router.use(instance)
module.exports = router
