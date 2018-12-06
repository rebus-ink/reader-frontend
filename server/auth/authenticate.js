const passport = require('passport')
const short = require('short-uuid')
const translator = short()
const { get } = require('../utils/api-get')
const { post } = require('../utils/api-post')
const jwt = require('jsonwebtoken')
const ms = require('ms')
const URL = require('url').URL

async function processAuth (user, {storage, tokenStorage}) {
  const storedUser = await storage.get(user.id)
  if (!storedUser) {
    // fetch /whoami, if no /whoami, create user and assign to storedUser
    const expiresIn = '30m'
    const token = jwt.sign({ sub: user.id }, process.env.SECRETORKEY, {
      algorithm: 'HS256',
      expiresIn,
      jwtid: translator.new(),
      audience: process.env.AUDIENCE,
      issuer: process.env.ISSUER
    })
    await tokenStorage.set(user.id, token, ms(expiresIn))
    let result
    try {
      result = await get('whoami', token)
    } catch (err) {
    }
    if (result) {
      const newUser = {id: user.id, reader: result}
      newUser.readerId = new URL(result.id).pathname.split('-')[1]
      await storage.set(user.id, newUser)
      return newUser
    } else {
      const newReader = {
        type: 'Person',
        summary: `Reader profile for user id ${user.id}`
      }
      const result = await post('readers', newReader, token)
      const newUser = {id: user.id, reader: result}
      newUser.readerId = new URL(result.id).pathname.split('-')[1]
      await storage.set(user.id, newUser)
      return newUser
    }
  } else {
    return storedUser
  }
}

function authenticate (req, res, next) {
  if (req.query.returnTo) {
    req.session.returnTo = req.query.returnTo
  }
  const {strategy, failureRedirect = '/login', storage, tokenStorage, successRedirect = '/'} = req.app.locals.authOptions
  passport.authenticate(strategy.name, function (err, user) {
    if (err) { next(err) }
    if (!user) { next(new Error('No user')) }
    return processAuth(user, {strategy, failureRedirect, storage, tokenStorage, successRedirect}).then(user => {
      return req.logIn(user, function (err) {
        if (err) {
          throw err
        }
        const returnTo = req.session.returnTo
        req.session.returnTo = null
        res.redirect(returnTo || successRedirect)
      })
    }).catch(err => {
      if (err.message === 'No user') {
        return res.redirect(failureRedirect)
      } else {
        next(err)
      }
    })
  })(req, res, next)
}

module.exports.authenticate = authenticate
