import { clean } from '../server/utils/sanitize-state'
// Need to make sure this has a return link and location markers
export const tocSidebarView = (render, model, req) => {
  return render(
    model,
    ':tocSidebarView'
  )`<div class="NavSidebar" id="NavSidebar">
  ${[clean(model.toc.content)]}
</div>`
}
