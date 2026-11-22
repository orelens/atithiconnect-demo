// GitHub Pages helpers: SPA fallback + real 200 pages (with app manifests) for the staff apps.
import { readFileSync, writeFileSync } from "node:fs";
const B = "/atithiconnect-demo/";
const html = readFileSync("dist/index.html", "utf8");
writeFileSync("dist/404.html", html);
writeFileSync("dist/.nojekyll", "");
const apps = { reception: ["desk", "AtithiConnect Desk", "Atithi Desk"], owner: ["owner", "AtithiConnect Owner", "Atithi Owner"], kitchen: ["kitchen", "AtithiConnect Kitchen", "Atithi Kitchen"] };
for (const [route, [key, name, short]] of Object.entries(apps)) {
  const head = `<link rel="manifest" href="${B}pwa/${key}.webmanifest" />
    <link rel="apple-touch-icon" href="${B}pwa/${key}-apple-180.png" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-title" content="${short}" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />`;
  const page = html
    .replace(/<link rel="apple-touch-icon"[^>]*>/, head)
    .replace(/<title>[^<]*<\/title>/, `<title>${name}</title>`);
  writeFileSync(`dist/${route}.html`, page);
}
for (const route of ["guest", "staff"]) writeFileSync(`dist/${route}.html`, html);
console.log("postbuild: 404.html, .nojekyll, reception/owner/kitchen/guest/staff.html");
