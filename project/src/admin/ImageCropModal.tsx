import { useCallback, useEffect, useRef, useState } from 'react';
import { X, Loader2, Maximize2, Minimize2, RotateCcw } from 'lucide-react';

type PositionKey = 'tl' | 'tc' | 'tr' | 'ml' | 'mc' | 'mr' | 'bl' | 'bc' | 'br';

const POSITIONS: PositionKey[] = ['tl', 'tc', 'tr', 'ml', 'mc', 'mr', 'bl', 'bc', 'br'];

const positionOffsets = (
  pos: PositionKey,
  imgW: number,
  imgH: number,
  boxW: number,
  boxH: number
): { x: number; y: number } => {
  const col = pos[1]; // l / c / r
  const row = pos[0]; // t / m / b
  const x = col === 'l' ? boxW - imgW : col === 'r' ? 0 : (boxW - imgW) / 2;
  const y = row === 't' ? boxH - imgH : row === 'b' ? 0 : (boxH - imgH) / 2;
  return { x, y };
};

const clampOffsets = (x: number, y: number, scale: number, img: HTMLImageElement, boxW: number, boxH: number) => {
  const imgW = img.naturalWidth * scale;
  const imgH = img.naturalHeight * scale;
  const minX = boxW - imgW;
  const minY = boxH - imgH;
  return {
    x: Math.round(Math.min(0, Math.max(minX, x))),
    y: Math.round(Math.min(0, Math.max(minY, y))),
  };
};

interface ImageCropModalProps {
  open: boolean;
  file: File | null;
  aspect?: number;
  onCancel: () => void;
  onApply: (cropped: File, previewUrl: string) => void;
}

export default function ImageCropModal({
  open,
  file,
  aspect = 4 / 3,
  onCancel,
  onApply,
}: ImageCropModalProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [boxW, setBoxW] = useState(0);
  const [boxH, setBoxH] = useState(0);
  const [cover, setCover] = useState(1);
  const [scale, setScale] = useState(1);
  const [ox, setOx] = useState(0);
  const [oy, setOy] = useState(0);
  const [drag, setDrag] = useState<{ sx: number; sy: number; ox: number; oy: number } | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!open || !file) return;
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const rect = stageRef.current?.getBoundingClientRect();
      const w = rect?.width ?? 400;
      const h = rect?.height ?? 300;
      setBoxW(w);
      setBoxH(h);
      const c = Math.max(w / image.naturalWidth, h / image.naturalHeight);
      setCover(c);
      setScale(c);
      const { x, y } = clampOffsets((w - image.naturalWidth * c) / 2, (h - image.naturalHeight * c) / 2, c, image, w, h);
      setOx(x);
      setOy(y);
      setImg(image);
    };
    image.onerror = () => {
      setLoadError(true);
      setImg(null);
    };
    image.src = url;
    return () => {
      URL.revokeObjectURL(url);
      setImg(null);
      setDrag(null);
      setProcessing(false);
      setLoadError(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, file]);

  const zoomTo = useCallback(
    (nextScale: number) => {
      if (!img) return;
      const ns = Math.min(cover * 6, Math.max(cover, nextScale));
      const cx = ox + boxW / 2;
      const cy = oy + boxH / 2;
      const rx = cx / (scale || 1);
      const ry = cy / (scale || 1);
      const ncx = rx * ns;
      const ncy = ry * ns;
      const clamped = clampOffsets(ncx - boxW / 2, ncy - boxH / 2, ns, img, boxW, boxH);
      setScale(ns);
      setOx(clamped.x);
      setOy(clamped.y);
    },
    [img, ox, oy, scale, boxW, boxH, cover]
  );

  const reset = useCallback(() => {
    if (!img) return;
    setScale(cover);
    const { x, y } = clampOffsets((boxW - img.naturalWidth * cover) / 2, (boxH - img.naturalHeight * cover) / 2, cover, img, boxW, boxH);
    setOx(x);
    setOy(y);
  }, [img, cover, boxW, boxH]);

  const jumpToPosition = useCallback(
    (pos: PositionKey) => {
      if (!img) return;
      const t = positionOffsets(pos, img.naturalWidth * scale, img.naturalHeight * scale, boxW, boxH);
      const clamped = clampOffsets(t.x, t.y, scale, img, boxW, boxH);
      setOx(clamped.x);
      setOy(clamped.y);
    },
    [img, scale, boxW, boxH]
  );

  const handleApply = useCallback(() => {
    if (!img || !file) return;
    setProcessing(true);
    const outW = 1280;
    const outH = Math.round(1280 / aspect);
    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setProcessing(false);
      return;
    }
    const srcX = -ox / (scale || 1);
    const srcY = -oy / (scale || 1);
    const srcW = boxW / (scale || 1);
    const srcH = boxH / (scale || 1);
    ctx.fillStyle = '#0A0E3F';
    ctx.fillRect(0, 0, outW, outH);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, outW, outH);
    canvas.toBlob((blob) => {
      if (!blob) {
        setProcessing(false);
        return;
      }
      const baseName = (file.name || 'hero').replace(/\.[^.]+$/, '') || 'hero';
      const cropped = new File([blob], `${baseName}-cropped.jpg`, { type: 'image/jpeg' });
      onApply(cropped, canvas.toDataURL('image/jpeg', 0.85));
      setProcessing(false);
    }, 'image/jpeg', 0.92);
  }, [img, file, ox, oy, scale, boxW, boxH, aspect, onApply]);

  if (!open || !file) return null;

  const zoomPct = img ? Math.round((scale / (cover || 1)) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line bg-canvas-card shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h3 className="text-lg font-bold">Crop &amp; fit image</h3>
            <p className="text-xs text-ink-muted">
              Zoom in/out (bari image chhoti, chhoti image badi) — drag se position set karein.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-soft transition-colors hover:border-coral-200 hover:text-coral-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 overflow-y-auto p-5">
          <div
            ref={stageRef}
            className="relative mx-auto w-full overflow-hidden rounded-xl bg-ink/95"
            style={{ aspectRatio: `${aspect}`, touchAction: 'none', cursor: drag ? 'grabbing' : 'grab' }}
            onPointerDown={(e) => {
              if (!img) return;
              (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
              setDrag({ sx: e.clientX, sy: e.clientY, ox, oy });
            }}
            onPointerMove={(e) => {
              if (!drag || !img) return;
              const clamped = clampOffsets(
                drag.ox + (e.clientX - drag.sx),
                drag.oy + (e.clientY - drag.sy),
                scale,
                img,
                boxW,
                boxH
              );
              setOx(clamped.x);
              setOy(clamped.y);
            }}
            onPointerUp={() => setDrag(null)}
            onPointerLeave={() => setDrag(null)}
          >
            {img && (
              <img
                src={img.src}
                alt="Crop preview"
                draggable={false}
                className="absolute left-0 top-0 max-w-none max-h-none select-none"
                style={{
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                  transform: `translate(${ox}px, ${oy}px) scale(${scale})`,
                  transformOrigin: '0 0',
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              />
            )}
            {loadError && (
              <div className="absolute inset-0 grid place-items-center text-sm text-white/70">
                Image load nahi ho payi — koi aur file try karein.
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => zoomTo(scale / 1.15)}
              aria-label="Zoom out"
              className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-soft transition-colors hover:border-coral-200 hover:text-coral-500"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
            <input
              type="range"
              min={cover || 1}
              max={cover * 6 || 6}
              step={0.01}
              value={scale}
              onChange={(e) => zoomTo(parseFloat(e.target.value))}
              className="w-full accent-coral-500"
              aria-label="Zoom"
            />
            <button
              type="button"
              onClick={() => zoomTo(scale * 1.15)}
              aria-label="Zoom in"
              className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-soft transition-colors hover:border-coral-200 hover:text-coral-500"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <span className="w-12 shrink-0 text-right text-xs font-semibold text-ink-soft">{zoomPct}%</span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="grid grid-cols-3 gap-1">
              {POSITIONS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => jumpToPosition(p)}
                  aria-label={`Position ${p}`}
                  className="h-6 w-6 rounded-md border border-line bg-white text-[9px] font-bold uppercase text-ink-muted transition-colors hover:border-coral-300 hover:text-coral-500"
                >
                  {p[0] === 'm' ? (p[1] === 'c' ? '●' : '·') : p[1] === 'c' ? '─' : p[0] === 't' ? 'T' : 'B'}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-xs font-semibold text-ink-soft transition-colors hover:border-coral-300 hover:text-coral-500"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-line bg-canvas p-4">
          <button type="button" onClick={onCancel} className="btn-ghost text-sm">
            Cancel
          </button>
          <button type="button" onClick={handleApply} disabled={processing || !img} className="btn-primary disabled:opacity-60">
            {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Apply crop
          </button>
        </div>
      </div>
    </div>
  );
}