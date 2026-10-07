import { useEffect, useRef, useState, useCallback } from 'react';
import { Download, ZoomIn, ZoomOut } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';
import useScrollLock from '../hooks/useScrollLock';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4.0;
const ZOOM_STEP = 0.1;

/**
 * PdfModal — unified PDF viewer modal with sharp canvas rendering,
 * zoom controls, and multiple input methods (touch pinch, wheel, keyboard, double click).
 *
 * Props:
 *  src          {string}   URL of the PDF to display.
 *  title        {string}   Accessible label for the dialog.
 *  showDownload {boolean}  When true (default) renders a download button.
 *  onClose      {function} Called when the modal should close.
 *  triggerRef   {object}   React ref to the element that opened the modal (focus returned on close).
 */
export default function PdfModal({ src, title, showDownload = true, onClose, triggerRef }) {
  const { t } = useI18n();
  const panelRef = useRef(null);
  const scrollContainerRef = useRef(null);
  useScrollLock(true, panelRef);

  // Zoom state (1 = 100% / fit container width)
  const [zoom, setZoom] = useState(1);
  const [renderedZoom, setRenderedZoom] = useState(1);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pdfDocRef = useRef(null);
  const renderTasksRef = useRef([]);
  const baseContainerWidthRef = useRef(800);
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;
  const renderedZoomRef = useRef(renderedZoom);
  renderedZoomRef.current = renderedZoom;

  // Track pointers for touch pinch-to-zoom
  const activePointersRef = useRef(new Map());
  const initialPinchRef = useRef(null);

  // ── Cancel any in-flight canvas render tasks ────────────────────────────────
  const cancelRenderTasks = useCallback(() => {
    renderTasksRef.current.forEach((task) => {
      try {
        task.cancel();
      } catch {
        // Ignore cancellation errors
      }
    });
    renderTasksRef.current = [];
  }, []);

  // ── Render all pages at a given zoom level with pdfjs ──────────────────────
  const renderPagesAtZoom = useCallback(async (pdf, targetZoom, availableWidth) => {
    cancelRenderTasks();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const renderedCanvases = [];

    try {
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const unscaledViewport = page.getViewport({ scale: 1 });
        const fitWidthScale = availableWidth / unscaledViewport.width;
        const cssViewport = page.getViewport({ scale: fitWidthScale * targetZoom });
        const scaledViewport = page.getViewport({ scale: fitWidthScale * targetZoom * dpr });
        const annotations = await page.getAnnotations({ intent: 'display' });
        const links = annotations
          .filter((annotation) => annotation.subtype === 'Link' && annotation.url)
          .map((annotation, linkIndex) => {
            const [x1, y1, x2, y2] = cssViewport.convertToViewportRectangle(annotation.rect);
            return {
              key: `${pageNum}-${linkIndex}`,
              url: annotation.url,
              left: Math.min(x1, x2),
              top: Math.min(y1, y2),
              width: Math.abs(x2 - x1),
              height: Math.abs(y2 - y1),
            };
          });

        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(scaledViewport.width);
        canvas.height = Math.floor(scaledViewport.height);

        const cssWidth = scaledViewport.width / dpr;
        const cssHeight = scaledViewport.height / dpr;
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto';

        const ctx = canvas.getContext('2d', { alpha: false });
        const renderTask = page.render({ canvasContext: ctx, viewport: scaledViewport });
        renderTasksRef.current.push(renderTask);
        await renderTask.promise;

        renderedCanvases.push({
          canvas,
          width: cssWidth,
          height: cssHeight,
          links,
        });
      }

      setPages(renderedCanvases);
      setRenderedZoom(targetZoom);
      setLoading(false);
    } catch (err) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error('PdfModal rendering error:', err);
      }
    }
  }, [cancelRenderTasks]);

  // ── Zoom update with visible center stabilization ─────────────────────────
  const updateZoom = useCallback((nextZoomOrUpdater) => {
    setZoom((currentZoom) => {
      const target = typeof nextZoomOrUpdater === 'function' ? nextZoomOrUpdater(currentZoom) : nextZoomOrUpdater;
      const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(target * 100) / 100));
      if (clamped === currentZoom) return currentZoom;

      const container = scrollContainerRef.current;
      if (container && currentZoom > 0) {
        const ratio = clamped / currentZoom;
        const centerX = container.scrollLeft + container.clientWidth / 2;
        const centerY = container.scrollTop + container.clientHeight / 2;

        requestAnimationFrame(() => {
          if (container) {
            container.scrollLeft = centerX * ratio - container.clientWidth / 2;
            container.scrollTop = centerY * ratio - container.clientHeight / 2;
          }
        });
      }
      return clamped;
    });
  }, []);

  // ── Initial load of the PDF document ───────────────────────────────────────
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);
    setZoom(1);
    setRenderedZoom(1);

    async function loadPdf() {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        const workerSrc = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

        const loadingTask = pdfjsLib.getDocument(src);
        const pdf = await loadingTask.promise;

        if (isCancelled) {
          pdf.destroy();
          return;
        }

        pdfDocRef.current = pdf;

        const containerWidth = scrollContainerRef.current?.clientWidth || 800;
        const availableWidth = Math.max(containerWidth - 32, 280);
        baseContainerWidthRef.current = availableWidth;

        if (!isCancelled) {
          await renderPagesAtZoom(pdf, 1, availableWidth);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('PdfModal loading error:', err);
          setError(t('certificate.loadError'));
          setLoading(false);
        }
      }
    }

    loadPdf();

    return () => {
      isCancelled = true;
      cancelRenderTasks();
      if (pdfDocRef.current) {
        pdfDocRef.current.destroy();
        pdfDocRef.current = null;
      }
    };
  }, [src, t, cancelRenderTasks, renderPagesAtZoom]);

  // ── Debounced sharp re-rendering on zoom changes ────────────────────────────
  useEffect(() => {
    if (!pdfDocRef.current || loading) return;

    const timer = setTimeout(() => {
      const availableWidth = baseContainerWidthRef.current || (scrollContainerRef.current?.clientWidth - 32) || 800;
      renderPagesAtZoom(pdfDocRef.current, zoom, availableWidth);
    }, 150);

    return () => clearTimeout(timer);
  }, [zoom, loading, renderPagesAtZoom]);

  // ── Resize handling to adapt fit-width scale ──────────────────────────────
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let resizeTimer;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const availableWidth = Math.max(width - 32, 280);
        if (Math.abs(availableWidth - baseContainerWidthRef.current) > 20) {
          baseContainerWidthRef.current = availableWidth;
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            if (pdfDocRef.current) {
              renderPagesAtZoom(pdfDocRef.current, zoomRef.current, availableWidth);
            }
          }, 200);
        }
      }
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
      clearTimeout(resizeTimer);
    };
  }, [renderPagesAtZoom]);

  // ── Keyboard shortcuts & scroll lock ──────────────────────────────────────
  useEffect(() => {
    const previousFocus = document.activeElement;

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName) || e.target?.isContentEditable) {
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        updateZoom((z) => Math.min(MAX_ZOOM, Math.round((z + ZOOM_STEP) * 100) / 100));
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        updateZoom((z) => Math.max(MIN_ZOOM, Math.round((z - ZOOM_STEP) * 100) / 100));
      } else if (e.key === '0') {
        e.preventDefault();
        updateZoom(1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    scrollContainerRef.current?.focus({ preventScroll: true });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      const target = triggerRef?.current ?? previousFocus;
      target?.focus?.();
    };
  }, [onClose, triggerRef, updateZoom]);

  // ── Ctrl/Cmd + Mouse Wheel zooming ─────────────────────────────────────────
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
        updateZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round((z + delta) * 100) / 100)));
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [updateZoom]);

  // ── Touch Pinch-to-zoom (Pointer Events) ──────────────────────────────────
  const handlePointerDown = (e) => {
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (activePointersRef.current.size === 2) {
      const [p1, p2] = Array.from(activePointersRef.current.values());
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      initialPinchRef.current = {
        dist: dist || 1,
        startZoom: zoomRef.current,
      };
    }
  };

  const handlePointerMove = (e) => {
    if (activePointersRef.current.has(e.pointerId)) {
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    if (activePointersRef.current.size === 2 && initialPinchRef.current) {
      const [p1, p2] = Array.from(activePointersRef.current.values());
      const currentDist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      const factor = currentDist / initialPinchRef.current.dist;
      const targetZoom = Math.min(
        MAX_ZOOM,
        Math.max(MIN_ZOOM, Math.round(initialPinchRef.current.startZoom * factor * 20) / 20)
      );
      updateZoom(targetZoom);
    }
  };

  const handlePointerUp = (e) => {
    activePointersRef.current.delete(e.pointerId);
    if (activePointersRef.current.size < 2) {
      initialPinchRef.current = null;
    }
  };

  // ── Double click / Double tap toggle ──────────────────────────────────────
  const handleDoubleClick = () => {
    updateZoom((z) => (z === 1 ? 2 : 1));
  };

  // ── Attach canvas DOM nodes ───────────────────────────────────────────────
  const attachCanvas = useCallback((node, canvas) => {
    if (node && canvas && !node.contains(canvas)) {
      node.querySelector('canvas')?.remove();
      node.insertBefore(canvas, node.firstChild);
    }
  }, []);

  // Instant CSS scale feedback while debounce is pending
  const cssScale = renderedZoom > 0 ? zoom / renderedZoom : 1;
  const isScaleTransformed = Math.abs(cssScale - 1) > 0.005;
  const isResume = /\/Anouer_Chouikh_CV_(EN|FR)\.pdf$/i.test(src);
  const resumeLinks = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/anouer-chouikh-303306220/' },
    { label: 'Portfolio', href: 'https://anouer-chouikh.netlify.app/' },
    { label: 'GitHub', href: 'https://github.com/AnouerChouikhgithub' },
    { label: 'Email', href: 'mailto:anouer.chouikh2005@gmail.com' },
  ];

  return (
    <div className="event-modal" onClick={onClose} aria-hidden="true">
      <div
        ref={panelRef}
        className="event-modal__panel pdf-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar with title, compact zoom toolbar, download & close */}
        <header className="pdf-modal__header">
          <h3 className="pdf-modal__title" title={title}>
            {title}
          </h3>

          <div className="pdf-modal__controls">
            {/* Zoom Controls: [ − ] [ 100% ] [ + ] */}
            <div className="pdf-modal__zoom-group" dir="ltr">
              <button
                type="button"
                className="pdf-modal__btn"
                onClick={() => updateZoom((z) => Math.max(MIN_ZOOM, Math.round((z - ZOOM_STEP) * 100) / 100))}
                disabled={zoom <= MIN_ZOOM}
                aria-label={t('pdf.zoomOut')}
                title={t('pdf.zoomOut')}
              >
                <ZoomOut size={16} aria-hidden="true" />
              </button>

              <button
                type="button"
                className="pdf-modal__btn pdf-modal__btn--pill"
                onClick={() => updateZoom(1)}
                aria-label={t('pdf.resetZoom')}
                title={t('pdf.resetZoom')}
              >
                <span>{Math.round(zoom * 100)}%</span>
              </button>

              <button
                type="button"
                className="pdf-modal__btn"
                onClick={() => updateZoom((z) => Math.min(MAX_ZOOM, Math.round((z + ZOOM_STEP) * 100) / 100))}
                disabled={zoom >= MAX_ZOOM}
                aria-label={t('pdf.zoomIn')}
                title={t('pdf.zoomIn')}
              >
                <ZoomIn size={16} aria-hidden="true" />
              </button>
            </div>

            {/* Optional Download button */}
            {showDownload && (
              <a
                className="pdf-modal__btn"
                href={src}
                download
                aria-label={t('hero.downloadResume')}
                title={t('hero.downloadResume')}
              >
                <Download size={16} aria-hidden="true" />
              </a>
            )}

            {/* Close button */}
            <button
              type="button"
              className="pdf-modal__btn pdf-modal__btn--close"
              aria-label={t('common.close')}
              title={t('common.close')}
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </header>

        {/* PDF scroll & display viewport */}
        {isResume && (
          <nav className="pdf-modal__links" aria-label="CV contact links">
            {resumeLinks.map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            ))}
            <a href={src} download>
              Download PDF
            </a>
          </nav>
        )}

        <div
          ref={scrollContainerRef}
          className={`pdf-modal__body ${zoom > 1 ? 'pdf-modal__body--zoomed' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onDoubleClick={handleDoubleClick}
          onContextMenu={(e) => !showDownload && e.preventDefault()}
          tabIndex={0}
          aria-label="PDF document pages"
        >
          {loading && (
            <div className="pdf-canvas-viewer__status">
              <span>{t('certificate.loading')}</span>
            </div>
          )}

          {error && (
            <div className="pdf-canvas-viewer__status pdf-canvas-viewer__status--error">
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && (
            <div
              className="pdf-modal__pages"
              style={{
                transform: isScaleTransformed ? `scale(${cssScale})` : 'none',
                transformOrigin: 'top center',
              }}
            >
              {pages.map((item, idx) => (
                <div
                  key={idx}
                  className="pdf-canvas-viewer__page"
                  ref={(node) => attachCanvas(node, item.canvas)}
                  style={{
                    width: `${item.width}px`,
                    height: `${item.height}px`,
                  }}
                >
                  {item.links.map((link) => (
                    <a
                      key={link.key}
                      className="pdf-canvas-viewer__link"
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${link.url}`}
                      title={link.url}
                      style={{
                        left: `${link.left}px`,
                        top: `${link.top}px`,
                        width: `${link.width}px`,
                        height: `${link.height}px`,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
