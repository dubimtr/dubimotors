/**
 * DubiMotors — Browser-side image compression
 *
 * Compresses uploaded photos in the browser before they ever touch the network.
 * Typical phone photo: 5-10 MB → 300-500 KB after compression. ~16x reduction.
 *
 * Benefits:
 *   - Faster uploads (matters on UAE mobile data)
 *   - Lower storage costs on Supabase
 *   - Faster page loads for buyers viewing listings
 *   - Auto-rotates iPhone photos that come in sideways (EXIF orientation)
 *
 * Usage:
 *   const compressed = await window.dmCompressImage(file);
 *   // → returns a File object, may be the original if compression wasn't needed
 *
 * Public API:
 *   window.dmCompressImage(file, opts?) → Promise<File>
 *   window.dmShouldCompress(file) → boolean
 *
 * Depends on: browser-image-compression (loaded via CDN, see place-ad.html)
 */
(function () {
  if (typeof window === 'undefined') return;

  // ─── Tuning ───
  const DEFAULT_OPTS = {
    maxSizeMB: 0.5,             // Target ~500 KB
    maxWidthOrHeight: 1600,     // Plenty for detail-page zoom
    useWebWorker: true,         // Keep main thread responsive
    fileType: 'image/jpeg',     // Force JPEG (PNG is much larger for photos)
    initialQuality: 0.85,       // High quality, no visible artifacts
    alwaysKeepResolution: false,
    // Hard upper bound — if input is bigger than this, refuse rather than crash
    // the page trying to load it into memory.
    _maxInputMB: 50,
  };

  // If input is already small enough, skip recompression — re-encoding lossy
  // image data twice is silly and degrades quality.
  const SKIP_IF_UNDER_KB = 500;
  const SKIP_IF_UNDER_PX = 1600;

  /**
   * Quick heuristic check whether a file is worth compressing.
   * Used by the place-ad form to decide if compression step is needed at all.
   */
  function dmShouldCompress(file) {
    if (!file || !file.type) return false;
    if (!file.type.startsWith('image/')) return false;
    // Already small? Skip.
    if (file.size <= SKIP_IF_UNDER_KB * 1024) return false;
    return true;
  }

  /**
   * Get image dimensions without decoding the full file into memory.
   * Returns { width, height } or null on failure.
   */
  async function getImageDimensions(file) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const r = { width: img.naturalWidth, height: img.naturalHeight };
        URL.revokeObjectURL(url);
        resolve(r);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.src = url;
    });
  }

  /**
   * Compress a File. Returns a new File on success, or the original if
   * compression isn't needed / fails. Never throws — designed to be drop-in
   * safe.
   */
  async function dmCompressImage(file, userOpts = {}) {
    if (!file) return file;

    // ─── Bail-outs ───
    if (!file.type || !file.type.startsWith('image/')) {
      // Not an image at all — pass through unchanged
      return file;
    }

    if (typeof window.imageCompression !== 'function') {
      console.warn('[dmCompressImage] browser-image-compression library not loaded; skipping compression');
      return file;
    }

    const opts = Object.assign({}, DEFAULT_OPTS, userOpts);

    // Reject ridiculously large input (pro camera RAW, etc.)
    if (file.size > opts._maxInputMB * 1024 * 1024) {
      console.warn(`[dmCompressImage] File too large (${(file.size/1024/1024).toFixed(1)}MB); skipping compression`);
      return file;
    }

    // Skip if already small AND already low-resolution
    if (file.size <= SKIP_IF_UNDER_KB * 1024) {
      const dims = await getImageDimensions(file);
      if (dims && dims.width <= SKIP_IF_UNDER_PX && dims.height <= SKIP_IF_UNDER_PX) {
        // Already small both in bytes and pixels — no point recompressing
        return file;
      }
    }

    // ─── Compress ───
    try {
      const compressed = await window.imageCompression(file, opts);
      // The library returns a Blob in some versions; wrap to File for consistency
      if (compressed instanceof File) {
        return compressed;
      }
      // Convert Blob → File preserving the original name (but with .jpg ext if forced)
      const baseName = (file.name || 'photo').replace(/\.[^.]+$/, '');
      const ext = (opts.fileType || 'image/jpeg').split('/')[1] || 'jpg';
      return new File([compressed], `${baseName}.${ext}`, {
        type: opts.fileType || file.type,
        lastModified: Date.now(),
      });
    } catch (e) {
      console.warn('[dmCompressImage] Compression failed; using original file:', e && e.message);
      return file;
    }
  }

  /**
   * Compress an array of Files in parallel with a concurrency limit.
   * Calls onProgress(done, total) after each one completes.
   *
   * Limit parallelism to 3 — too many concurrent canvas operations can crash
   * lower-end mobile devices.
   */
  async function dmCompressImages(files, onProgress) {
    const total = files.length;
    let done = 0;
    const CONCURRENCY = 3;
    const results = new Array(total);
    let nextIndex = 0;

    async function worker() {
      while (true) {
        const i = nextIndex++;
        if (i >= total) return;
        results[i] = await dmCompressImage(files[i]);
        done++;
        if (typeof onProgress === 'function') {
          try { onProgress(done, total); } catch {}
        }
      }
    }

    const workers = [];
    for (let k = 0; k < Math.min(CONCURRENCY, total); k++) workers.push(worker());
    await Promise.all(workers);
    return results;
  }

  // ─── Expose ───
  window.dmCompressImage = dmCompressImage;
  window.dmCompressImages = dmCompressImages;
  window.dmShouldCompress = dmShouldCompress;
})();
