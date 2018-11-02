export const returnMenu = (render, model, req) => {
  let returnURL
  if (req && req.query && req.query.returnToPage) {
    returnURL = `/library/${req.query.returnToPage}`
  } else {
    returnURL = '/library'
  }
  return render(model, ':returnMenu')`<nav class="Menu Menu--return">
<ul class="Menu-list">
  <li id="button-show-navigation-menu"><button class="TextButton" is="nav-menu-toggle" id="nav-menu-toggle" data-menu-id='NavSidebar'>Menu</button></li>
  <li id="button-return-library"><a href="${returnURL}" class="TextButton" aria-label="Return to Library">&lt; Return</a></li>
</ul>
</nav>`
}
