// From https://github.com/burakcan/mb under the unlicense. Also, so short that it'd qualify as fair use even if it weren't under an OSS license.
module.exports.mb = p => o => p.map(c => (o = (o || {})[c])) && o // eslint-disable-line
