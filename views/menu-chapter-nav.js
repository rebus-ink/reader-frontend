export const menuChapterNav = (render, model) => render(
  model,
  ':menuChapterNav'
)`<nav class="Menu Menu--top Menu--right">
<ul class="Menu-list">
<li><a class="TextButton" id="nav-menu-left" aria-label="Previous chapter" href="">←</a></li>
  <li><a class="TextButton" id="nav-menu-right" aria-label="Next chapter" href="">→</a></li>
</ul>
</nav>`
