const helmet = require('helmet')
function securitySetup (app) {
  // Security settings
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", 'blob:', "'unsafe-inline'", "'unsafe-eval'"], // For now
          styleSrc: ["'self'", "'unsafe-inline'"],
          connectSrc: ["'self'", 'https://rebus.auth0.com'],
          objectSrc: ["'none'"],
          imgSrc: ['*', 'data:', 'https:', 'blob:'],
          frameSrc: [
            'https://www.youtube.com',
            'https://www.youtube-nocookie.com'
          ],
          fontSrc: ["'self'"],
          formAction: ["'self'", 'https://rebus.auth0.com'],
          frameAncestors: ["'none'"]
        }
      }
    })
  )
}

module.exports.securitySetup = securitySetup
