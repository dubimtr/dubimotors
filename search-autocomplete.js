/* ═══════════════════════════════════════════════════════════════════════════
   DUBIMOTORS — Smart Search Autocomplete
   Dropdown appended to <body> and positioned via getBoundingClientRect so it
   escapes any overflow:hidden parent containers.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {

  /* ── CSS ── */
  const style = document.createElement('style');
  style.textContent = `
    #search-ac-dropdown {
      display: none;
      position: fixed;
      background: #fff;
      border: 1px solid #E8E8E8;
      border-radius: 14px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.16);
      z-index: 99999;
      overflow: hidden;
      max-height: 400px;
      overflow-y: auto;
      min-width: 320px;
    }
    #search-ac-dropdown.open { display: block; }
    .ac-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 18px;
      cursor: pointer;
      border-bottom: 1px solid #F5F5F5;
      transition: background 0.12s;
      gap: 10px;
    }
    .ac-item:last-child { border-bottom: none; }
    .ac-item:hover, .ac-item.active { background: #FFF5F0; }
    .ac-item-left { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
    .ac-item-query { font-size: 14px; font-weight: 500; color: #1A1A1A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ac-item-query strong { color: #E8450A; font-weight: 700; }
    .ac-item-cat { font-size: 11px; color: #999; font-weight: 400; }
    .ac-item-count { font-size: 12px; color: #E8450A; font-weight: 700; white-space: nowrap; flex-shrink: 0; }
    .ac-item-icon { font-size: 16px; flex-shrink: 0; opacity: 0.7; }
    .ac-section-header {
      padding: 7px 18px 4px;
      font-size: 10px;
      font-weight: 700;
      color: #BBBBBB;
      letter-spacing: 0.9px;
      text-transform: uppercase;
      background: #FAFAFA;
      border-bottom: 1px solid #F0F0F0;
    }
    .ac-item-all {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 11px 18px;
      cursor: pointer;
      border-top: 1px solid #EFEFEF;
      background: #FAFAFA;
      transition: background 0.12s;
    }
    .ac-item-all:hover { background: #FFF5F0; }
    .ac-item-all-text { font-size: 13px; color: #E8450A; font-weight: 600; }
  `;
  document.head.appendChild(style);

  /* ── Category config ── */
  const CATS = [
    { key: 'cars',   label: 'Cars',            icon: '🚗', page: 'cars.html',   keys: ['cars'] },
    { key: 'bikes',  label: 'Motorcycles',      icon: '🏍️', page: 'bikes.html',  keys: ['bikes'] },
    { key: 'marine', label: 'Boats & Jet Skis', icon: '⛵', page: 'marine.html', keys: ['boats', 'jetski'] },
    { key: 'heavy',  label: 'Heavy Vehicles',   icon: '🚛', page: 'heavy.html',  keys: ['heavy'] },
  ];

  /* ── Build suggestion list from all listings ── */
  function buildSuggestions(query) {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    const suggestions = [];

    CATS.forEach(cat => {
      const catKeys = cat.keys || [cat.key];
      const listings = (typeof DM !== 'undefined')
        ? catKeys.reduce((acc, k) => acc.concat(DM.getByCategory(k)), [])
        : [];
      if (!listings || !listings.length) return;

      // termListings maps term -> Set of listing IDs (for accurate unique counts)
      const termListings = {};
      listings.forEach(l => {
        const text = [l.title || '', l.make || '', l.model || ''].join(' ').toLowerCase();
        if (!text.includes(q)) return;
        const lid = l.id || l.title;

        const addTerm = (term) => {
          const key = term + '|' + cat.key;
          if (!termListings[key]) termListings[key] = new Set();
          termListings[key].add(lid);
        };

        // Try make+model combo first (most useful suggestion)
        if (l.make && l.model) {
          const makeModel = (l.make + ' ' + l.model).toLowerCase();
          if (makeModel.includes(q)) addTerm(l.make + ' ' + l.model);
        }
        // Also try just make
        if (l.make && l.make.toLowerCase().includes(q)) addTerm(l.make);

        // Extract 1-3 word phrases from title that contain query
        const words = (l.title || '').split(/\s+/);
        for (let len = 1; len <= 3; len++) {
          for (let i = 0; i <= words.length - len; i++) {
            const phrase = words.slice(i, i + len).join(' ').toLowerCase();
            if (phrase.includes(q) && phrase.length > q.length) {
              addTerm(words.slice(i, i + len).join(' '));
            }
          }
        }
      });

      const termCounts = {};
      Object.entries(termListings).forEach(([key, ids]) => { termCounts[key] = ids.size; });

      // Convert to sorted array, deduplicate by normalized term
      const seen = new Set();
      const terms = Object.entries(termCounts)
        .map(([key, count]) => {
          const term = key.split('|')[0];
          return { term, count, cat };
        })
        .filter(s => {
          const norm = s.term.toLowerCase();
          if (seen.has(norm)) return false;
          seen.add(norm);
          return true;
        })
        .sort((a, b) => b.count - a.count || a.term.length - b.term.length)
        .slice(0, 3);

      suggestions.push(...terms);
    });

    return suggestions.slice(0, 10);
  }

  /* ── Highlight matching part in term ── */
  function highlight(term, query) {
    const idx = term.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return escapeHtml(term);
    return escapeHtml(term.slice(0, idx))
      + '<strong>' + escapeHtml(term.slice(idx, idx + query.length)) + '</strong>'
      + escapeHtml(term.slice(idx + query.length));
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ── Position dropdown below the input ── */
  function positionDropdown(input, dd) {
    const rect = input.getBoundingClientRect();
    dd.style.top = (rect.bottom + window.scrollY + 6) + 'px';
    dd.style.left = rect.left + 'px';
    dd.style.width = Math.max(rect.width + 200, 360) + 'px';
    // Clamp to viewport right edge
    const ddRight = rect.left + parseFloat(dd.style.width);
    if (ddRight > window.innerWidth - 8) {
      dd.style.left = Math.max(8, window.innerWidth - parseFloat(dd.style.width) - 8) + 'px';
    }
  }

  /* ── Render dropdown ── */
  function renderDropdown(query, suggestions, input) {
    const dd = document.getElementById('search-ac-dropdown');
    if (!dd) return;
    if (!suggestions.length) { dd.classList.remove('open'); return; }

    dd.innerHTML = '';

    // Group by category
    const byCat = {};
    suggestions.forEach(s => {
      const k = s.cat.key;
      if (!byCat[k]) byCat[k] = { cat: s.cat, items: [] };
      byCat[k].items.push(s);
    });

    Object.values(byCat).forEach(group => {
      const header = document.createElement('div');
      header.className = 'ac-section-header';
      header.textContent = group.cat.label;
      dd.appendChild(header);

      group.items.forEach(s => {
        const item = document.createElement('div');
        item.className = 'ac-item';
        item.innerHTML = `
          <span class="ac-item-icon">${group.cat.icon}</span>
          <div class="ac-item-left">
            <div class="ac-item-query">${highlight(s.term, query)}</div>
            <div class="ac-item-cat">${group.cat.label}</div>
          </div>
          <div class="ac-item-count">${s.count} Ad${s.count !== 1 ? 's' : ''}</div>
        `;
        item.addEventListener('mousedown', (e) => {
          e.preventDefault();
          navigateTo(s.term, group.cat);
        });
        dd.appendChild(item);
      });
    });

    // "Search all results for X" fallback
    const allItem = document.createElement('div');
    allItem.className = 'ac-item-all';
    allItem.innerHTML = `
      <span style="font-size:16px">🔍</span>
      <span class="ac-item-all-text">Search all results for "<strong>${escapeHtml(query)}</strong>"</span>
    `;
    allItem.addEventListener('mousedown', (e) => {
      e.preventDefault();
      navigateAll(query);
    });
    dd.appendChild(allItem);

    positionDropdown(input, dd);
    dd.classList.add('open');
  }

  /* ── Navigate to specific category listing page with query ── */
  function navigateTo(term, cat) {
    const params = new URLSearchParams({ q: term });
    window.location.href = cat.page + '?' + params.toString();
  }

  /* ── Navigate to default page with query for "search all" ── */
  function navigateAll(query) {
    const activeTabEl = document.querySelector('.s-tab.active');
    const tab = activeTabEl ? activeTabEl.textContent.trim().toLowerCase() : 'cars';
    const pages = { cars: 'cars.html', marine: 'marine.html', boats: 'marine.html', bikes: 'bikes.html', motorcycles: 'bikes.html', jetski: 'marine.html', heavy: 'heavy.html' };
    const page = pages[tab] || 'cars.html';
    window.location.href = page + '?q=' + encodeURIComponent(query);
  }

  /* ── Init on DOM ready ── */
  function init() {
    const input = document.getElementById('searchInput');
    if (!input) return;

    // Create dropdown appended to body (escapes all overflow:hidden parents)
    let dd = document.getElementById('search-ac-dropdown');
    if (!dd) {
      dd = document.createElement('div');
      dd.id = 'search-ac-dropdown';
      document.body.appendChild(dd);
    }

    let debounceTimer;

    function updateDropdown() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const q = input.value.trim();
        if (q.length < 2) { dd.classList.remove('open'); return; }
        const suggestions = buildSuggestions(q);
        renderDropdown(q, suggestions, input);
      }, 180);
    }

    input.addEventListener('input', updateDropdown);

    input.addEventListener('focus', () => {
      const q = input.value.trim();
      if (q.length >= 2) {
        const suggestions = buildSuggestions(q);
        renderDropdown(q, suggestions, input);
      }
    });

    input.addEventListener('blur', () => {
      setTimeout(() => dd.classList.remove('open'), 200);
    });

    // Reposition on scroll/resize
    window.addEventListener('scroll', () => {
      if (dd.classList.contains('open')) positionDropdown(input, dd);
    }, { passive: true });
    window.addEventListener('resize', () => {
      if (dd.classList.contains('open')) positionDropdown(input, dd);
    });

    // Keyboard navigation
    input.addEventListener('keydown', (e) => {
      const items = dd.querySelectorAll('.ac-item, .ac-item-all');
      const active = dd.querySelector('.ac-item.active');
      let idx = active ? [...items].indexOf(active) : -1;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (active) active.classList.remove('active');
        idx = (idx + 1) % items.length;
        items[idx].classList.add('active');
        const queryEl = items[idx].querySelector('.ac-item-query');
        if (queryEl) input.value = queryEl.textContent;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (active) active.classList.remove('active');
        idx = (idx - 1 + items.length) % items.length;
        items[idx].classList.add('active');
        const queryEl = items[idx].querySelector('.ac-item-query');
        if (queryEl) input.value = queryEl.textContent;
      } else if (e.key === 'Escape') {
        dd.classList.remove('open');
      } else if (e.key === 'Enter') {
        if (active && active.classList.contains('ac-item')) {
          e.preventDefault();
          active.dispatchEvent(new MouseEvent('mousedown'));
        }
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (e.target !== input && !dd.contains(e.target)) dd.classList.remove('open');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 150);
  }

})();
