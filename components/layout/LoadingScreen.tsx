"use client";

import { useEffect, useState } from "react";

// CLAUDE.md: counter 0->100%, "loading" below, full-viewport, centered,
// 150ms fade-out once "the page is fully loaded" — Home and Result only
// (the two pages with a background video worth masking the load of).
const COUNT_DURATION_MS = 1200;
const FADE_OUT_MS = 150;
// Safety ceiling: requestAnimationFrame throttles heavily (or stops) for a
// backgrounded/unfocused tab, and this is a full-screen overlay that blocks
// all interaction — it must never depend solely on rAF or a single load
// signal to end, or a backgrounded tab could leave it stuck indefinitely.
const MAX_LOADING_MS = 5000;

export function LoadingScreen() {
  const [count, setCount] = useState(0);
  const [countDone, setCountDone] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(
    () => typeof document !== "undefined" && document.readyState === "complete",
  );
  const [mounted, setMounted] = useState(true);

  // rAF drives the smooth visual count-up; the actual "done" signal is a
  // plain setTimeout, since rAF is the part that can stall in a backgrounded
  // tab and this signal must not depend on that.
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / COUNT_DURATION_MS);
      setCount(Math.round(progress * 100));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const doneTimer = setTimeout(() => {
      setCount(100);
      setCountDone(true);
    }, COUNT_DURATION_MS);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(doneTimer);
    };
  }, []);

  // "Fully loaded": the standard window load signal, so the loader never
  // dismisses before the page's assets (incl. its background video) have
  // at least loaded enough to be requested/rendered.
  useEffect(() => {
    if (pageLoaded) return;
    const handleLoad = () => setPageLoaded(true);
    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, [pageLoaded]);

  // Ceiling: force both signals after MAX_LOADING_MS regardless, so this
  // never blocks the page indefinitely if something above doesn't fire.
  useEffect(() => {
    const ceiling = setTimeout(() => {
      setCountDone(true);
      setPageLoaded(true);
    }, MAX_LOADING_MS);
    return () => clearTimeout(ceiling);
  }, []);

  // Fade out only once BOTH the counter has finished its sweep AND the page
  // has actually loaded — whichever finishes later. Derived, not stored, so
  // the only state write here is the deferred setMounted(false) after the
  // fade transition ends.
  const fadingOut = countDone && pageLoaded;

  useEffect(() => {
    if (!fadingOut) return;
    const timeout = setTimeout(() => setMounted(false), FADE_OUT_MS);
    return () => clearTimeout(timeout);
  }, [fadingOut]);

  if (!mounted) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-[8px] bg-fill-white transition-opacity ease-out ${
        fadingOut ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_OUT_MS}ms` }}
    >
      <p className="text-mobile-heading-h1 text-text-primary desktop:text-desktop-heading-h1">{count}%</p>
      <p className="text-mobile-body-regular text-text-primary desktop:text-desktop-body-regular">loading</p>
    </div>
  );
}
