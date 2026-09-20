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

  var JOURNAL_IMAGES = {
    1:'Sensors_2026_26175420.jpg',
    2:'ARR_2026_70154.jpg',
    3:'MethodsX_2026_103906.jpg',
    4:'iScience_2026_115007.jpg',
    5:'AFM_2026_31400.jpg',
    6:'IEEE_TIM_2025_3568946.jpg',
    7:'SciRep_2025_89296.jpg',
    8:'IEEE_RAL_2024_3474471.jpg',
    9:'FRAI_2024_1495445.jpg',
    10:'IEEE_TMI_2024_3419427.jpg',
    11:'CBM_2024_107864.jpg',
    12:'ASI_2023_0103.jpg',
    13:'AIS_2023_2300128.jpg',
    14:'CMPB_2023_107546.jpg',
    15:'NanoSelect_2023_202200219.jpg',
    16:'Measurement_2023_112391.jpg',
    17:'IEEE_TIE_2023_3169715.jpg',
    18:'JMMM_2022_170110.jpg',
    19:'IEEE_RAL_2022_3148789.jpg',
    20:'IEEE_TIE_2021_3039219.jpg',
    21:'Nanomaterials_2021_2754.jpg',
    22:'IJMS_2021_8895.jpg',
    23:'Nanomaterials_2021_1096.jpg',
    24:'IEEE_TBME_2021_3018266.jpg',
    25:'IEEE_TMECH_2021_3041729.jpg',
    26:'IEEE_Access_2020_3000329.jpg',
    27:'JMBR_2020_00127.jpg',
    28:'IEEE_LMAG_2020_2968407.jpg',
    29:'IJMS_2019_2873.jpg',
    30:'IEEE_TMECH_2018_2843820.jpg',
    31:'IEEE_TMAG_2018_2830774.jpg',
    32:'Nanomaterials_2018_0003.jpg',
    33:'Micromachines_2018_0014.jpg',
    34:'Sensors_2017_2050.jpg',
    35:'AIPAdv_2017_4977018.jpg',
    36:'JMMM_2017_10-056.jpg',
    37:'JMMM_2017_11-016.jpg',
    38:'JNN_2016_12520.jpg'
  };

  var CONFERENCE_IMAGES = {
    1:'IJMPI_2023_2303032.jpg',
    2:'ICROS_2021_117-118.jpg',
    3:'IJMPI_2020_2009067.jpg',
    4:'IROS_2017_8206007.jpg',
    5:'IROS_2016_7759776.jpg',
    6:'URAI_2016_7734089.jpg',
    7:'IWMPI_2015_7107010.jpg'
  };

  var LEGACY_IMAGE_FILES = {
    'sensors-2026':'sensors-2026.jpg','70154':'70154.jpg','mex-103906':'mex-103906.jpg','isci-115007':'isci-115007.jpg','adfm-202531400':'adfm-202531400.jpg','tim-3568946':'tim-3568946.jpg','srep-89296':'srep-89296.jpg','lra-3474471':'lra-3474471.jpg','frobt-1495445':'frobt-1495445.jpg','tmi-3419427':'tmi-3419427.jpg','cbm-107864':'cbm-107864.jpg','asi-103':'asi-103.jpg','aisy-2300128':'aisy-2300128.jpg','cmpb-107546':'cmpb-107546.jpg','nano-202200219':'nano-202200219.jpg','measurement-112391':'measurement-112391.jpg','tie-3169715':'tie-3169715.jpg','jmmm-170110':'jmmm-170110.jpg','lra-3148789':'lra-3148789.jpg','tie-3039219':'tie-3039219.jpg','nano-2754':'nano-2754.jpg','ijms-8895':'ijms-8895.jpg','nano-1096':'nano-1096.jpg','tbme-3018266':'tbme-3018266.jpg','tmech-3041729':'tmech-3041729.jpg','access-3000329':'access-3000329.jpg','jmbr-00127':'jmbr-00127.jpg','lmag-2968407':'lmag-2968407.jpg','ijms-2873':'ijms-2873.jpg','tmech-2843820':'tmech-2843820.jpg','tmag-2830774':'tmag-2830774.jpg','nano-0003':'nano-0003.jpg','mi-0014':'mi-0014.jpg','sensors-2050':'sensors-2050.jpg','aip-4977018':'aip-4977018.jpg','jmmm-2016-10-056':'jmmm-2016-10-056.jpg','jmmm-2016-11-016':'jmmm-2016-11-016.jpg','jnn-12520':'jnn-12520.jpg'
  };

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
    if (title) { title.href = 'index.html'; title.textContent = SITE_TITLE; }
    var nav = document.querySelector('.site-nav');
    if (!nav) return;
    nav.textContent = '';
    var active = currentPage();
    NAV_ITEMS.forEach(function (item) {
      var a = document.createElement('a');
      a.href = item.href; a.textContent = item.label;
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
    gh.href = GITHUB_URL; gh.target = '_blank'; gh.rel = 'noopener'; gh.textContent = 'GitHub';
    p.appendChild(gh);
    p.appendChild(document.createTextNode(' · Built with plain HTML/CSS/JS'));
    footer.appendChild(p);
  }

  function stripTrailingPunctuation(s) { return s.replace(/[.,;:]+$/, ''); }

  function parseCitation(text) {
    var t = text.trim();
    var url = null;
    var urlMatch = t.match(/(https?:\/\/\S+)/);
    if (urlMatch) { url = stripTrailingPunctuation(urlMatch[1]); t = t.slice(0, urlMatch.index).trim(); }
    var open = t.indexOf('"');
    var close = open !== -1 ? t.indexOf('"', open + 1) : -1;
    var authors, title = null, venue = null;
    if (open !== -1 && close > open) {
      authors = t.slice(0, open).replace(/[.,;:\s]+$/, '').trim();
      title = t.slice(open + 1, close).trim();
      venue = t.slice(close + 1).replace(/^[."\s,;:]+/, '').trim();
    } else authors = t.trim();
    var yearMatch = t.match(/\b(19|20)\d{2}\b/);
    return { authors:authors, title:title, venue:venue, year:yearMatch ? yearMatch[0] : null, url:url };
  }

  function parsePublications(raw) {
    var lines = raw.split(/\r?\n/), entries = [], current = null;
    lines.forEach(function (line) {
      var num = line.match(/^\s*(\d+)\.\s*(.*)$/);
      if (num) {
        current = { number:parseInt(num[1],10), text:num[2], legacyImageId:null };
        entries.push(current); return;
      }
      var img = line.match(/^\s*Image ID:\s*(\S+)/);
      if (img && current) current.legacyImageId = img[1];
    });
    return entries;
  }

  function boldSelfNames(container, text) {
    var spans = [];
    SELF_NAMES.forEach(function (name) {
      var lowerText=text.toLowerCase(), lowerName=name.toLowerCase(), idx=0, pos;
      while ((pos=lowerText.indexOf(lowerName,idx))!==-1) { spans.push([pos,pos+name.length]); idx=pos+name.length; }
    });
    if (!spans.length) { container.textContent=text; return; }
    spans.sort(function(a,b){ return a[0]-b[0] || b[1]-a[1]; });
    var merged=[];
    spans.forEach(function(s){ var last=merged[merged.length-1]; if(!last||s[0]>last[1]) merged.push([s[0],s[1]]); else if(s[1]>last[1]) last[1]=s[1]; });
    var cursor=0;
    merged.forEach(function(s){ if(s[0]>cursor) container.appendChild(document.createTextNode(text.slice(cursor,s[0]))); var b=document.createElement('b'); b.textContent=text.slice(s[0],s[1]); container.appendChild(b); cursor=s[1]; });
    if(cursor<text.length) container.appendChild(document.createTextNode(text.slice(cursor)));
  }

  function linkLabel(url) { try { return new URL(url).hostname.replace(/^www\./,''); } catch(e) { return 'Link'; } }

  function renderPublications(entries, list, imageMap) {
    list.textContent='';
    entries.forEach(function(entry){
      var c=parseCitation(entry.text);
      var card=document.createElement('article'); card.className='card pub-card';
      var preferred=imageMap[entry.number] ? 'assets/images/publications/'+imageMap[entry.number] : null;
      var legacy=(entry.legacyImageId && LEGACY_IMAGE_FILES[entry.legacyImageId]) ? 'assets/images/publications/'+LEGACY_IMAGE_FILES[entry.legacyImageId] : null;
      var img=document.createElement('img');
      img.src=preferred || legacy || PLACEHOLDER_IMAGE; img.loading='lazy'; img.alt=c.title ? 'Thumbnail for '+c.title : 'Publication thumbnail'; img.dataset.fallbackStage='0';
      img.onerror=function(){
        if(this.dataset.fallbackStage==='0' && legacy && this.src.indexOf(legacy)===-1){ this.dataset.fallbackStage='1'; this.src=legacy; return; }
        this.onerror=null; this.src=PLACEHOLDER_IMAGE;
      };
      var thumb=document.createElement('div'); thumb.className='pub-thumb';
      if(c.url){ var thumbLink=document.createElement('a'); thumbLink.href=c.url; thumbLink.target='_blank'; thumbLink.rel='noopener'; thumbLink.appendChild(img); thumb.appendChild(thumbLink); } else thumb.appendChild(img);
      var body=document.createElement('div'); body.className='pub-body';
      if(c.title){ var titleEl=document.createElement('div'); titleEl.className='pub-title'; var em=document.createElement('em'); em.textContent='"'+c.title+'"'; titleEl.appendChild(em); body.appendChild(titleEl); }
      var authorsEl=document.createElement('div'); authorsEl.className='pub-authors'; boldSelfNames(authorsEl,c.authors); body.appendChild(authorsEl);
      if(c.venue){ var venueEl=document.createElement('div'); venueEl.className='pub-venue'; venueEl.textContent=c.venue; body.appendChild(venueEl); }
      var meta=document.createElement('div'); meta.className='pub-meta';
      if(c.year){ var yearEl=document.createElement('span'); yearEl.className='pub-year'; yearEl.textContent=c.year; meta.appendChild(yearEl); }
      if(c.url){ var link=document.createElement('a'); link.className='pub-link'; link.href=c.url; link.target='_blank'; link.rel='noopener'; link.textContent='Paper · '+linkLabel(c.url); meta.appendChild(link); }
      if(meta.hasChildNodes()) body.appendChild(meta);
      card.appendChild(thumb); card.appendChild(body); list.appendChild(card);
    });
  }

  function loadPublicationList(containerId,file,imageMap){
    var list=document.getElementById(containerId); if(!list) return;
    fetch(file).then(function(res){ if(!res.ok) throw new Error('HTTP '+res.status); return res.text(); })
      .then(function(text){ var entries=parsePublications(text); if(!entries.length) throw new Error('no entries parsed'); renderPublications(entries,list,imageMap); })
      .catch(function(err){ list.textContent=''; var p=document.createElement('p'); p.className='publications-error'; p.textContent='Could not load publications ('+err.message+').'; list.appendChild(p); });
  }

  function initFloatingDragon() {
    if (document.getElementById('floating-dragon')) return;

    var style = document.createElement('style');
    style.textContent =
      '#vietnam-lotus{position:fixed;right:8px;bottom:8px;width:clamp(120px,12vw,190px);z-index:6;pointer-events:none;user-select:none;opacity:.92;filter:drop-shadow(0 7px 14px rgba(16,24,40,.10));}' +
      '#vietnam-lotus img{display:block;width:100%;height:auto;border-radius:18px;mix-blend-mode:multiply;}' +
      '#floating-dragon{position:fixed;left:calc(100vw - 160px);top:110px;width:clamp(95px,9vw,145px);z-index:7;pointer-events:none;user-select:none;opacity:.90;will-change:left,top;transition-property:left,top;transition-timing-function:cubic-bezier(.42,.02,.35,1);filter:drop-shadow(0 7px 14px rgba(16,24,40,.10));}' +
      '#floating-dragon img{display:block;width:100%;height:auto;border-radius:16px;mix-blend-mode:multiply;animation:dragonBob 5.8s ease-in-out infinite;}' +
      '@keyframes dragonBob{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-9px) rotate(1deg)}}' +
      '@media(max-width:900px){#vietnam-lotus{width:105px;opacity:.82}#floating-dragon{width:82px;opacity:.80}}' +
      '@media(max-width:640px){#vietnam-lotus{width:82px;right:4px;bottom:4px;opacity:.72}#floating-dragon{display:none!important;}}' +
      '@media(prefers-reduced-motion:reduce){#floating-dragon img{animation:none!important;}}';
    document.head.appendChild(style);

    var lotus = document.createElement('div');
    lotus.id = 'vietnam-lotus';
    lotus.setAttribute('aria-hidden', 'true');
    var lotusImg = document.createElement('img');
    lotusImg.src = 'assets/images/Sen.jpg?v=20260920-1';
    lotusImg.alt = '';
    lotus.appendChild(lotusImg);
    document.body.appendChild(lotus);

    var dragon = document.createElement('div');
    dragon.id = 'floating-dragon';
    dragon.setAttribute('aria-hidden', 'true');
    var image = document.createElement('img');
    image.src = 'assets/images/dragon.jpg?v=20260920-1';
    image.alt = '';
    dragon.appendChild(image);
    document.body.appendChild(dragon);

    var timer = null;
    var lastX = window.innerWidth - 160;

    function overlaps(a, b, pad) {
      return !(a.right + pad < b.left || a.left - pad > b.right || a.bottom + pad < b.top || a.top - pad > b.bottom);
    }

    function blockedRects() {
      var selectors = [
        '.site-header','main h1','main h2','main h3','main p','main li',
        '.hero-photo','.icons','.card','.news-card','.timeline-content',
        '.pub-card','.cv-frame','.cv-actions','.analytics-embed-card',
        '.analytics-page-head','.analytics-actions','#vietnam-lotus'
      ].join(',');
      return Array.prototype.slice.call(document.querySelectorAll(selectors))
        .filter(function(el){ return el.offsetParent !== null; })
        .map(function(el){ return el.getBoundingClientRect(); });
    }

    function findOpenPosition(dw, dh, minY, maxX, maxY) {
      var blocks = blockedRects();
      var margin = 16;
      var pad = 16;
      var fallback = {x:Math.max(margin,maxX), y:minY};

      for (var i=0;i<60;i++) {
        var x, edge=Math.random();
        if(edge<0.42) x=margin + Math.random()*Math.max(1,Math.min(150,maxX-margin));
        else if(edge<0.84) x=Math.max(margin,maxX-Math.random()*Math.max(1,Math.min(150,maxX-margin)));
        else x=margin+Math.random()*Math.max(1,maxX-margin);

        var y=minY+Math.random()*Math.max(1,maxY-minY);
        var c={left:x,top:y,right:x+dw,bottom:y+dh};
        if(!blocks.some(function(b){return overlaps(c,b,pad);})){
          return {x:x,y:y};
        }
      }
      return fallback;
    }

    function moveDragon(){
      if(window.innerWidth<=640) return;

      var rect=dragon.getBoundingClientRect();
      var dw=rect.width||120;
      var dh=rect.height||120;
      var margin=16;
      var header=document.querySelector('.site-header');
      var minY=Math.max(82,header?header.getBoundingClientRect().bottom+12:82);
      var maxX=Math.max(margin,window.innerWidth-dw-margin);
      var maxY=Math.max(minY,window.innerHeight-dh-margin);
      var pos=findOpenPosition(dw,dh,minY,maxX,maxY);
      var duration=13+Math.random()*8;

      dragon.style.transitionDuration=duration+'s';
      dragon.style.left=Math.round(pos.x)+'px';
      dragon.style.top=Math.round(pos.y)+'px';

      image.style.transform=pos.x<lastX?'scaleX(-1)':'scaleX(1)';
      lastX=pos.x;

      clearTimeout(timer);
      timer=setTimeout(moveDragon,duration*1000+900);
    }

    image.addEventListener('load',function(){setTimeout(moveDragon,500);});
    image.addEventListener('error',function(){dragon.style.display='none';});
    lotusImg.addEventListener('error',function(){lotus.style.display='none';});

    window.addEventListener('resize',function(){
      clearTimeout(timer);
      moveDragon();
    });
  }

  injectHeader();
  injectFooter();
  loadPublicationList('journal-publications-list',JOURNAL_FILE,JOURNAL_IMAGES);
  loadPublicationList('conference-publications-list',CONFERENCE_FILE,CONFERENCE_IMAGES);
  initFloatingDragon();
})();
