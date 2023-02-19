import { fileURLToPath, URL } from "node:url";
import { version } from "./package.json";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    copyPublicDir: false,
    emptyOutDir: false,
    outDir: fileURLToPath(new URL("../docs/tunables", import.meta.url)),
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL("./changes.html", import.meta.url)),
      },
    },
  },
  plugins: [vue()],
  define: {
    APP_VERSION: JSON.stringify(version),
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    open: "/tunables/changes.html",
  },
  base: "/tunables/",
});
