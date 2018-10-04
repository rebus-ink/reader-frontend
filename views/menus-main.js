export const topMenu = (render, model) => render`<nav class="Menu Menu--top">
<ul class="Menu-list">
  <li><button class="TextButton">Menu</button></li>
  <li><button class="Button Button--menu">Filter</button></li>
  <li><button class="TextButton TextButton--information" aria-label="Information">i</button></li>
</ul>
</nav>`
export const bottomMenu = (
  render,
  model
) => render`<nav class="Menu Menu--bottom">
<ul class="Menu-list">
  <li><button class="TextButton">Sort…</button></li>
  <li><button class="Button Button--menu">Import</button></li>
  <li><button class="TextButton">Select</button></li>
</ul>
</nav>`
