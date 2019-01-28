const { clean } = require('../server/utils/sanitize-state')

module.exports.chapterView = (render, model) => {
  const { chapter = {} } = model
  return render(model, ':chapter')`${[clean(chapter.content)]}`
}
