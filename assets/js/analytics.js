(function () {
  'use strict';

  var DATA_URL = 'assets/files/analytics-data.json';

  function fmtNumber(n) {
    return Number(n || 0).toLocaleString();
  }

  function fmtDuration(seconds) {
    seconds = Math.round(Number(seconds || 0));
    if (seconds < 60) return seconds + 's';
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    return m + 'm ' + s + 's';
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function renderMetrics(data) {
    var summary = data.summary || {};
    setText('metric-visitors', fmtNumber(summary.visitors));
    setText('metric-pageviews', fmtNumber(summary.pageviews));
    setText('metric-pages-per-visit', Number(summary.pagesPerVisit || 0).toFixed(2));
    setText('metric-duration', fmtDuration(summary.avgDurationSeconds));
    setText('metric-visitors-note', summary.visitorsNote || 'Recorded visitors');
    setText('metric-pageviews-note', summary.pageviewsNote || 'Recorded page views');
  }

  function renderCountries(countries) {
    var body = document.getElementById('country-table-body');
    if (!body) return;
    body.textContent = '';

    if (!countries || !countries.length) {
      var tr = document.createElement('tr');
      var td = document.createElement('td');
      td.colSpan = 3;
      td.className = 'analytics-empty-cell';
      td.textContent = 'No country data yet';
      tr.appendChild(td);
      body.appendChild(tr);
      return;
    }

    countries.slice(0, 10).forEach(function (item, i) {
      var tr = document.createElement('tr');
      [String(i + 1), item.name || item.code || 'Unknown', fmtNumber(item.visitors)].forEach(function (text) {
        var td = document.createElement('td');
        td.textContent = text;
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
  }

  function renderPopularPages(pages) {
    var body = document.getElementById('popular-pages-body');
    if (!body) return;
    body.textContent = '';

    if (!pages || !pages.length) {
      var tr = document.createElement('tr');
      var td = document.createElement('td');
      td.colSpan = 2;
      td.className = 'analytics-empty-cell';
      td.textContent = 'No page data yet';
      tr.appendChild(td);
      body.appendChild(tr);
      return;
    }

    pages.slice(0, 10).forEach(function (item) {
      var tr = document.createElement('tr');
      var page = document.createElement('td');
      page.textContent = item.page || '/';
      var views = document.createElement('td');
      views.textContent = fmtNumber(item.views);
      tr.appendChild(page);
      tr.appendChild(views);
      body.appendChild(tr);
    });
  }

  function drawCharts(data) {
    if (!window.google || !google.visualization) return;

    var countries = data.countries || [];
    var geoEl = document.getElementById('geo-chart');
    if (geoEl && countries.length) {
      var geoRows = [['Country', 'Visitors']];
      countries.forEach(function (item) {
        geoRows.push([item.code || item.name, Number(item.visitors || 0)]);
      });
      var geoData = google.visualization.arrayToDataTable(geoRows);
      var geo = new google.visualization.GeoChart(geoEl);
      geo.draw(geoData, {
        backgroundColor: 'transparent',
        colorAxis: { colors: ['#d9e8fb', '#2566c5'] },
        datalessRegionColor: '#edf1f5',
        defaultColor: '#edf1f5',
        legend: 'none',
        tooltip: { textStyle: { fontSize: 13 } }
      });
    }

    var traffic = data.traffic || [];
    var trafficEl = document.getElementById('traffic-chart');
    if (trafficEl && traffic.length) {
      var trafficRows = [['Date', 'Visitors']];
      traffic.forEach(function (item) {
        trafficRows.push([item.date, Number(item.visitors || 0)]);
      });
      var trafficData = google.visualization.arrayToDataTable(trafficRows);
      var chart = new google.visualization.AreaChart(trafficEl);
      chart.draw(trafficData, {
        backgroundColor: 'transparent',
        legend: 'none',
        colors: ['#2566c5'],
        areaOpacity: 0.12,
        lineWidth: 2,
        chartArea: { left: 48, top: 20, width: '88%', height: '70%' },
        hAxis: { textStyle: { color: '#5b6472', fontSize: 11 }, gridlines: { color: 'transparent' } },
        vAxis: { minValue: 0, textStyle: { color: '#5b6472', fontSize: 11 }, gridlines: { color: '#e8edf3' } }
      });
    }
  }

  function showDisconnected() {
    setText('analytics-updated', 'Analytics not connected yet');
  }

  fetch(DATA_URL + '?v=' + Date.now())
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      if (!data || data.connected !== true) {
        showDisconnected();
        return;
      }

      setText('analytics-updated', data.updatedAt ? 'Last updated: ' + data.updatedAt : 'Analytics connected');
      renderMetrics(data);
      renderCountries(data.countries || []);
      renderPopularPages(data.popularPages || []);

      google.charts.load('current', { packages: ['geochart', 'corechart'] });
      google.charts.setOnLoadCallback(function () {
        drawCharts(data);
      });
    })
    .catch(function () {
      showDisconnected();
    });
})();
