/* eslint-disable no-undef */
import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "./App.vue";
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";

import "jsondiffpatch/dist/formatters-styles/html.css";
import "./assets/main.css";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

Sentry.init({
  app,
  dsn: SENTRY_DSN,
  integrations: [new BrowserTracing({ tracePropagationTargets: ["localhost", "tunables.rdo.gg", /^\//] }), new Sentry.Replay()],
  release: APP_COMMIT_LONG,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  tracesSampleRate: 0.3,
});

app.use(pinia);
app.mount("#app");
