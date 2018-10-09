export const topMenuInfo = (render, model) => render(
  model,
  ':topMenuInfo'
)`<nav class="Menu Menu--top Menu--right">
<ul class="Menu-list">
  <li><button class="TextButton TextButton--emoji" aria-label="Star">⭐️</button></li>
  <li><button class="TextButton">Edit</button></li>
  <li><button class="TextButton">Add To…</button></li>
</ul>
</nav>`
export const bottomMenuInfo = (render, model) => render(
  model,
  ':bottomMenuInfo'
)`<nav class="Menu Menu--bottom Menu--right">
<ul class="Menu-list">
  <li><button class="TextButton">Open as…</button></li>
  <li><button class="TextButton TextButton--warning">Delete</button></li>
</ul>
</nav>`
