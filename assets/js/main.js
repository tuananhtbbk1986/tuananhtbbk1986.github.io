/* ==========================================================================
   Gia Minh Hoang — Personal Academic Website
   Shared JavaScript: injects the header nav + footer on every page, and
   (on publications.html) parses assets/files/publications_list.txt into cards.

   To update publications, edit assets/files/publications_list.txt only.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Site config (edit here) ---------- */
  var SITE_TITLE = 'Tuan-Anh Le';
  var GITHUB_URL = 'https://github.com/tuananhtbbk1986';
  var PUBLICATIONS_FILE = 'assets/files/publications_list.txt';

  // Name variants to bold in the author list (longest first so shorter
  // variants never split a longer match).
  var SELF_NAMES = [
    'Tuan-Anh Le',
    'Tuan Anh Le'
  
  ];

  // Publication "Image ID" -> actual file in assets/images/publications/.
  // New publications: add their image file and map its ID here (or the site
  // falls back to the placeholder image automatically).
  var PUB_IMAGES = {
    '70154':'70154.jpg',
    '70577': '70577.jpg',
    '101596': '101596.jpg',
    '101859': '101859.jpg',
    '3580780': '3580780.gif',
    'add2a6': 'add2a6.jpg',
    'FZZyXegzeQ': 'FZZyXegzeQ.PNG',
    '1102869': '1102869.webp',
    '00274': '00274.webp'
  };

  var PLACEHOLDER_IMAGE = 'assets/images/publications/placeholder.svg';

  /* ---------- Header nav + footer ---------- */
  var NAV_ITEMS = [
    { href: 'index.html', label: 'About' },
    { href: 'publications.html', label: 'Publications' },
    { href: 'teaching.html', label: 'Teaching' },
    { href: 'cv.html', label: 'CV' }
  ];

  function currentPage() {
    var path = window.location.pathname || '';
    var name = path.substring(path.lastIndexOf('/') + 1);
    if (!name || name === 'index.html') return 'index.html';
    return name;
  }

  function injectHeader() {
    var title = document.querySelector('.site-title');
    if (title) {
      title.setAttribute('href', 'index.html');
      title.textContent = SITE_TITLE;
    }

    var nav = document.querySelector('.site-nav');
    if (!nav) return;

    var active = currentPage();
    NAV_ITEMS.forEach(function (item) {
      var a = document.createElement('a');
      a.setAttribute('href', item.href);
      a.textContent = item.label;
      if (item.href === active) a.className = 'active';
      nav.appendChild(a);
    });
  }

  function injectFooter() {
    var footer = document.querySelector('.site-footer');
    if (!footer) return;

    var p = document.createElement('p');
    p.appendChild(document.createTextNode('© ' + new Date().getFullYear() + ' ' + SITE_TITLE + ' · '));

    var gh = document.createElement('a');
    gh.setAttribute('href', GITHUB_URL);
    gh.setAttribute('target', '_blank');
    gh.setAttribute('rel', 'noopener');
    gh.textContent = 'GitHub';
    p.appendChild(gh);

    p.appendChild(document.createTextNode(' · Built with plain HTML/CSS/JS'));
    footer.appendChild(p);
  }

  /* ---------- Publications parser ---------- */

  function stripTrailingPunctuation(s) {
    return s.replace(/[.,;:]+$/, '');
  }

  function parseCitation(text) {
    var t = text.trim();

    // Pull the URL (always at the end) out first.
    var url = null;
    var urlMatch = t.match(/(https?:\/\/\S+)/);
    if (urlMatch) {
      url = stripTrailingPunctuation(urlMatch[1]);
      t = t.slice(0, urlMatch.index).trim();
    }

    // The title sits between a pair of double quotes. The source mixes
    // straight (") and typographic (”) closing quotes, so accept either.
    var open = t.indexOf('"');
    var close = -1;
    if (open !== -1) {
      var straight = t.indexOf('"', open + 1);
      var curly = t.indexOf('\u201D', open + 1);
      if (straight === -1) close = curly;
      else if (curly === -1) close = straight;
      else close = Math.min(straight, curly);
    }

    var authors, title = null, venue = null;
    if (open !== -1 && close > open) {
      authors = t.slice(0, open).replace(/[.,;:\s]+$/, '').trim();
      title = t.slice(open + 1, close).trim();
      venue = t.slice(close + 1).replace(/^[."\u201D\s,;:]+/, '').trim();
    } else {
      authors = t.trim();
    }

    var yearMatch = t.match(/\b(19|20)\d{2}\b/);
    var year = yearMatch ? yearMatch[0] : null;

    return { authors: authors, title: title, venue: venue, year: year, url: url };
  }

  function parsePublications(raw) {
    var lines = raw.split(/\r?\n/);
    var entries = [];
    var current = null;

    lines.forEach(function (line) {
      var num = line.match(/^\s*(\d+)\.\s*(.*)$/);
      if (num) {
        current = { number: parseInt(num[1], 10), text: num[2], imageId: null };
        entries.push(current);
        return;
      }
      var img = line.match(/^\s*Image ID:\s*(\S+)/);
      if (img && current) {
        current.imageId = img[1];
      }
    });

    return entries;
  }

  function boldSelfNames(container, text) {
    var spans = [];
    SELF_NAMES.forEach(function (name) {
      var lowerText = text.toLowerCase();
      var lowerName = name.toLowerCase();
      var idx = 0;
      var pos;
      while ((pos = lowerText.indexOf(lowerName, idx)) !== -1) {
        spans.push([pos, pos + name.length]);
        idx = pos + name.length;
      }
    });

    if (!spans.length) {
      container.textContent = text;
      return;
    }

    spans.sort(function (a, b) {
      return a[0] - b[0] || b[1] - a[1];
    });

    var merged = [];
    spans.forEach(function (s) {
      var last = merged[merged.length - 1];
      if (!last || s[0] > last[1]) {
        merged.push([s[0], s[1]]);
      } else if (s[1] > last[1]) {
        last[1] = s[1];
      }
    });

    var cursor = 0;
    merged.forEach(function (s) {
      if (s[0] > cursor) {
        container.appendChild(document.createTextNode(text.slice(cursor, s[0])));
      }
      var b = document.createElement('b');
      b.textContent = text.slice(s[0], s[1]);
      container.appendChild(b);
      cursor = s[1];
    });
    if (cursor < text.length) {
      container.appendChild(document.createTextNode(text.slice(cursor)));
    }
  }

  function linkLabel(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch (e) {
      return 'Link';
    }
  }

  function renderPublications(entries, list) {
    list.textContent = '';
    entries.forEach(function (entry) {
      var c = parseCitation(entry.text);
      var card = document.createElement('article');
      card.className = 'card pub-card';

      var imageFile = PUB_IMAGES[entry.imageId]
        ? 'assets/images/publications/' + PUB_IMAGES[entry.imageId]
        : PLACEHOLDER_IMAGE;

      var img = document.createElement('img');
      img.setAttribute('src', imageFile);
      img.setAttribute('loading', 'lazy');
      img.setAttribute('alt', c.title ? 'Thumbnail for ' + c.title : 'Publication thumbnail');
      img.setAttribute('onerror', "this.onerror=null;this.src='" + PLACEHOLDER_IMAGE + "';");

      var thumb = document.createElement('div');
      thumb.className = 'pub-thumb';
      if (c.url) {
        var thumbLink = document.createElement('a');
        thumbLink.setAttribute('href', c.url);
        thumbLink.setAttribute('target', '_blank');
        thumbLink.setAttribute('rel', 'noopener');
        thumbLink.appendChild(img);
        thumb.appendChild(thumbLink);
      } else {
        thumb.appendChild(img);
      }

      var body = document.createElement('div');
      body.className = 'pub-body';

      if (c.title) {
        var titleEl = document.createElement('div');
        titleEl.className = 'pub-title';
        var em = document.createElement('em');
        em.textContent = '"' + c.title + '"';
        titleEl.appendChild(em);
        body.appendChild(titleEl);
      }

      var authorsEl = document.createElement('div');
      authorsEl.className = 'pub-authors';
      boldSelfNames(authorsEl, c.authors);
      body.appendChild(authorsEl);

      if (c.venue) {
        var venueEl = document.createElement('div');
        venueEl.className = 'pub-venue';
        venueEl.textContent = c.venue;
        body.appendChild(venueEl);
      }

      var meta = document.createElement('div');
      meta.className = 'pub-meta';
      if (c.year) {
        var yearEl = document.createElement('span');
        yearEl.className = 'pub-year';
        yearEl.textContent = c.year;
        meta.appendChild(yearEl);
      }
      if (c.url) {
        var link = document.createElement('a');
        link.className = 'pub-link';
        link.setAttribute('href', c.url);
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener');
        link.textContent = 'Paper · ' + linkLabel(c.url);
        meta.appendChild(link);
      }
      if (meta.hasChildNodes()) body.appendChild(meta);

      card.appendChild(thumb);
      card.appendChild(body);
      list.appendChild(card);
    });
  }

  function loadPublications() {
    var list = document.getElementById('publications-list');
    if (!list) return;

    fetch(PUBLICATIONS_FILE)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (text) {
        var entries = parsePublications(text);
        if (!entries.length) throw new Error('no entries parsed');
        renderPublications(entries, list);
      })
      .catch(function (err) {
        var p = document.createElement('p');
        p.id = 'publications-error';
        p.textContent = 'Could not load publications (' + err.message + '). ' +
          'Make sure assets/files/publications_list.txt exists.';
        list.appendChild(p);
      });
  }

  /* ---------- Boot ---------- */
  injectHeader();
  injectFooter();
  loadPublications();
})();
