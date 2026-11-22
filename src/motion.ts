// AtithiConnect motion system: one rAF loop, transform/opacity only, honours reduced motion.
import { useEffect } from "react";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Phones, tablets and small screens get the light, static hero (no 3D, parallax or ambient loops). */
export const LITE_MQ = "(max-width: 900px), (hover: none), (pointer: coarse)";
export const isLite = () => typeof window !== "undefined" && window.matchMedia(LITE_MQ).matches;

export function useMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    root.classList.add("motion-ready");
    if (reduced) root.classList.add("reduced");
    const lite = isLite();
    root.classList.toggle("lite", lite);

    // stagger index for reveal groups
    document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((g) => {
      Array.from(g.children).forEach((c, i) => (c as HTMLElement).style.setProperty("--i", String(i)));
    });

    // reveal on enter (also triggers counters + step line)
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target as HTMLElement;
      el.classList.add("in");
      el.querySelectorAll<HTMLElement>("[data-count]").forEach(count);
      if (el.matches("[data-count]")) count(el);
      io.unobserve(el);
    }), { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll(".rv, .mo, [data-count]").forEach((e) => io.observe(e));

    function count(el: HTMLElement) {
      if (el.dataset.done) return; el.dataset.done = "1";
      const to = Number(el.dataset.count || 0);
      if (reduced) { el.textContent = String(to); return; }
      const t0 = performance.now(), dur = 1400;
      const step = (now: number) => {
        const p = clamp((now - t0) / dur); const e = 1 - Math.pow(1 - p, 4);
        el.textContent = String(Math.round(to * e));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    if (reduced || lite) return () => io.disconnect();

    // pointer-driven 3D tilt (desktop only)
    type T = { el: HTMLElement; max: number; tx: number; ty: number; x: number; y: number; mx: number; my: number; hover: boolean };
    const tilts: T[] = fine ? Array.from(document.querySelectorAll<HTMLElement>("[data-tilt]")).map((el) => ({ el, max: Number(el.dataset.tilt || 8), tx: 0, ty: 0, x: 0, y: 0, mx: 50, my: 50, hover: false })) : [];
    const global = tilts.filter((t) => t.el.hasAttribute("data-tilt-global"));
    let onMoveK: ((e: PointerEvent) => void) | null = null, lastE: PointerEvent | null = null;
    function onMove(e: PointerEvent) {
      for (const t of tilts) {
        const r = t.el.getBoundingClientRect();
        if (t.el.hasAttribute("data-tilt-global")) {
          t.tx = ((e.clientX / innerWidth) - 0.5) * 2; t.ty = ((e.clientY / innerHeight) - 0.5) * 2;
        } else if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
          t.hover = true; t.tx = ((e.clientX - r.left) / r.width - 0.5) * 2; t.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
          t.mx = ((e.clientX - r.left) / r.width) * 100; t.my = ((e.clientY - r.top) / r.height) * 100;
          t.el.style.setProperty("--mx", t.mx + "%"); t.el.style.setProperty("--my", t.my + "%");
        } else if (t.hover) { t.hover = false; t.tx = 0; t.ty = 0; }
      }
    }
    if (tilts.length) window.addEventListener("pointermove", (onMoveK = (e: PointerEvent) => { lastE = e; kick(); }), { passive: true });
    void global;

    // scroll-linked progress (--p: 0 entering bottom -> 1 at centre; --q: 0..1 as it leaves the top)
    const scrollers = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll]"));
    let raf = 0, dirty = true;
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    const onScroll = () => { dirty = true; kick(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const loop = () => {
      raf = 0; let moving = false;
      if (lastE) { onMove(lastE); lastE = null; } // pointer work throttled to one per frame
      for (const t of tilts) {
        const k = 0.085;
        const nx = lerp(t.x, t.tx, k), ny = lerp(t.y, t.ty, k);
        if (Math.abs(nx - t.x) > 0.0005 || Math.abs(ny - t.y) > 0.0005) {
          t.x = nx; t.y = ny; moving = true;
          t.el.style.setProperty("--ry", (t.x * t.max).toFixed(3) + "deg");
          t.el.style.setProperty("--rx", (-t.y * t.max).toFixed(3) + "deg");
          t.el.style.setProperty("--px", t.x.toFixed(4)); t.el.style.setProperty("--py", t.y.toFixed(4));
        }
      }
      if (dirty) {
        dirty = false; const vh = innerHeight;
        for (const el of scrollers) {
          const r = el.getBoundingClientRect();
          const p = clamp((vh - r.top) / (vh * 0.5 + r.height * 0.5));
          const q = clamp(-r.top / Math.max(1, r.height));
          el.style.setProperty("--p", p.toFixed(4)); el.style.setProperty("--q", q.toFixed(4));
        }
      }
      if (moving) raf = requestAnimationFrame(loop); // sleeps when idle; pointer/scroll wake it
    };
    raf = requestAnimationFrame(loop);
    return () => {
      io.disconnect(); cancelAnimationFrame(raf);
      if (onMoveK) window.removeEventListener("pointermove", onMoveK); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll);
    };
  }, []);
}
