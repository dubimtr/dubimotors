// ── DubiMotors Lightbox / Photo Carousel with Zoom ────────────────────────────
(function() {
  'use strict';

  let lbImages = [];
  let lbIndex = 0;
  let lbZoomed = false;
  let lbZoomScale = 2.5;

  // Build the lightbox DOM once
  function buildLightbox() {
    if (document.getElementById('dm-lightbox')) return;
    const lb = document.createElement('div');
    lb.id = 'dm-lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = `
      <button id="dm-lightbox-close" aria-label="Close" title="Close (Esc)">&#10005;</button>
      <div id="dm-lightbox-counter"></div>
      <div id="dm-lightbox-img-wrap">
        <button id="dm-lightbox-prev" aria-label="Previous">&#8249;</button>
        <img id="dm-lightbox-img" src="" alt="" draggable="false" />
        <button id="dm-lightbox-next" aria-label="Next">&#8250;</button>
      </div>
      <div id="dm-lightbox-thumbs"></div>
    `;
    document.body.appendChild(lb);

    // Close button
    document.getElementById('dm-lightbox-close').addEventListener('click', closeLightbox);

    // Prev / Next
    document.getElementById('dm-lightbox-prev').addEventListener('click', function(e) {
      e.stopPropagation();
      lbGo(lbIndex - 1);
    });
    document.getElementById('dm-lightbox-next').addEventListener('click', function(e) {
      e.stopPropagation();
      lbGo(lbIndex + 1);
    });

    // Click image wrap to zoom/unzoom
    const wrap = document.getElementById('dm-lightbox-img-wrap');
    wrap.addEventListener('click', function(e) {
      if (e.target.id === 'dm-lightbox-prev' || e.target.id === 'dm-lightbox-next') return;
      toggleZoom(e);
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      const lb = document.getElementById('dm-lightbox');
      if (!lb || !lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lbGo(lbIndex - 1);
      if (e.key === 'ArrowRight') lbGo(lbIndex + 1);
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchStartY = 0;
    wrap.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    wrap.addEventListener('touchend', function(e) {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx < 0) lbGo(lbIndex + 1);
        else lbGo(lbIndex - 1);
      }
    }, { passive: true });

    // Click outside image (on dark overlay) to close
    lb.addEventListener('click', function(e) {
      if (e.target === lb) closeLightbox();
    });
  }

  function toggleZoom(e) {
    const img = document.getElementById('dm-lightbox-img');
    const wrap = document.getElementById('dm-lightbox-img-wrap');
    if (lbZoomed) {
      // Unzoom
      img.style.transform = 'scale(1)';
      img.style.transformOrigin = 'center center';
      wrap.classList.remove('zoomed');
      lbZoomed = false;
    } else {
      // Zoom toward click point
      const rect = wrap.getBoundingClientRect();
      const xPct = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      const yPct = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
      img.style.transformOrigin = xPct + '% ' + yPct + '%';
      img.style.transform = 'scale(' + lbZoomScale + ')';
      wrap.classList.add('zoomed');
      lbZoomed = true;
    }
  }

  function resetZoom() {
    const img = document.getElementById('dm-lightbox-img');
    const wrap = document.getElementById('dm-lightbox-img-wrap');
    if (img) { img.style.transform = 'scale(1)'; img.style.transformOrigin = 'center center'; }
    if (wrap) wrap.classList.remove('zoomed');
    lbZoomed = false;
  }

  function lbGo(idx) {
    if (lbImages.length === 0) return;
    lbIndex = ((idx % lbImages.length) + lbImages.length) % lbImages.length;
    resetZoom();
    const img = document.getElementById('dm-lightbox-img');
    const counter = document.getElementById('dm-lightbox-counter');
    const thumbs = document.getElementById('dm-lightbox-thumbs');
    if (img) { img.src = lbImages[lbIndex]; img.alt = 'Photo ' + (lbIndex + 1); }
    if (counter) counter.textContent = (lbIndex + 1) + ' / ' + lbImages.length;
    // Update thumb highlights
    if (thumbs) {
      Array.from(thumbs.children).forEach(function(t, i) {
        t.classList.toggle('active', i === lbIndex);
      });
      // Scroll active thumb into view
      const activeThumb = thumbs.children[lbIndex];
      if (activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    // Show/hide prev/next
    const prev = document.getElementById('dm-lightbox-prev');
    const next = document.getElementById('dm-lightbox-next');
    if (prev) prev.style.display = lbImages.length > 1 ? 'flex' : 'none';
    if (next) next.style.display = lbImages.length > 1 ? 'flex' : 'none';
  }

  function openLightbox(images, startIndex) {
    buildLightbox();
    lbImages = images || [];
    lbIndex = startIndex || 0;
    // Build thumbnails
    const thumbs = document.getElementById('dm-lightbox-thumbs');
    if (thumbs) {
      thumbs.innerHTML = '';
      if (lbImages.length > 1) {
        lbImages.forEach(function(src, i) {
          const t = document.createElement('img');
          t.className = 'dm-lb-thumb' + (i === lbIndex ? ' active' : '');
          t.src = src;
          t.alt = 'Thumbnail ' + (i + 1);
          t.addEventListener('click', function(e) { e.stopPropagation(); lbGo(i); });
          thumbs.appendChild(t);
        });
      }
    }
    lbGo(lbIndex);
    const lb = document.getElementById('dm-lightbox');
    if (lb) {
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    const lb = document.getElementById('dm-lightbox');
    if (lb) lb.classList.remove('open');
    document.body.style.overflow = '';
    resetZoom();
  }

  // Attach click handlers to all listing card images
  function attachCardLightboxes() {
    document.querySelectorAll('.card-img-wrap').forEach(function(wrap) {
      // Avoid double-binding
      if (wrap.dataset.lbBound) return;
      wrap.dataset.lbBound = '1';
      wrap.addEventListener('click', function(e) {
        e.stopPropagation();
        // Find the listing id from the parent card
        const card = wrap.closest('.listing-card');
        if (!card) return;
        const onclick = card.getAttribute('onclick') || '';
        const match = onclick.match(/id=([^'\"&]+)/);
        if (!match) return;
        const id = match[1];
        // Look up listing in DM
        if (typeof DM === 'undefined') return;
        const listing = DM.getById(id);
        if (!listing) return;
        const images = listing.images && listing.images.length > 0
          ? listing.images
          : (listing.img ? [listing.img] : []);
        if (images.length === 0) return;
        openLightbox(images, 0);
      });
    });
  }

  // Expose globally
  window.DMLightbox = { open: openLightbox, close: closeLightbox, attachCards: attachCardLightboxes };

  // Auto-attach after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachCardLightboxes);
  } else {
    // Also run after a short delay to catch dynamically rendered cards
    setTimeout(attachCardLightboxes, 500);
  }

  // Re-attach when cards are re-rendered (observe DOM mutations)
  const observer = new MutationObserver(function() {
    attachCardLightboxes();
  });
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
})();
