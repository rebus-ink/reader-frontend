const { app } = require('./server.js')
const morgan = require('morgan')

app.use(function (req, res, next) {
  const path = req.path || ''
  if (req.protocol !== 'https') {
    res.redirect(process.env.DOMAIN + path)
  } else {
    next()
  }
})
// We only need to log errors/bans. Built-in App Engine logs are enough for the rest.
app.use(morgan('combined'))
app.listen(8080, () => console.log('Listening'))
