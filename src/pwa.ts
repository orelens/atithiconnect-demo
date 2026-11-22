// Installable staff apps: Reception ("AtithiConnect Desk"), Owner and Kitchen.
// Guests never install anything: they scan the room QR and use the browser.
const B = import.meta.env.BASE_URL; // "/atithiconnect-demo/"

export type AppKey = "desk" | "owner" | "kitchen";
export const APPS: Record<AppKey, { name: string; route: string; icon: string }> = {
  desk: { name: "AtithiConnect Desk", route: "reception", icon: `${B}pwa/desk-192.png` },
  owner: { name: "AtithiConnect Owner", route: "owner", icon: `${B}pwa/owner-192.png` },
  kitchen: { name: "AtithiConnect Kitchen", route: "kitchen", icon: `${B}pwa/kitchen-192.png` },
};

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
let deferred: BIPEvent | null = null;
const listeners = new Set<() => void>();
export function onInstallChange(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; }
function emit() { listeners.forEach((f) => f()); }

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferred = e as BIPEvent; emit(); });
  window.addEventListener("appinstalled", () => { deferred = null; emit(); });
}

export const canPrompt = () => !!deferred;
export async function promptInstall() {
  if (!deferred) return false;
  const d = deferred;
  await d.prompt();
  const r = await d.userChoice.catch(() => ({ outcome: "dismissed" }));
  deferred = null; emit();
  return r.outcome === "accepted";
}
export const isStandalone = () =>
  window.matchMedia?.("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
export const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

function setLink(rel: string, href: string) {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) { el = document.createElement("link"); el.rel = rel; document.head.appendChild(el); }
  if (el.getAttribute("href") !== href) el.setAttribute("href", href);
}
function setMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) { el = document.createElement("meta"); el.name = name; document.head.appendChild(el); }
  el.content = content;
}

/** Point the page at the right app manifest + register the scoped service worker. */
export function useAppShell(key: AppKey | null) {
  if (typeof document === "undefined") return;
  if (!key) {
    document.querySelector('link[rel="manifest"]')?.remove();
    return;
  }
  const app = APPS[key];
  setLink("manifest", `${B}pwa/${key}.webmanifest`);
  setLink("apple-touch-icon", `${B}pwa/${key}-apple-180.png`);
  setMeta("apple-mobile-web-app-capable", "yes");
  setMeta("mobile-web-app-capable", "yes");
  setMeta("apple-mobile-web-app-title", app.name.replace("AtithiConnect ", "Atithi "));
  setMeta("apple-mobile-web-app-status-bar-style", "black-translucent");
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register(`${B}sw.js`, { scope: `${B}${app.route}` }).catch(() => {});
  }
}
