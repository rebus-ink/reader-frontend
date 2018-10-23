function errorHandler (err, req, res, next) {
  console.error(err.stack)
  if (res.headersSent) {
    return next(err)
  }
  res.format({
    'text/html': function () {
      if (process.env.NODE_ENV === 'development') {
        return res
          .status(err.statusCode || 500)
          .send(
            `<html><head></head><body><pre>${err.stack}</pre></body></html>`
          )
      } else {
        return res.status(err.statusCode || 500).send('Something Went Boom')
      }
    },
    'application/json': function () {
      return res.sendStatus(err.statusCode || 500)
    }
  })
}

module.exports.errorHandler = errorHandler
