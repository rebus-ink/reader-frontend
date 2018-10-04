export const topMenu = (render, model) => render`<nav class="Menu Menu--top">
<ul class="Menu-list">
  <li><button class="TextButton TextButton--information" aria-label="Help">?</button></li>
  <li><button class="TextButton">Settings</button></li>
</ul>
</nav>`
export const bottomMenu = (
  render,
  model
) => render`<nav class="Menu Menu--bottom">
<ul class="Menu-list">
  <li><button class="TextButton">Add…</button></li>
  <li><button class="TextButton">Edit…</button></li>
</ul>
</nav>`
