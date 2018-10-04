export const topMenu = (render, model) => render`<nav class="Menu Menu--top">
<ul class="Menu-list">
  <li><button class="TextButton" aria-label="Star">⭐️</button></li>
  <li><button class="Button Button--menu">Edit</button></li>
  <li><button class="TextButton">Add To…</button></li>
</ul>
</nav>`
export const bottomMenu = (
  render,
  model
) => render`<nav class="Menu Menu--bottom">
<ul class="Menu-list">
  <li><button class="Button Button--menu">Open as…</button></li>
  <li><button class="TextButton TextButton--warning">Delete</button></li>
</ul>
</nav>`
