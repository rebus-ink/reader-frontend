export const navSidebarView = (render, model) => render(
  model,
  ':navSidebarView'
)`
<nav class="NavSidebar">
  <h1 class="NavSidebar-title">Rebus Reader</h1>
  <ol>
    <li class="NavSidebar-item is-selected"><a href="#" class="NavSidebar-link">Library</a></li>
    <li class="NavSidebar-item"><a href="#" class="NavSidebar-link">Notes</a></li>
    <li class="NavSidebar-item"><a href="#" class="NavSidebar-link">Import</a></li>
    <li class="NavSidebar-item"><a href="#" class="NavSidebar-link">Settings</a></li>
  </ol>
  <h2 class="NavSidebar-title NavSidebar-title--section">Stacks</h2>
  <ol>
    <li class="NavSidebar-item"><a href="#" class="NavSidebar-link">Work</a></li>
    <li class="NavSidebar-item"><a href="#" class="NavSidebar-link">Thesis</a></li>
    <li class="NavSidebar-item"><a href="#" class="NavSidebar-link">R&amp;D</a></li>
    <li class="NavSidebar-item"><a href="#" class="NavSidebar-link">Sustainable Ecology</a></li>
  </ol>
  <ol class="NavSidebar-buttons">
    <li class="NavSidebar-item"><button class="Button Button--discrete">Add Stack…</button></li>
    <li class="NavSidebar-item"><button class="Button Button--discrete">Edit Stacks…</button></li>
  </ol>
</nav>`
