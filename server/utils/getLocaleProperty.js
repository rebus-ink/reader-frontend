const LANG = 'en'
module.exports.getLocaleProperty = function getLocaleProperty (
  activity,
  property
) {
  if (activity[property]) {
    return activity[property]
  } else if (activity[property + 'Map'] && activity[property + 'Map'][LANG]) {
    return activity[property + 'Map'][LANG]
  }
}
