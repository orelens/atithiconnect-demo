import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/atithiconnect-demo/",
  plugins: [react()],
  server: {
    host: true,
    port: 4179,
    allowedHosts: true,
    // @ts-expect-error Vite 7 preview/dev origin allowlist
    allowedDevOrigins: true,
  },
  preview: {
    host: true,
    port: 4179,
    allowedHosts: true,
    // @ts-expect-error Vite 7
    allowedDevOrigins: true,
  },
});
