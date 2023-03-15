<script setup>
import * as Sentry from "@sentry/vue";
import { create, formatters } from "jsondiffpatch/dist/jsondiffpatch.umd.slim.js";
import { computed, onMounted, ref, watch } from "vue";

import {
  ArrowPathIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  EyeSlashIcon,
  NoSymbolIcon,
} from "@heroicons/vue/24/outline";

import { useStore } from "./stores/settings.js";

import Banner from "./components/Banner.vue";
import Card from "./components/Cards/Card.vue";
import CardFooter from "./components/Cards/CardFooter.vue";
import CardHeader from "./components/Cards/CardHeader.vue";
import DownloadModal from "./components/Modals/DownloadModal.vue";
import ErrorModal from "./components/Modals/ErrorModal.vue";
import NavBar from "./components/NavBar.vue";
import QuickView from "./components/QuickView.vue";
import SettingsModal from "./components/Modals/SettingsModal.vue";
import SettingsModalSelect from "./components/Modals/SettingsModalSelect.vue";
import SettingsModalToggle from "./components/Modals/SettingsModalToggle.vue";

const settings = useStore();
const url = new URL(window.location);

// eslint-disable-next-line no-undef
const appChange = APP_CHANGE;

// eslint-disable-next-line no-undef
const appCommitShort = APP_COMMIT_SHORT;

// eslint-disable-next-line no-undef
const appCommitLong = APP_COMMIT_LONG;

/**
 * Contains the selected game.
 *
 * @type {import("vue").Ref<"gta" | "rdo">}
 */
const game = ref(url.searchParams.get("game") || "gta");

/**
 * Contains the selected platform.
 *
 * @type {import("vue").Ref<"pcros" | "ps4" | "ps5" | "xboxone" | "xboxsx">}
 */
const platform = ref(url.searchParams.get("platform") || "pcros");

/**
 * Contains the selected previous tunables hash.
 *
 * @type {import("vue").Ref<string | null>}
 */
const previous = ref(url.searchParams.get("previous") || null);

/**
 * Contains the selected latest tunables hash.
 *
 * @type {import("vue").Ref<string | null>}
 */
const latest = ref(url.searchParams.get("latest") || null);

/**
 * Contains the difference between the previous and latest tunables in HTML.
 *
 * @type {import("vue").Ref<Object>}
 */
const difference = ref({
  loading: true,
  html: null,
});

/**
 * Stores the API data needed for displaying tunables.
 *
 * @type {import("vue").Ref<Object>}
 */
const tunables = ref({
  _cache: {},
  all: null,
  latest: null,
  previous: null,
});

/**
 * Stores the data needed for displaying download modals.
 *
 * @type {import("vue").Ref<Object>}
 */
const downloadModal = ref({
  show: false,
});

/**
 * Stores the data needed for displaying settings modals.
 *
 * @type {import("vue").Ref<Object>}
 */
const settingsModal = ref({
  show: false,
  verboseDetail: false,
});

/**
 * Stores the data needed for displaying error modals.
 *
 * @type {import("vue").Ref<Object>}
 */
const errorModal = ref({
  show: false,
  body: null,
});

/**
 * Gets the cache key used for the all tunables URL.
 *
 * @type {import("vue").ComputedRef<number>}
 */
const allUrlCacheKey = computed(() => Math.floor(Date.now() / 1000));

/**
 * Gets the cache key used for the previous/latest tunables URLs.
 *
 * @type {import("vue").ComputedRef<number>}
 */
const tunableUrlCacheKey = computed(() => tunables.value.all?.updated ?? allUrlCacheKey.value);

/**
 * The URL to retrieve the meta file for tunables.
 *
 * @type {import("vue").ComputedRef<string>}
 */
const allUrl = computed(() => `https://api.rdo.gg/tunables/${game.value}/${platform.value}/all.json?${allUrlCacheKey.value}`);

/**
 * The URL to retrieve the previous tunables.
 *
 * @type {import("vue").ComputedRef<string>}
 */
const previousUrl = computed(
  () => `https://api.rdo.gg/tunables/${game.value}/${platform.value}/${previous.value}.json?${tunableUrlCacheKey.value}`
);

/**
 * The URL to retrieve the latest tunables.
 *
 * @type {import("vue").ComputedRef<string>}
 */
const latestUrl = computed(
  () => `https://api.rdo.gg/tunables/${game.value}/${platform.value}/${latest.value}.json?${tunableUrlCacheKey.value}`
);

/**
 * The currently active (shown) banner.
 *
 * @type {import("vue").ComputedRef<string | null>}
 */
const activeBanner = computed(() => {
  const banners = ["new-site", "new-quick-view", "open-source"];
  const activeBanners = banners.filter((banner) => !settings.bannersDismissed.includes(banner));
  return activeBanners.length > 0 ? activeBanners[0] : null;
});

/**
 * The index of the latest tunables in the all tunables array.
 *
 * @type {import("vue").ComputedRef<number | null>}
 */
const latestIndex = computed(() => {
  try {
    const all = tunables.value.all?.all;
    if (!all) return null;

    const latestIndex = all.findIndex((item) => item.hash === latest.value);
    if (latestIndex === -1) return null;

    return latestIndex;
  } catch (error) {
    Sentry.captureException(error);
    showErrorModal("An unknown error occurred. (C6CFD988)");
    return null;
  }
});

/**
 * Whether the previous tunables button is disabled.
 *
 * @type {import("vue").ComputedRef<boolean>}
 */
const previousDisabled = computed(() => {
  try {
    if (difference.value.loading) return true;

    const all = tunables.value.all?.all;
    if (!all || latestIndex.value === null) return true;

    const previousIndex = latestIndex.value + 1;
    return previousIndex + 1 >= all.length;
  } catch (error) {
    Sentry.captureException(error);
    showErrorModal("An unknown error occurred. (AB5076EA)");
    return null;
  }
});

/**
 * Whether the next tunables button is disabled.
 *
 * @type {import("vue").ComputedRef<boolean>}
 */
const nextDisabled = computed(() => {
  try {
    if (difference.value.loading) return true;

    const all = tunables.value.all?.all;
    if (!all || latestIndex.value === null) return true;

    const previousIndex = latestIndex;
    return previousIndex.value - 1 < 0;
  } catch (error) {
    Sentry.captureException(error);
    showErrorModal("An unknown error occurred. (063AE30A)");
    return null;
  }
});

/**
 * Whether the latest tunables button is disabled.
 *
 * @type {import("vue").ComputedRef<boolean>}
 */
const latestDisabled = computed(() => {
  try {
    if (difference.value.loading) return true;

    const all = tunables.value.all?.all;
    if (!all || latestIndex.value === null) return true;

    const previousIndex = latestIndex;
    return previousIndex.value - 1 < 0;
  } catch (error) {
    Sentry.captureException(error);
    showErrorModal("An unknown error occurred. (38FD1D5D)");
    return null;
  }
});

/**
 * The available game badge texts.
 *
 * @type {import("vue").ComputedRef<Object>}
 */
const gameBadges = computed(() => ({
  gta: { label: "GTA", background: "gta" },
  rdo: { label: "RDO", background: "rdo" },
}));

/**
 * Gets the badge label for a game.
 *
 * @returns {string}
 */
function getGameBadgeLabel() {
  const value = game.value;
  return gameBadges.value[value]?.label ?? value;
}

/**
 * Gets the badge background for a game.
 *
 * @returns {string}
 */
function getGameBadgeBackground() {
  const value = game.value;
  const type = gameBadges.value[value]?.background ?? "primary";
  return `badge-${type}`;
}

/**
 * The available game options.
 *
 * @type {import("vue").ComputedRef<Array>}
 */
const gameOptions = computed(() => [
  { value: "gta", label: "GTA Online" },
  { value: "rdo", label: "Red Dead Online" },
]);

/**
 * The available platform badge texts.
 *
 * @type {import("vue").ComputedRef<Object>}
 */
const platformBadges = computed(() => ({
  pcros: { label: "PC", background: "pc" },
  ps4: { label: "PS4", background: "playstation" },
  ps5: { label: "PS5", background: "playstation" },
  xboxone: { label: "One", background: "xbox" },
  xboxsx: { label: "S|X", background: "xbox" },
}));

/**
 * Gets the badge label for a platform.
 *
 * @returns {string}
 */
function getPlatformBadgeLabel() {
  const value = platform.value;
  return platformBadges.value[value]?.label ?? value;
}

/**
 * Gets the badge background for a platform.
 *
 * @returns {string}
 */
function getPlatformBadgeBackground() {
  const value = platform.value;
  const type = platformBadges.value[value]?.background ?? "primary";
  return `badge-${type}`;
}

/**
 * The available platform options.
 *
 * @type {import("vue").ComputedRef<Array>}
 */
const platformOptions = computed(() => [
  {
    value: "pcros",
    label: "PC",
    hidden: false,
  },
  {
    value: "ps4",
    label: "PlayStation 4",
    hidden: game.value !== "gta",
  },
  {
    value: "ps5",
    label: "PlayStation 5",
    hidden: game.value !== "gta",
  },
  {
    value: "xboxone",
    label: "Xbox One",
    hidden: game.value !== "gta",
  },
  {
    value: "xboxsx",
    label: "Xbox Series S|X",
    hidden: game.value !== "gta",
  },
]);

/**
 * The provider text displayed in the card footer.
 *
 * @type {import("vue").ComputedRef<string>}
 */
const footerProvider = computed(() => {
  try {
    if (!tunables.value.latest) {
      return "";
    }

    const provider = tunables.value.latest.meta.provider;
    const thanks = tunables.value.latest.meta.special_thanks.join(", ");

    return `Provider: ${provider}. Special thanks: ${thanks}.`;
  } catch (error) {
    Sentry.captureException(error);
    showErrorModal("An unknown error occurred. (D0DDD7CA)");
    return null;
  }
});

/**
 * The updated text displayed in the card footer.
 *
 * @type {import("vue").ComputedRef<string>}
 */
const footerUpdated = computed(() => {
  try {
    if (!tunables.value.all) {
      return "";
    }

    const date = new Date(tunables.value.all.updated * 1000).toLocaleString("en-US", {
      dateStyle: "short",
      timeStyle: "short",
    });

    return `Updated: ${date}`;
  } catch (error) {
    Sentry.captureException(error);
    showErrorModal("An unknown error occurred. (2DE28AB1)");
    return null;
  }
});

/**
 * The page title.
 *
 * @type {import("vue").ComputedRef<string>}
 */
const title = computed(() => {
  try {
    if (errorModal.value.title) {
      return errorModal.value.title;
    }

    if (!tunables.value.latest || !tunables.value.previous) {
      return "Loading...";
    }

    const previousDate = tunables.value.previous.date;
    const latestDate = tunables.value.latest.date;

    return `Tunables changes between ${previousDate} and ${latestDate}`;
  } catch (error) {
    Sentry.captureException(error);
    showErrorModal("An unknown error occurred. (72AAD81D)");
    return null;
  }
});

const files = computed(() => {
  try {
    if (!tunables.value.all?.all) {
      return [];
    }

    return tunables.value.all?.all;
  } catch (error) {
    Sentry.captureException(error);
    showErrorModal("An unknown error occurred. (FAD94F03)");
    return null;
  }
});

/**
 * Ensures that when the game is changed, the platform is set to the default.
 * In addition, triggers a game update to update the difference display.
 */
watch(game, () => {
  try {
    Sentry.setTag("game", game.value);
    if (platform.value !== "pcros") {
      platform.value = "pcros";
    } else {
      handleGameUpdate();
    }
  } catch (error) {
    Sentry.captureException(error);
    showErrorModal("An unknown error occurred. (3F39BDB8)");
  }
});

/**
 * Triggers a game update to update the difference display.
 */
watch(platform, () => {
  try {
    Sentry.setTag("platform", platform.value);
    handleGameUpdate();
  } catch (error) {
    Sentry.captureException(error);
    showErrorModal("An unknown error occurred. (F37CAEAF)");
  }
});

/**
 * Triggers a game update to update the difference display.
 */
watch(title, (state) => {
  try {
    document.title = state;
  } catch (error) {
    Sentry.captureException(error);
    showErrorModal("An unknown error occurred. (8C4AE3EA)");
  }
});

/**
 * Triggers when the error modal is closed to clear its data.
 */
watch(
  errorModal,
  (state) => {
    try {
      if (state.show) return;
      setTimeout(() => {
        if (errorModal.value.show) return;
        errorModal.value.title = null;
        errorModal.value.body = null;
      }, 500);
    } catch (error) {
      Sentry.captureException(error);
      showErrorModal("An unknown error occurred. (E6B7C58D)");
    }
  },
  { deep: true }
);

/**
 * Triggers a game update to initialize the difference display.
 */
onMounted(() => {
  try {
    handleGameUpdate(true);
  } catch (error) {
    Sentry.captureException(error);
    showErrorModal("An unknown error occurred. (6D1FCF8B)");
  }
});

/**
 * The logic to execute when the game is updated.
 *
 * @param {boolean} init Whether or not the app is being initialized.
 * @returns {Promise<void>}
 */
async function handleGameUpdate(init = false) {
  try {
    // Step 0. Reset the difference display.
    difference.value.loading = true;
    difference.value.html = null;

    // Step 1. Retrieve the meta file for tunables.
    try {
      tunables.value.all = await cachedRequest(`${game.value}-${platform.value}`, allUrl.value);
    } catch (error) {
      Sentry.captureException(error);
      showErrorModal("We were unable to retrieve some required data needed to display the tunables. Please try again later.");
      return;
    }

    // Step 2. Update state if the hashes have not yet been set by the query string.
    if (!init || !previous.value) {
      previous.value = tunables.value.all.previous?.hash;
    }

    if (!init || !latest.value) {
      latest.value = tunables.value.all.latest?.hash;
    }

    // Step 3. Update the query string.
    updateQuery();

    // Step 4. Retrieve the previous tunables.
    try {
      tunables.value.previous = await cachedRequest(`${game.value}-${platform.value}-${previous.value}`, previousUrl.value);
    } catch (error) {
      Sentry.captureException(error);
      showErrorModal(
        "We were unable to retrieve the previous tunables. If the tunables were recently updated, please try again in a few minutes."
      );
      return;
    }

    // Step 5. Retrieve the latest tunables.
    try {
      tunables.value.latest = await cachedRequest(`${game.value}-${platform.value}-${latest.value}`, latestUrl.value);
    } catch (error) {
      Sentry.captureException(error);
      showErrorModal(
        "We were unable to retrieve the latest tunables. If the tunables were recently updated, please try again in a few minutes."
      );
      return;
    }

    // Step 6. Update the difference display.
    updateDifference();
  } catch (error) {
    Sentry.captureException(error);
    showErrorModal("An unknown error occurred. (E36D0DE5)");
  }
}

/**
 * Updates the difference display.
 *
 * @returns {void}
 */
function updateDifference() {
  try {
    difference.value.loading = true;
    difference.value.html = null;

    const previousJson = tunables.value.previous?.contents;
    const latestJson = tunables.value.latest?.contents;

    const previousFormatted = formatJson(previousJson);
    const latestFormatted = formatJson(latestJson);

    const diffPatcher = create({
      arrays: { detectMove: true },
      textDiff: { minLength: 60 },
    });

    const delta = diffPatcher.diff(previousFormatted, latestFormatted);

    difference.value.html = formatters.html.format(delta, previousFormatted);
    difference.value.loading = false;
  } catch (error) {
    Sentry.captureException(error);
    showErrorModal("An unknown error occurred. (6FB55B6B)");
  }
}

/**
 * Updates the query string.
 *
 * @returns {void}
 */
function updateQuery() {
  try {
    const url = new URL(window.location);

    url.searchParams.set("game", game.value);
    url.searchParams.set("platform", platform.value);

    if (previous.value) {
      url.searchParams.set("previous", previous.value);
    } else {
      url.searchParams.delete("previous");
    }

    if (latest.value) {
      url.searchParams.set("latest", latest.value);
    } else {
      url.searchParams.delete("latest");
    }

    window.history.pushState({}, "", url);
  } catch (error) {
    Sentry.captureException(error);
    showErrorModal("An unknown error occurred. (9C38DA33)");
  }
}

/**
 * Moves the comparison to the previous 2 tunables.
 *
 * @returns {void}
 */
function handlePreviousClick() {
  try {
    if (previousDisabled.value) return;

    const all = tunables.value.all?.all;
    if (!all) return;

    const latestIndex = all.findIndex((item) => item.hash === latest.value);
    if (latestIndex === -1) return;

    const previousIndex = latestIndex + 1;
    if (previousIndex + 1 >= all.length) return;

    previous.value = all[previousIndex + 1].hash;
    latest.value = all[previousIndex].hash;
    handleGameUpdate(true);
  } catch (error) {
    Sentry.captureException(error);
    showErrorModal("An unknown error occurred. (484502F6)");
  }
}

/**
 * Moves the comparison to the next 2 tunables.
 *
 * @returns {void}
 */
function handleNextClick() {
  try {
    if (nextDisabled.value) return;

    const all = tunables.value.all?.all;
    if (!all) return;

    const latestIndex = all.findIndex((item) => item.hash === latest.value);
    if (latestIndex === -1) return;

    const previousIndex = latestIndex;
    if (previousIndex - 1 < 0) return;

    previous.value = all[previousIndex].hash;
    latest.value = all[previousIndex - 1].hash;
    handleGameUpdate(true);
  } catch (error) {
    Sentry.captureException(error);
    showErrorModal("An unknown error occurred. (1B375526)");
  }
}

/**
 * Moves the comparison to the latest and previous tunables.
 *
 * @returns {void}
 */
function handleLatestClick() {
  try {
    if (nextDisabled.value) return;

    const all = tunables.value.all?.all;
    if (!all) return;

    previous.value = all[1].hash;
    latest.value = all[0].hash;
    handleGameUpdate(true);
  } catch (error) {
    Sentry.captureException(error);
    showErrorModal("An unknown error occurred. (F44CB414)");
  }
}

/**
 * Resets the settings to their default values.
 *
 * @returns {void}
 */
function handleResetSettingsClick() {
  try {
    settings.$reset();
    settingsModal.value.show = false;
  } catch (error) {
    Sentry.captureException(error);
    showErrorModal("An unknown error occurred. (64594DC6)");
  }
}

/**
 * Retrieves a cached request or retrieves the request if it is not cached.
 *
 * @param {string} key The key to use for caching.
 * @param {string} url The URL to retrieve.
 * @returns {Promise<any>}
 */
async function cachedRequest(key, url) {
  if (!tunables.value._cache[key]) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to retrieve ${url}: ${response.status} ${response.statusText}`);
    }

    tunables.value._cache[key] = await response.json();
  }

  return tunables.value._cache[key];
}

/**
 * Formats a JSON object.
 *
 * @param {any} json The JSON object to format.
 * @param {string} [parentKey=null] The parent key.
 * @returns {any}
 */
function formatJson(json, parentKey = null) {
  try {
    for (const key in json) {
      if (parentKey === "tunables" && typeof json[key] !== "object") {
        if (!json[0]) {
          json[0] = {};
        }

        json[0][key] = json[key];
        delete json[key];
      }

      if (typeof json[key] === "object") {
        json[key] = formatJson(json[key], key);
      }
    }

    return json;
  } catch (error) {
    Sentry.captureException(error);
    showErrorModal("An unknown error occurred. (896DFD93)");
  }
}

/**
 * Shows an error modal.
 *
 * @param {string} body The body of the error modal.
 * @returns {void}
 */
function showErrorModal(body) {
  try {
    errorModal.value.body = body;
    errorModal.value.show = true;
  } catch (error) {
    Sentry.captureException(error);
  }
}
</script>

<template>
  <header>
    <NavBar @configure="settingsModal.show = true" @download="downloadModal.show = true"></NavBar>
  </header>

  <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <QuickView :loading="difference.loading" :tunables="tunables?.latest?.contents?.tunables" @error="showErrorModal" />

    <Card>
      <template #header>
        <CardHeader class="flex flex-row items-center justify-between">
          <h1 class="truncate">
            <span :class="getGameBadgeBackground()" class="badge mr-2">{{ getGameBadgeLabel() }}</span>
            <span :class="getPlatformBadgeBackground()" class="badge mr-2">{{ getPlatformBadgeLabel() }}</span>
            <span>{{ title }}</span>
          </h1>
          <div class="whitespace-nowrap">
            <button
              @click="handlePreviousClick"
              :disabled="previousDisabled"
              type="button"
              class="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky disabled:opacity-50 disabled:pointer-events-none"
            >
              <span class="sr-only">Previous tunables</span>
              <ChevronLeftIcon class="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              @click="handleNextClick"
              :disabled="nextDisabled"
              type="button"
              class="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky disabled:opacity-50 disabled:pointer-events-none"
            >
              <span class="sr-only">Next tunables</span>
              <ChevronRightIcon class="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              @click="handleLatestClick"
              :disabled="latestDisabled"
              type="button"
              class="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky disabled:opacity-50 disabled:pointer-events-none"
            >
              <span class="sr-only">Latest tunables</span>
              <ChevronDoubleRightIcon class="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </CardHeader>
      </template>
      <template #default>
        <div class="bg-slate-900 px-2 py-2 sm:p-4 overflow-x-auto overflow-y-auto max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-190px)]">
          <template v-if="!difference.loading">
            <template v-if="difference.html">
              <div
                :class="[
                  settings.added ? '' : 'hide-added',
                  settings.deleted ? '' : 'hide-deleted',
                  settings.modified ? '' : 'hide-modified',
                  settings.unchanged ? '' : 'hide-unchanged',
                  settings.bonus ? '' : 'hide-bonus',
                  settings.content ? '' : 'hide-content',
                  settings.tunables ? '' : 'hide-tunables',
                  settings.verbose ? '' : 'hide-verbose',
                ]"
                v-html="difference.html"
              ></div>
            </template>
            <template v-else>
              <div class="flex flex-col items-center justify-center gap-2 p-4">
                <NoSymbolIcon class="block h-12 w-12" aria-hidden="true" />
                <p class="text-lg font-medium">No differences detected</p>
              </div>
            </template>
          </template>
          <template v-else>
            <div class="flex flex-col items-center justify-center gap-2 p-4">
              <ArrowPathIcon class="block animate-spin h-12 w-12" aria-hidden="true" />
              <p class="text-lg font-medium">Loading...</p>
            </div>
          </template>
        </div>
      </template>
      <template #footer>
        <CardFooter class="sm:flex items-center justify-between text-sm leading-tight gap-2">
          <div class="truncate">{{ footerProvider }}</div>
          <div class="truncate sm:flex-shrink-0">{{ footerUpdated }}</div>
        </CardFooter>
      </template>
    </Card>

    <div class="mt-8 border-t border-slate-100/10 py-4 text-xs leading-5 text-slate-500 sm:flex sm:items-center sm:justify-between">
      <p>&copy; {{ new Date().getFullYear() }} RDO.GG. All rights reserved.</p>
      <div class="flex space-x-4">
        <a href="https://rdo.gg/privacy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        <a href="https://rdo.gg/terms/" target="_blank" rel="noopener noreferrer">Terms of Service</a>
        <a href="https://github.com/Senexis/RDO-GG-Tunables/blob/main/LICENSE.md" target="_blank" rel="noopener noreferrer">License</a>
      </div>
    </div>
  </main>

  <Banner id="new-site" :show="activeBanner === 'new-site'">
    Welcome to the new website! Check out all the settings using the
    <Cog6ToothIcon class="inline w-5 h-5" /> button.<br />
    <span class="text-sm text-slate-300">
      Tip: Looking for items like <code class="text-inherit">8B7D3320</code>? Toggle the "Verbose Items" setting.
    </span>
  </Banner>

  <Banner id="new-quick-view" :show="activeBanner === 'new-quick-view'">
    Newly added: the Quick View panel! See some popular items at a glance. Feel free to hide it using the
    <EyeSlashIcon class="inline w-5 h-5" /> button.<br />
    <span class="text-sm text-slate-300">
      Tip: Change your mind? You can always re-enable the Quick View panel in the settings menu (<Cog6ToothIcon class="inline w-5 h-5" />).
    </span>
  </Banner>

  <Banner
    id="open-source"
    :show="activeBanner === 'open-source'"
    button-text="Visit GitHub"
    button-link="https://github.com/Senexis/RDO-GG-Tunables"
    :button-external="true"
  >
    This website is now open source! Feel free to browse or contribute to the project on GitHub.
  </Banner>

  <ErrorModal :open="errorModal.show" @close="errorModal.show = false" @confirm="errorModal.show = false">
    {{ errorModal.body }}
  </ErrorModal>

  <DownloadModal :files="files" :open="downloadModal.show" @close="downloadModal.show = false"> </DownloadModal>

  <SettingsModal
    :open="settingsModal.show"
    @close="settingsModal.show = false"
    :change="appChange"
    :commitShort="appCommitShort"
    :commitLong="appCommitLong"
  >
    <h3 class="font-lg font-bold pb-2 border-b-2 border-slate-600">General</h3>

    <div class="divide-y divide-slate-600 mb-4">
      <SettingsModalSelect v-model="game" :options="gameOptions">
        <template #title>Game</template>
        <template #description> Select the game to compare tunables for. </template>
      </SettingsModalSelect>
      <SettingsModalSelect v-model="platform" :options="platformOptions">
        <template #title>Platform</template>
        <template #description> Select the platform to compare tunables for. </template>
      </SettingsModalSelect>
    </div>

    <h3 class="font-lg font-bold pb-2 border-b-2 border-slate-600">Activity</h3>

    <div class="divide-y divide-slate-600 mb-4">
      <SettingsModalToggle v-model="settings.added">
        <template #title>Added</template>
        <template #description> Whether to show items that have been added. </template>
      </SettingsModalToggle>
      <SettingsModalToggle v-model="settings.deleted">
        <template #title>Deleted</template>
        <template #description> Whether to show items that have been deleted. </template>
      </SettingsModalToggle>
      <SettingsModalToggle v-model="settings.modified">
        <template #title>Modified</template>
        <template #description> Whether to show items that have been modified. </template>
      </SettingsModalToggle>
      <SettingsModalToggle v-model="settings.unchanged">
        <template #title>Unchanged</template>
        <template #description> Whether to show items that have not been modified. </template>
      </SettingsModalToggle>
    </div>

    <h3 class="font-lg font-bold pb-2 border-b-2 border-slate-600">Keys</h3>

    <div class="divide-y divide-slate-600 mb-4">
      <template v-if="game === 'gta'">
        <SettingsModalToggle v-model="settings.verbose">
          <template #title>Verbose Items</template>
          <template #description>
            Whether to show
            <button @click.stop="settingsModal.verboseDetail = !settingsModal.verboseDetail" class="text-sky-600 hover:text-sky-400">
              certain verbose items</button
            >.
          </template>
        </SettingsModalToggle>
        <div v-if="settingsModal.verboseDetail" class="py-2">
          <p class="text-sm text-slate-300 mb-1">
            Items containing the following text in their key are hidden by toggling the "Verbose Items" setting:
          </p>
          <ul class="pl-5 list-disc grid sm:grid-cols-2">
            <li v-for="item in ['8B7D3320', 'FM_CORONA', 'NPCFLOWINVITE', 'SALE_HASH_LABELS']" :key="item">
              <code>{{ item }}</code>
            </li>
          </ul>
        </div>
        <SettingsModalToggle v-model="settings.bonus">
          <template #title>Bonus</template>
          <template #description>
            Whether to show items that are in the
            <code>bonus</code> key.
          </template>
        </SettingsModalToggle>
        <SettingsModalToggle v-model="settings.content">
          <template #title>Content Lists</template>
          <template #description>
            Whether to show items that are in the
            <code>contentlists</code> key.
          </template>
        </SettingsModalToggle>
      </template>

      <SettingsModalToggle v-model="settings.tunables">
        <template #title>Tunables</template>
        <template #description>
          Whether to show items that are in the
          <code>tunables</code> key.
        </template>
      </SettingsModalToggle>
    </div>

    <h3 class="font-lg font-bold pb-2 border-b-2 border-slate-600">Miscellaneous</h3>

    <div class="divide-y divide-slate-600 mb-4">
      <SettingsModalToggle v-model="settings.quickView">
        <template #title>Quick View</template>
        <template #description> Whether to show the Quick View panel. </template>
      </SettingsModalToggle>

      <div class="sm:flex items-center justify-between gap-2 py-2">
        <div class="flex flex-grow flex-col">
          <span class="text-sm font-medium text-slate-50">Reset Settings</span>
          <span class="text-sm text-slate-300">
            Resets <strong>ALL</strong> settings to their default values. You can always tweak them to your liking again later.
          </span>
        </div>
        <button
          @click="handleResetSettingsClick"
          class="mt-3 inline-flex w-full justify-center rounded-md border border-red-700 bg-red-800 px-4 py-2 text-base font-medium text-slate-200 shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  </SettingsModal>
</template>
