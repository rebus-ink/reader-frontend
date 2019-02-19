/* Based on `arrify` from https://github.com/sindresorhus/arrify, MIT licensed */

function arrify (val) {
  if (val === null || val === undefined) {
    return []
  }
  return Array.isArray(val) ? val : [val]
}
module.exports.arrify = arrify
