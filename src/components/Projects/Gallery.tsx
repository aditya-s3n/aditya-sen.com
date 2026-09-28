"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image, { StaticImageData } from "next/image";
import styles from "./Projects.module.css";

export type GalleryImage = { src: StaticImageData; alt: string };

const pad = (n: number) => String(n).padStart(2, "0");
const ZOOM_LEVELS = [1, 2, 3, 4];

type GalleryProps = {
  images: GalleryImage[];
  color: string;
};

// One image at a time, with cards peeking out behind it. Click to open the lightbox.
export default function Gallery({ images, color }: GalleryProps) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const image = images[index];
  const behind = Math.min(images.length - 1, 2);

  return (
    <div className={styles.gallery} style={{ "--behind": behind } as React.CSSProperties}>
      {Array.from({ length: behind }, (_, layer) => (
        <span key={layer} className={styles.galleryLayer} style={{ "--layer": layer + 1 } as React.CSSProperties} aria-hidden="true" />
      ))}

      <button
        type="button"
        className={styles.galleryFrame}
        onClick={() => setOpen(true)}
        aria-label={`${image.alt}. Open gallery, ${images.length} image${images.length === 1 ? "" : "s"}`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          className={styles.galleryImage}
          sizes="(max-width: 991px) 100vw, 33vw"
          placeholder="blur"
        />
        <span className={styles.galleryCounter}>
          <i className="bi bi-arrows-fullscreen" />
          {images.length > 1 && ` ${pad(index + 1)} / ${pad(images.length)}`}
        </span>
      </button>

      {open && (
        <Lightbox images={images} color={color} index={index} setIndex={setIndex} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}

type LightboxProps = {
  images: GalleryImage[];
  color: string;
  index: number;
  setIndex: (index: number) => void;
  onClose: () => void;
};

// Full-screen viewer. Rendered into <body> so the card's hover transform doesn't trap the fixed overlay.
function Lightbox({ images, color, index, setIndex, onClose }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [zoom, setZoom] = useState(0); // index into ZOOM_LEVELS
  const image = images[index];
  const many = images.length > 1;
  const zoomed = zoom > 0;
  const step = (delta: number) => {
    setZoom(0);
    setIndex((index + delta + images.length) % images.length);
  };
  const zoomBy = (delta: number) => setZoom(Math.min(Math.max(zoom + delta, 0), ZOOM_LEVELS.length - 1));

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
      else if (event.key === "+" || event.key === "=") zoomBy(1);
      else if (event.key === "-") zoomBy(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Lock page scroll and move focus into the dialog while it's open
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  return createPortal(
    <div
      className={styles.lightbox}
      style={{ "--accent": color } as React.CSSProperties}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
      onClick={onClose}
    >
      <div className={styles.lightboxBar} onClick={(event) => event.stopPropagation()}>
        <span className={styles.lightboxCounter}>{pad(index + 1)} / {pad(images.length)}</span>
        <div className={styles.lightboxTools}>
          <button type="button" className={styles.lightboxButton} onClick={() => zoomBy(-1)} disabled={!zoomed} aria-label="Zoom out">
            <i className="bi bi-zoom-out" />
          </button>
          <span className={styles.lightboxZoom} aria-live="polite">{ZOOM_LEVELS[zoom]}x</span>
          <button type="button" className={styles.lightboxButton} onClick={() => zoomBy(1)} disabled={zoom === ZOOM_LEVELS.length - 1} aria-label="Zoom in">
            <i className="bi bi-zoom-in" />
          </button>
          <button ref={closeRef} type="button" className={styles.lightboxButton} onClick={onClose} aria-label="Close gallery">
            <i className="bi bi-x-lg" />
          </button>
        </div>
      </div>

      <div className={styles.lightboxStage}>
        {many && (
          <button
            type="button"
            className={`${styles.lightboxButton} ${styles.lightboxPrev}`}
            onClick={(event) => { event.stopPropagation(); step(-1); }}
            aria-label="Previous image"
          >
            <i className="bi bi-chevron-left" />
          </button>
        )}

        {/* Scrolls when zoomed past the screen, so the image can be panned */}
        <div className={styles.lightboxScroll}>
          <Image
            key={index}
            src={image.src}
            alt={image.alt}
            className={`${styles.lightboxImage} ${zoomed ? styles.lightboxImageZoomed : ""} ${many && !zoomed ? styles.lightboxImageClickable : ""}`}
            style={{
              "--ratio": image.src.width / image.src.height,
              "--native": `${image.src.width}px`,
              "--zoom": ZOOM_LEVELS[zoom],
            } as React.CSSProperties}
            unoptimized
            placeholder="blur"
            onClick={(event) => { event.stopPropagation(); if (many && !zoomed) step(1); }}
          />
        </div>

        {many && (
          <button
            type="button"
            className={`${styles.lightboxButton} ${styles.lightboxNext}`}
            onClick={(event) => { event.stopPropagation(); step(1); }}
            aria-label="Next image"
          >
            <i className="bi bi-chevron-right" />
          </button>
        )}
      </div>

      <p className={styles.lightboxCaption}>{image.alt}</p>
    </div>,
    document.body,
  );
}
