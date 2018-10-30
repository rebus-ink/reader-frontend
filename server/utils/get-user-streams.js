function getUserStreams (req, res, next) {
  if (req.user) {
    const readerId = req.user.readerId
    const host = process.env.API_DOMAIN || req.headers.host
    req.user.streams = {
      profile: `https://${host}/api/${readerId}`,
      library: `https://${host}/api/${readerId}/library`,
      outbox: `https://${host}/api/${readerId}/activity`,
      streams: `https://${host}/api/${readerId}/streams`
    }
  }
  next()
}

module.exports.getUserStreams = getUserStreams
