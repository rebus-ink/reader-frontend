function getUserStreams (req, res, next) {
  if (req.user) {
    const readerId = req.user.readerId
    const host = process.env.API_DOMAIN || req.headers.host
    req.user.streams = {
      profile: `https://${host}/${readerId}`,
      library: `https://${host}/${readerId}/library`,
      outbox: `https://${host}/${readerId}/activity`,
      streams: `https://${host}/${readerId}/streams`
    }
  }
  next()
}

module.exports.getUserStreams = getUserStreams
