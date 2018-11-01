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
export const bottomMenuMain = (render, model) => render(
  model,
  ':bottomMenuMain'
)`<nav class="Menu Menu--bottom Menu--center">
<ul class="Menu-list">
  <li><button class="TextButton">Sort…</button></li>
  <li><button class="TextButton">Import</button></li>
  <li><button class="TextButton">Select</button></li>
</ul>
</nav>`
