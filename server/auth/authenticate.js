const passport = require('passport')
const short = require('short-uuid')
const translator = short()

function authenticate ({
  strategy,
  storage,
  successRedirect = '/',
  failureRedirect = '/login'
}) {
  return function (req, res, next) {
    if (req.query.returnTo) {
      req.session.returnTo = req.query.returnTo
    }
    passport.authenticate(strategy.name, function (err, user) {
      return Promise.resolve()
        .then(() => {
          if (err) {
            throw err
          }
          if (!user) {
            throw new Error('No user')
          }
          return storage.get(user.id)
        })
        .then(storedUser => {
          if (storedUser) {
            return storedUser
          } else {
            let email
            try {
              email = user.emails[0].value
            } catch (err) {}
            const newUser = {
              id: user.id,
              readerId: translator.new(),
              email,
              provider: user.provider
            }
            storage.set(user.id, newUser)
            return newUser
          }
        })
        .then(user => {
          return req.logIn(user, function (err) {
            if (err) {
              throw err
            }
            const returnTo = req.session.returnTo
            req.session.returnTo = null
            res.redirect(returnTo || successRedirect)
          })
        })
        .catch(err => {
          if (err.message === 'No user') {
            return res.redirect(failureRedirect)
          } else {
            next(err)
          }
        })
    })(req, res, next)
  }
}

module.exports.authenticate = authenticate
