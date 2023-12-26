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
  let check = false;
  const today = new Date();

  const dates = [
    {
      // Christmas
      from: new Date(today.getFullYear(), 11, 24, 0, 0, 0),
      to: new Date(today.getFullYear(), 11, 26, 23, 59, 59),
    },
    {
      // New Year's
      from: new Date(today.getFullYear(), 11, 31, 0, 0, 0),
      to: new Date(today.getFullYear() + 1, 0, 1, 23, 59, 59),
    },
  ];

  for (const date of dates) {
    if (today >= date.from && today <= date.to) {
      check = true;
      break;
    }
  }

  if (check) {
    const box = confetti.shapeFromPath({
      path: 'M190.5 68.8L225.3 128H224 152c-22.1 0-40-17.9-40-40s17.9-40 40-40h2.2c14.9 0 28.8 7.9 36.3 20.8zM64 88c0 14.4 3.5 28 9.6 40H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H480c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H438.4c6.1-12 9.6-25.6 9.6-40c0-48.6-39.4-88-88-88h-2.2c-31.9 0-61.5 16.9-77.7 44.4L256 85.5l-24.1-41C215.7 16.9 186.1 0 154.2 0H152C103.4 0 64 39.4 64 88zm336 0c0 22.1-17.9 40-40 40H288h-1.3l34.8-59.2C329.1 55.9 342.9 48 357.8 48H360c22.1 0 40 17.9 40 40zM32 288V464c0 26.5 21.5 48 48 48H224V288H32zM288 512H432c26.5 0 48-21.5 48-48V288H288V512z',
    });

    const cane = confetti.shapeFromPath({
      path: 'M348.8 131.5c3.7-2.3 7.9-3.5 12.2-3.5c12.7 0 23 10.3 23 23v5.6c0 9.9-5.1 19.1-13.5 24.3L30.1 393.7C.1 412.5-9 451.9 9.7 481.9s58.2 39.1 88.2 20.4L438.4 289.5c45.8-28.6 73.6-78.8 73.6-132.8V151C512 67.6 444.4 0 361 0c-28.3 0-56 8-80.1 23L254.1 39.7c-30 18.7-39.1 58.2-20.4 88.2s58.2 39.1 88.2 20.4l26.8-16.8zM298.4 49.8c9.2-5.7 19.1-10.1 29.4-13.1L348 97.5c-5.7 1.4-11.2 3.7-16.3 6.8l-12.6 7.9L298.4 49.8zm88.5 52.7l46.2-46.2c8.5 6.5 16.1 14.1 22.6 22.6l-46.2 46.2c-5.1-9.6-13-17.5-22.6-22.6zm28.9 59.3l61.6 20.5c-2.2 10.5-5.8 20.7-10.5 30.2l-62-20.7c6.2-8.8 10.1-19.1 11-30.1zm-86.1 82.5l60.4 37.7-30.2 18.9-60.4-37.7 30.2-18.9zm-107.2 67l60.4 37.7-30.2 18.9-60.4-37.7 30.2-18.9zM119.3 375.7l60.4 37.7-30.2 18.9L89.1 394.6l30.2-18.9z',
    });

    const flake = confetti.shapeFromPath({
      path: 'M224 0c17.7 0 32 14.3 32 32V62.1l15-15c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-49 49v70.3l61.4-35.8 17.7-66.1c3.4-12.8 16.6-20.4 29.4-17s20.4 16.6 17 29.4l-5.2 19.3 23.6-13.8c15.3-8.9 34.9-3.7 43.8 11.5s3.8 34.9-11.5 43.8l-25.3 14.8 21.7 5.8c12.8 3.4 20.4 16.6 17 29.4s-16.6 20.4-29.4 17l-67.7-18.1L287.5 256l60.9 35.5 67.7-18.1c12.8-3.4 26 4.2 29.4 17s-4.2 26-17 29.4l-21.7 5.8 25.3 14.8c15.3 8.9 20.4 28.5 11.5 43.8s-28.5 20.4-43.8 11.5l-23.6-13.8 5.2 19.3c3.4 12.8-4.2 26-17 29.4s-26-4.2-29.4-17l-17.7-66.1L256 311.7v70.3l49 49c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-15-15V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V449.9l-15 15c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l49-49V311.7l-61.4 35.8-17.7 66.1c-3.4 12.8-16.6 20.4-29.4 17s-20.4-16.6-17-29.4l5.2-19.3L48.1 395.6c-15.3 8.9-34.9 3.7-43.8-11.5s-3.7-34.9 11.5-43.8l25.3-14.8-21.7-5.8c-12.8-3.4-20.4-16.6-17-29.4s16.6-20.4 29.4-17l67.7 18.1L160.5 256 99.6 220.5 31.9 238.6c-12.8 3.4-26-4.2-29.4-17s4.2-26 17-29.4l21.7-5.8L15.9 171.6C.6 162.7-4.5 143.1 4.4 127.9s28.5-20.4 43.8-11.5l23.6 13.8-5.2-19.3c-3.4-12.8 4.2-26 17-29.4s26 4.2 29.4 17l17.7 66.1L192 200.3V129.9L143 81c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l15 15V32c0-17.7 14.3-32 32-32z',
    });

    const man = confetti.shapeFromPath({
      path: 'M341.1 140.6c-2 3.9-1.6 8.6 1.2 12c7 8.5 12.9 18.1 17.2 28.4L408 160.2V120c0-13.3 10.7-24 24-24s24 10.7 24 24v19.6l22.5-9.7c12.2-5.2 26.3 .4 31.5 12.6s-.4 26.3-12.6 31.5l-56 24-73.6 31.5c-.5 9.5-2.1 18.6-4.8 27.3c-1.2 3.8-.1 8 2.8 10.8C396.7 296.9 416 338.2 416 384c0 44.7-18.3 85-47.8 114.1c-9.9 9.7-23.7 13.9-37.5 13.9H181.3c-13.9 0-27.7-4.2-37.5-13.9C114.3 469 96 428.7 96 384c0-45.8 19.3-87.1 50.1-116.3c2.9-2.8 4-6.9 2.8-10.8c-2.7-8.7-4.3-17.9-4.8-27.3L70.5 198.1l-56-24C2.4 168.8-3.3 154.7 1.9 142.5s19.3-17.8 31.5-12.6L56 139.6V120c0-13.3 10.7-24 24-24s24 10.7 24 24v40.2L152.6 181c4.3-10.3 10.1-19.9 17.2-28.4c2.8-3.4 3.3-8.1 1.2-12C164 127.2 160 112.1 160 96c0-53 43-96 96-96s96 43 96 96c0 16.1-4 31.2-10.9 44.6zM224 96a16 16 0 1 0 0-32 16 16 0 1 0 0 32zm48 128a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zm-16 80a16 16 0 1 0 0-32 16 16 0 1 0 0 32zm16 48a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zM288 96a16 16 0 1 0 0-32 16 16 0 1 0 0 32zm-48 24v3.2c0 3.2 .8 6.3 2.3 9l9 16.9c.9 1.7 2.7 2.8 4.7 2.8s3.8-1.1 4.7-2.8l9-16.9c1.5-2.8 2.3-5.9 2.3-9V120c0-8.8-7.2-16-16-16s-16 7.2-16 16z',
    });

    let skew = 1;

    (function frame() {
      skew = Math.max(0.8, skew - 0.001);

      confetti({
        particleCount: 1,
        startVelocity: 0,
        ticks: 300,
        origin: {
          x: Math.random(),
          y: Math.random() * skew - 0.2,
        },
        colors: ['#cbd5e1'],
        shapes: [box, cane, flake, man],
        gravity: randomInRange(0.4, 0.6),
        scalar: randomInRange(0.4, 1.2),
        drift: randomInRange(-0.4, 0.4),

        // Appear behind the content
        zIndex: -1,

        // Improve performance
        useWorker: true,

        // Allow the user to opt-out of the animation
        disableForReducedMotion: true,
      });

      requestAnimationFrame(frame);
    })();
  }
} catch (error) {
  // This is just a fun little surprise. If it fails, it fails.
  // Of course, you'd be very sad to miss out on this surprise.
  console.log('Something happened while trying to surprise you with some snowfall. Happy holidays regardless! 🎄');
  console.error(error);
}
