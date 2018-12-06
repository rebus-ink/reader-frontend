const LANG = 'en'
module.exports.getLocaleProperty = function getLocaleProperty (
  activity,
  property
) {
  if (activity[property]) {
    return { [property]: activity[property], lang: LANG }
  } else if (activity[property + 'Map'] && activity[property + 'Map'][LANG]) {
    return { [property]: activity[property + 'Map'][LANG], lang: LANG }
  } else if (activity[property + 'Map']) {
    const lang = Object.keys(activity[property + 'Map'])[0]
    return { [property]: activity[property + 'Map'][lang], lang }
  }
}
