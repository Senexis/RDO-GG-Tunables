/* eslint-disable no-undef */
import { execSync } from "node:child_process";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { sentryVitePlugin } from "@sentry/vite-plugin";

const commit = execSync("git rev-parse --short HEAD").toString().trim();
const change = execSync("git log -1 --pretty=%B").toString().trim();

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    vue(),
    sentryVitePlugin({
      org: process.env.SENTRY_ORGANIZATION,
      project: process.env.SENTRY_PROJECT,
      include: "./dist",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
  define: {
    APP_VERSION: JSON.stringify(commit),
    APP_CHANGE: JSON.stringify(change),
    SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
