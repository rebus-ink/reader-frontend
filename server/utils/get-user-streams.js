const debug = require('debug')('vonnegut:utils:get-user-streams')
function getUserStreams (req, res, next) {
  if (req.user) {
    debug(req.user.id)
    const { reader = {} } = req.user
    req.user.streams = {
      profile: reader.id,
      outbox: reader.outbox,
      streams: `${reader.id}/streams`,
      upload: `${process.env.DOMAIN}file-upload`
    }
    if (
      reader &&
      reader.streams &&
      reader.streams.items &&
      reader.streams.items[0]
    ) {
      req.user.streams.library = reader.streams.items[0].id
    }
  }
  next()
}

module.exports.getUserStreams = getUserStreams
