import { execSync } from "node:child_process";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const commit = execSync("git rev-parse --short HEAD").toString().trim();
const change = execSync("git log -1 --pretty=%B").toString().trim();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    APP_VERSION: JSON.stringify(commit),
    APP_CHANGE: JSON.stringify(change),
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
