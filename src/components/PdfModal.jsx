import { useEffect, useRef, useState, useCallback } from 'react';
import { Download } from 'lucide-react';
import { useI18n } from '../i18n/I18nProvider';

/**
 * PdfModal — reusable PDF viewer modal.
 *
 * Props:
 *  src          {string}   URL of the PDF to display.
 *  title        {string}   Accessible label for the dialog.
 *  showDownload {boolean}  When true (default) renders a download button.
 *  onClose      {function} Called when the modal should close.
 *  triggerRef   {object}   React ref to the button that opened the modal —
 *                          focus is returned to it on close.
 */
export default function PdfModal({ src, title, showDownload = true, onClose, triggerRef }) {
  const { t } = useI18n();
  const panelRef = useRef(null);

  // ── body scroll lock + Esc + focus-return ──────────────────────────────────
  useEffect(() => {
    const previousFocus = document.activeElement;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    // Move focus into the panel so screen-readers announce the dialog
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      // Return focus to whichever element triggered the modal
      const target = triggerRef?.current ?? previousFocus;
      target?.focus();
    };
  }, [onClose, triggerRef]);

  return (
    /* Backdrop — click outside closes */
    <div className="event-modal" onClick={onClose} aria-hidden="true">
      <div
        ref={panelRef}
        className="event-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close × */}
        <button
          type="button"
          className="event-modal__close"
          aria-label={t('common.close')}
          onClick={onClose}
        >
          ×
        </button>

        {/* Optional download button — same position as CV modal */}
        {showDownload && (
          <a
            className="btn btn--secondary resume-modal__download"
            href={src}
            download
            aria-label={t('hero.downloadResume')}
            title={t('hero.downloadResume')}
          >
            <Download size={17} aria-hidden="true" />
          </a>
        )}

        <div className="event-modal__content resume-modal__content">
          <div className="event-modal__gallery resume-modal__gallery">
            {showDownload ? (
              /* CV: plain iframe (original behaviour) */
              <iframe
                className="resume-modal__frame"
                src={`${src}#toolbar=0&navpanes=0`}
                title={title}
              />
            ) : (
              /* Certificate: canvas-rendered via pdfjs, no download */
              <PdfCanvasViewer src={src} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Canvas renderer (lazy-loaded pdfjs) ────────────────────────────────────
function PdfCanvasViewer({ src }) {
  const { t } = useI18n();
  const [pages, setPages] = useState([]); // array of ImageBitmap/canvas per page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  const renderPdf = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Lazy-load pdfjs so it never bloats the main bundle
      const pdfjsLib = await import('pdfjs-dist');
      const workerSrc = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

      const pdf = await pdfjsLib.getDocument(src).promise;
      const dpr = window.devicePixelRatio || 1;
      const containerWidth = containerRef.current?.clientWidth || 800;

      const canvases = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1 });

        // Scale so the page fills the container at the device's pixel ratio
        const scale = (containerWidth / viewport.width) * dpr;
        const scaledViewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = scaledViewport.width;
        canvas.height = scaledViewport.height;
        // CSS size = logical pixels so it looks sharp on HiDPI
        canvas.style.width = `${scaledViewport.width / dpr}px`;
        canvas.style.height = `${scaledViewport.height / dpr}px`;
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto';

        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport: scaledViewport }).promise;

        canvases.push(canvas);
      }

      setPages(canvases);
    } catch (err) {
      console.error('PdfCanvasViewer error:', err);
      setError(t('certificate.loadError'));
    } finally {
      setLoading(false);
    }
  }, [src, t]);

  useEffect(() => {
    renderPdf();
  }, [renderPdf]);

  // Attach rendered canvases to DOM nodes
  const attachCanvas = useCallback((node, canvas) => {
    if (node && canvas && !node.contains(canvas)) {
      node.innerHTML = '';
      node.appendChild(canvas);
    }
  }, []);

  if (loading) {
    return (
      <div className="pdf-canvas-viewer__status">
        <span>{t('certificate.loading')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pdf-canvas-viewer__status pdf-canvas-viewer__status--error">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="pdf-canvas-viewer"
      onContextMenu={(e) => e.preventDefault()}
    >
      {pages.map((canvas, i) => (
        <div
          key={i}
          className="pdf-canvas-viewer__page"
          // eslint-disable-next-line react/jsx-no-bind
          ref={(node) => attachCanvas(node, canvas)}
          draggable={false}
        />
      ))}
    </div>
  );
}
