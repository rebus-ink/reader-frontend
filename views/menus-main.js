export const topMenuMain = (render, model) => render(
  model,
  ':topMenuMain'
)`<nav class="Menu Menu--top Menu--center">
<ul class="Menu-list">
  <li id="button-show-navigation-menu"><button class="TextButton" aria-label="Show Navigation menu" is="nav-menu-toggle" id="nav-menu-toggle" data-menu-id='NavSidebar'>Menu</button></li>
</ul>
</nav>`
