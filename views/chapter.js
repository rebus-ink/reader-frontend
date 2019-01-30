const { clean } = require('../server/utils/sanitize-state')

module.exports.chapterView = (render, model) => {
  const { chapter = {} } = model
  const content = model.clean ? model.clean : clean(chapter.content)
  return render(model, ':chapter')`${[content]}`
}
