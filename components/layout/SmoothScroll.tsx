"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";

import "lenis/dist/lenis.css";

const options = {
  // The smoothing dial. Fraction of the remaining distance closed each frame,
  // so the axis is inverted: LOWER = more butter, HIGHER = snappier.
  //
  //   0.10  Lenis default — landing-page float
  //   0.20  current: eased, still settles quickly
  //   0.30  barely there
  //   1.00  no smoothing at all
  //
  // Below ~0.08 it drifts and starts fighting the sticky card stack.
  lerp: 0.15,
  // Touch keeps the platform's own momentum. Smoothing it fights the OS and
  // is the usual reason a site feels laggy on a phone.
  syncTouch: false,
};

/**
 * Global scroll smoothing. Lenis lerps the real `scrollTop` rather than
 * transforming a wrapper, so `position: sticky` — the How it works card stack
 * in particular — keeps working untouched.
 *
 * `root` registers the instance in a module-level store, so `useLenis()`
 * resolves anywhere in the tree without this having to wrap children.
 */
export function SmoothScroll() {
  // Can't be read while rendering on the server, so the first client paint is
  // unsmoothed and Lenis mounts a tick later
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(!query.matches);

    sync();
    query.addEventListener("change", sync);

    return () => query.removeEventListener("change", sync);
  }, []);

  // Skipping the mount entirely beats running a rAF loop that does nothing
  if (!enabled) return null;

  return <ReactLenis root options={options} />;
}
