/* ========================================================================== 
   Tuan-Anh Le — Personal Academic Website
   Shared JavaScript: navigation, footer, and publication cards.
   ========================================================================== */
(function () {
  'use strict';

  var SITE_TITLE = 'Tuan-Anh Le';
  var GITHUB_URL = 'https://github.com/tuananhtbbk1986';
  var JOURNAL_FILE = 'assets/files/publications_list.txt';
  var CONFERENCE_FILE = 'assets/files/conference_publications_list.txt';
  var SELF_NAMES = ['Tuan-Anh Le', 'Tuan Anh Le', 'Le T.-A.', 'T.-A. Le'];
  var PLACEHOLDER_IMAGE = 'assets/images/publications/placeholder.svg';

  var NAV_ITEMS = [
    { href: 'index.html', label: 'About' },
    { href: 'publications.html', label: 'Publications' },
    { href: 'teaching.html', label: 'Teaching' },
    { href: 'cv.html', label: 'CV' },
    { href: 'analytics.html', label: 'Analytics' }
  ];

  function currentPage() {
    var path = window.location.pathname || '';
    var name = path.substring(path.lastIndexOf('/') + 1);
    return (!name || name === 'index.html') ? 'index.html' : name;
  }

  function injectHeader() {
    var title = document.querySelector('.site-title');
    if (title) {
      title.href = 'index.html';
      title.textContent = SITE_TITLE;
    }

    var nav = document.querySelector('.site-nav');
    if (!nav) return;
    nav.textContent = '';

    var active = currentPage();
    NAV_ITEMS.forEach(function (item) {
      var a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      if (item.href === active) a.className = 'active';
      nav.appendChild(a);
    });
  }

  function injectFooter() {
    var footer = document.querySelector('.site-footer');
    if (!footer) return;
    footer.textContent = '';

    var p = document.createElement('p');
    p.appendChild(document.createTextNode('© ' + new Date().getFullYear() + ' ' + SITE_TITLE + ' · '));

    var gh = document.createElement('a');
    gh.href = GITHUB_URL;
    gh.target = '_blank';
    gh.rel = 'noopener';
    gh.textContent = 'GitHub';
    p.appendChild(gh);

    p.appendChild(document.createTextNode(' · Built with plain HTML/CSS/JS'));
    footer.appendChild(p);
  }

  function stripTrailingPunctuation(s) {
    return s.replace(/[.,;:]+$/, '');
  }

  function parseCitation(text) {
    var t = text.trim();
    var url = null;
    var urlMatch = t.match(/(https?:\/\/\S+)/);

    if (urlMatch) {
      url = stripTrailingPunctuation(urlMatch[1]);
      t = t.slice(0, urlMatch.index).trim();
    }

    var open = t.indexOf('"');
    var close = open !== -1 ? t.indexOf('"', open + 1) : -1;
    var authors;
    var title = null;
    var venue = null;

    if (open !== -1 && close > open) {
      authors = t.slice(0, open).replace(/[.,;:\s]+$/, '').trim();
      title = t.slice(open + 1, close).trim();
      venue = t.slice(close + 1).replace(/^[."\s,;:]+/, '').trim();
    } else {
      authors = t.trim();
    }

    var yearMatch = t.match(/\b(19|20)\d{2}\b/);
    return {
      authors: authors,
      title: title,
      venue: venue,
      year: yearMatch ? yearMatch[0] : null,
      url: url
    };
  }

  function parsePublications(raw) {
    var lines = raw.split(/\r?\n/);
    var entries = [];
    var current = null;

    lines.forEach(function (line) {
      var num = line.match(/^\s*(\d+)\.\s*(.*)$/);
      if (num) {
        current = {
          number: parseInt(num[1], 10),
          text: num[2],
          legacyImageId: null
        };
        entries.push(current);
        return;
      }

      var img = line.match(/^\s*Image ID:\s*(\S+)/);
      if (img && current) current.legacyImageId = img[1];
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

    spans.sort(function (a, b) { return a[0] - b[0] || b[1] - a[1]; });
    var merged = [];
    spans.forEach(function (s) {
      var last = merged[merged.length - 1];
      if (!last || s[0] > last[1]) merged.push([s[0], s[1]]);
      else if (s[1] > last[1]) last[1] = s[1];
    });

    var cursor = 0;
    merged.forEach(function (s) {
      if (s[0] > cursor) container.appendChild(document.createTextNode(text.slice(cursor, s[0])));
      var b = document.createElement('b');
      b.textContent = text.slice(s[0], s[1]);
      container.appendChild(b);
      cursor = s[1];
    });

    if (cursor < text.length) container.appendChild(document.createTextNode(text.slice(cursor)));
  }

  function linkLabel(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch (e) {
      return 'Link';
    }
  }

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function renderPublications(entries, list, imagePrefix) {
    list.textContent = '';

    entries.forEach(function (entry) {
      var c = parseCitation(entry.text);
      var card = document.createElement('article');
      card.className = 'card pub-card';

      var preferredImage = 'assets/images/publications/' + imagePrefix + '-' + pad2(entry.number) + '.jpg';
      var legacyImage = entry.legacyImageId
        ? 'assets/images/publications/' + entry.legacyImageId + '.jpg'
        : null;

      var img = document.createElement('img');
      img.src = preferredImage;
      img.loading = 'lazy';
      img.alt = c.title ? 'Thumbnail for ' + c.title : 'Publication thumbnail';
      img.dataset.fallbackStage = '0';
      img.onerror = function () {
        if (this.dataset.fallbackStage === '0' && legacyImage) {
          this.dataset.fallbackStage = '1';
          this.src = legacyImage;
          return;
        }
        this.onerror = null;
        this.src = PLACEHOLDER_IMAGE;
      };

      var thumb = document.createElement('div');
      thumb.className = 'pub-thumb';

      if (c.url) {
        var thumbLink = document.createElement('a');
        thumbLink.href = c.url;
        thumbLink.target = '_blank';
        thumbLink.rel = 'noopener';
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
        link.href = c.url;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = 'Paper · ' + linkLabel(c.url);
        meta.appendChild(link);
      }

      if (meta.hasChildNodes()) body.appendChild(meta);
      card.appendChild(thumb);
      card.appendChild(body);
      list.appendChild(card);
    });
  }

  function loadPublicationList(containerId, file, imagePrefix) {
    var list = document.getElementById(containerId);
    if (!list) return;

    fetch(file)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (text) {
        var entries = parsePublications(text);
        if (!entries.length) throw new Error('no entries parsed');
        renderPublications(entries, list, imagePrefix);
      })
      .catch(function (err) {
        list.textContent = '';
        var p = document.createElement('p');
        p.className = 'publications-error';
        p.textContent = 'Could not load publications (' + err.message + ').';
        list.appendChild(p);
      });
  }

  injectHeader();
  injectFooter();
  loadPublicationList('journal-publications-list', JOURNAL_FILE, 'journal');
  loadPublicationList('conference-publications-list', CONFERENCE_FILE, 'conference');
})();
