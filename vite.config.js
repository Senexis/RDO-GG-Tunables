/* eslint-disable no-undef */
import { execSync } from "node:child_process";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { sentryVitePlugin } from "@sentry/vite-plugin";

const production = process.env.NODE_ENV === "production";

const commitShort = production ? execSync("git rev-parse --short HEAD").toString().trim() : "dev";
const commitLong = production ? execSync("git rev-parse HEAD").toString().trim() : "dev";
const change = production ? execSync("git log -1 --pretty=%B").toString().trim() : "dev";

const sentryOrganization = production ? process.env.SENTRY_ORGANIZATION : null;
const sentryProject = production ? process.env.SENTRY_PROJECT : null;
const sentryAuthToken = production ? process.env.SENTRY_AUTH_TOKEN : null;
const sentryDsn = production ? process.env.SENTRY_DSN : null;

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    vue(),
    production && sentryVitePlugin({
      org: sentryOrganization,
      project: sentryProject,
      include: "./dist",
      authToken: sentryAuthToken,
      release: commitLong,
    }),
  ],
  define: {
    APP_CHANGE: JSON.stringify(change),
    APP_COMMIT_LONG: JSON.stringify(commitLong),
    APP_COMMIT_SHORT: JSON.stringify(commitShort),
    APP_COPYRIGHT_YEAR: JSON.stringify(new Date().getFullYear()),
    APP_UPDATED: JSON.stringify(new Date().toLocaleString('en-US')),
    SENTRY_DSN: JSON.stringify(sentryDsn),
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
