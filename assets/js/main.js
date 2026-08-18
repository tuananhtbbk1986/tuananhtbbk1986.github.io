/* ==========================================================================
   Personal Academic Website — small progressive-enhancement script
   --------------------------------------------------------------------------
   1. Fills in the current year in the footer.
   2. Highlights the navigation link for the current page.
   The site remains fully usable if JavaScript is disabled; the active tab is
   also set in the HTML via aria-current="page".
   ========================================================================== */
(function () {
  'use strict';

  // Footer year
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Active navigation highlight
  var currentPath = window.location.pathname.split('/').pop() || 'index.html';
  var links = document.querySelectorAll('.site-nav a');

  for (var i = 0; i < links.length; i++) {
    var href = links[i].getAttribute('href') || '';
    var linkPath = href.split('/').pop() || 'index.html';

    if (linkPath === currentPath) {
      links[i].classList.add('active');
      if (!links[i].hasAttribute('aria-current')) {
        links[i].setAttribute('aria-current', 'page');
      }
    }
  }
})();
