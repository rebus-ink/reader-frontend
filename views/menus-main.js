export const topMenuMain = (render, model) => render(
  model,
  ':topMenuMain'
)`<nav class="Menu Menu--top Menu--center">
<ul class="Menu-list">
  <li id="button-show-navigation-menu"><button class="TextButton" aria-label="Show Navigation menu">Menu</button></li>
  <li><button class="TextButton">Filter</button></li>
  <li><button class="TextButton" aria-label="Information">Sort</button></li>
</ul>
</nav>`
