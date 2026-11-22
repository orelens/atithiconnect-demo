import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const s: P = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };

export const IconTowels = (p: P) => (
  <svg {...s} {...p}><path d="M6 5h9a3 3 0 0 1 3 3v11H8a3 3 0 0 1-3-3V5z" /><path d="M6 5a3 3 0 0 0-3 3v8" /><path d="M9 8h6M9 12h6" /></svg>
);
export const IconClean = (p: P) => (
  <svg {...s} {...p}><path d="M14 4l6 6-10 10H4v-6L14 4z" /><path d="M13 5l6 6" /></svg>
);
export const IconLuggage = (p: P) => (
  <svg {...s} {...p}><rect x="5" y="7" width="14" height="12" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M5 12h14" /></svg>
);
export const IconWake = (p: P) => (
  <svg {...s} {...p}><circle cx="12" cy="13" r="7" /><path d="M12 13V9M9 3l-2 2M15 3l2 2" /></svg>
);
export const IconWater = (p: P) => (
  <svg {...s} {...p}><path d="M8 8h8l-1 11H9L8 8z" /><path d="M10 8V5a2 2 0 0 1 4 0v3" /></svg>
);
export const IconRepair = (p: P) => (
  <svg {...s} {...p}><path d="M14.5 4.5a4 4 0 0 0-5.7 5.6L4 14.9 9.1 20l4.8-4.8a4 4 0 0 0 5.6-5.7l-3 3-2.5-2.5 3-3z" /></svg>
);
export const IconHome = (p: P) => (
  <svg {...s} {...p}><path d="M4 11.5L12 4l8 7.5V20H4v-8.5z" /><circle cx="12" cy="14" r="1.2" /></svg>
);
export const IconFood = (p: P) => (
  <svg {...s} {...p}><path d="M4 11h16v2a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6v-2z" /><path d="M8 11V5M12 11V4M16 11V6" /></svg>
);
export const IconBell = (p: P) => (
  <svg {...s} {...p}><path d="M6 16h12l-1.2-2.2a6 6 0 0 1-.8-3.3V9a4 4 0 1 0-8 0v1.5c0 1.16-.28 2.3-.8 3.3L6 16z" /><path d="M10 16v1a2 2 0 0 0 4 0v-1" /></svg>
);
export const IconChat = (p: P) => (
  <svg {...s} {...p}><path d="M5 6h14v10H8l-3 3V6z" /></svg>
);
export const IconMore = (p: P) => (
  <svg {...s} {...p}><rect x="4" y="4" width="6" height="6" rx="1.2" /><rect x="14" y="4" width="6" height="6" rx="1.2" /><rect x="4" y="14" width="6" height="6" rx="1.2" /><rect x="14" y="14" width="6" height="6" rx="1.2" /></svg>
);
export const IconCopy = (p: P) => (
  <svg {...s} {...p} width="14" height="14"><rect x="7" y="3" width="10" height="12" rx="1.5" transform="scale(.7)" /><rect x="3" y="7" width="10" height="12" rx="1.5" transform="scale(.7) translate(2,2)" /></svg>
);
