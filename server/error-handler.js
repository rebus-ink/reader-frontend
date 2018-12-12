function errorHandler (err, req, res, next) {
  console.error(err.stack)
  if (res.headersSent) {
    return next(err)
  }
  res.format({
    'text/html': function () {
      return res
        .status(err.statusCode || 500)
        .send(
          `<html><head></head><body><pre>${err.stack}</pre></body></html>`
        )
    },
    'application/json': function () {
      return res.sendStatus(err.statusCode || 500)
    }
  })
}

module.exports.errorHandler = errorHandler
