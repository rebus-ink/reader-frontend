module.exports.topMenuMain = (render, model) =>
  render(
    model,
    ':topMenuMain'
  )`<button class="NavButton" is="nav-menu-toggle" id="nav-menu-toggle" data-menu-id='NavSidebar' aria-label="Table of Contents" aria-expanded="true"><svg fill="none" stroke="currentColor" stroke-width="2" width="24" height="24" viewBox="0 0 24 24"><rect width="18" height="18" x="4" y="4"></rect><line y1="4" x2="9" x1="9" y2="22"></line></svg></button>`
