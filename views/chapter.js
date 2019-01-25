import { clean } from '../server/utils/sanitize-state'

export const chapterView = (render, model) => {
  const { chapter = {} } = model
  return render(model, ':chapter')`${[clean(chapter.content)]}`
}
