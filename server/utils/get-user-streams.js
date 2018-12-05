function getUserStreams (req, res, next) {
  if (req.user) {
    const reader = req.user.reader
    req.user.streams = {
      profile: reader.id,
      library: reader.streams.items[0].id,
      outbox: reader.outbox,
      streams: `${reader.id}/streams`,
      upload: `${process.env.DOMAIN}file-upload`
    }
  }
  next()
}

module.exports.getUserStreams = getUserStreams
