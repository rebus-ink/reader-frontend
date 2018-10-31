export const navSidebarView = (render, model, req) => {
  const isSelected = path => {
    if (path === req.path) {
      return 'NavSidebar-item is-selected'
    }
  }
  return render(model, ':navSidebarView')`<nav class="NavSidebar">
  <h1 class="NavSidebar-title">Rebus Reader</h1>
  <ol>
    <li class="${isSelected(
    '/library'
  )}"><a href="/library" class="NavSidebar-link">Library</a></li>
    <li class="${isSelected(
    '/library/notes'
  )}"><a href="/library/notes" class="NavSidebar-link">Notes</a></li>
    <li class="${isSelected(
    '/library/import'
  )}"><a href="/library/import" class="NavSidebar-link">Import</a></li>
    <li class="${isSelected(
    '/library/settings'
  )}"><a href="/library/settings" class="NavSidebar-link">Settings</a></li>
  </ol>
</nav>`
}
