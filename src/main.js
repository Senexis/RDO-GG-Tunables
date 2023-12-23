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
import hotkeys from 'hotkeys-js';
import confetti from 'canvas-confetti';

FloatingVue.options.distance = 10;
import 'floating-vue/dist/style.css';

import 'jsondiffpatch/formatters/styles/html.css';
import './assets/main.css';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

// Import specific icons from Font Awesome 6.
import { faAsterisk, faBug, faCloud, faPlus } from '@fortawesome/free-solid-svg-icons';
library.add(faAsterisk, faBug, faCloud, faPlus);

import { faXTwitter, faDiscord, faGithub, faPatreon } from '@fortawesome/free-brands-svg-icons';
library.add(faXTwitter, faDiscord, faGithub, faPatreon);

app.component('font-awesome-icon', FontAwesomeIcon);

// Define hotkeys
hotkeys('ctrl+k', (event) => {
  event.preventDefault();
  document.dispatchEvent(new CustomEvent('hotkey-search'));
});

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
      integrations: [
        new Sentry.BrowserTracing({ tracePropagationTargets: ['localhost', 'tunables.rdo.gg', /^\//] }),
        new Sentry.Replay({ blockAllMedia: false, maskAllInputs: false, maskAllText: false }),
      ],
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

// One of the downsides of being open source? You can't hide your surprises.
// Of course, there is no surprise here. So I don't know what this is about.
// If you do end up seeing this, happy holidays!
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

try {
  const today = new Date();
  const christmas = new Date(today.getFullYear(), 11, 24);
  const boxing = new Date(today.getFullYear(), 11, 26);

  if (today >= christmas && today <= boxing) {
    var duration = Number.POSITIVE_INFINITY;
    var animationEnd = Date.now() + duration;
    var skew = 1;

    (function frame() {
      var timeLeft = animationEnd - Date.now();
      var ticks = Math.max(200, 500 * (timeLeft / duration));
      skew = Math.max(0.8, skew - 0.001);

      confetti({
        particleCount: 1,
        startVelocity: 0,
        ticks: ticks,
        origin: {
          x: Math.random(),
          y: Math.random() * skew - 0.2,
        },
        colors: ['#ffffff'],
        shapes: ['circle'],
        gravity: randomInRange(0.4, 0.6),
        scalar: randomInRange(0.4, 1),
        drift: randomInRange(-0.4, 0.4),

        // Appear behind the content
        zIndex: -1,

        // Improve performance
        useWorker: true,

        // Allow the user to opt-out of the animation
        disableForReducedMotion: true,
      });

      if (timeLeft > 0) {
        requestAnimationFrame(frame);
      }
    })();
  }
} catch (error) {
  // This is just a fun little surprise. If it fails, it fails.
  // Of course, you'd be very sad to miss out on this surprise.
  console.log('Something happened while trying to surprise you with some snowfall. Happy holidays regardless! 🎄');
  console.error(error);
}
