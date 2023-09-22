/* eslint-disable no-undef */
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import * as Sentry from '@sentry/vue';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import FloatingVue from 'floating-vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

FloatingVue.options.distance = 10;
import 'floating-vue/dist/style.css';

import 'jsondiffpatch/dist/formatters-styles/html.css';
import './assets/main.css';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

// Import specific icons from Font Awesome 6.
import { faAsterisk, faBug, faPlus } from '@fortawesome/free-solid-svg-icons';
library.add(faAsterisk, faBug, faPlus);

import { faXTwitter, faDiscord, faGithub, faPatreon } from '@fortawesome/free-brands-svg-icons';
library.add(faXTwitter, faDiscord, faGithub, faPatreon);

app.component('font-awesome-icon', FontAwesomeIcon);

// Concerned about your privacy? See https://rdo.gg/privacy/.
// We use this to link Sentry issue data to a consistent user.
const fpPromise = FingerprintJS.load({ monitoring: false });

(async () => {
  const fp = await fpPromise;
  const result = await fp.get();

  // We care about your privacy.
  // To opt out of being tracked, enable the "Do Not Track" setting in your browser.
  let userId = result.visitorId;
  if (navigator.doNotTrack === '1') {
    userId = 'do-not-track';
  }

  // Concerned about your privacy? See https://rdo.gg/privacy/.
  // We use this to be able to fix issues that occur in production.
  if (SENTRY_DSN) {
    Sentry.init({
      app,
      dsn: SENTRY_DSN,
      integrations: [new Sentry.BrowserTracing({ tracePropagationTargets: ['localhost', 'tunables.rdo.gg', /^\//] }), new Sentry.Replay()],
      release: APP_COMMIT_LONG,
      replaysOnErrorSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      tracesSampleRate: 0.3,
      trackComponents: true,
      initialScope: { user: { id: userId } },
    });
  }

  app.use(pinia);
  app.use(FloatingVue);
  app.mount('#app');
})();
