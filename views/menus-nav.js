export const topMenuNav = (render, model) => render(
  model,
  ':topMenuNav'
)`<nav class="Menu Menu--top  Menu--left">
<ul class="Menu-list">
  <li></li>
  <li><button class="TextButton">Settings</button></li>
</ul>
</nav>`
export const bottomMenuNav = (render, model) => render(
  model,
  ':bottomMenuNav'
)`<nav class="Menu Menu--bottom Menu--left">
<ul class="Menu-list">
  <li><button class="TextButton">Add…</button></li>
  <li><button class="TextButton">Edit…</button></li>
</ul>
</nav>`
