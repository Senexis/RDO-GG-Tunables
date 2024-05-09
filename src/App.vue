<script setup>
import * as Sentry from '@sentry/vue';
import { create } from 'jsondiffpatch';
import * as htmlExtended from './utilities/html-formatter';
import { computed, onMounted, ref, watch } from 'vue';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  EllipsisVerticalIcon,
  NoSymbolIcon,
} from '@heroicons/vue/24/outline';
import { HeartIcon } from '@heroicons/vue/24/solid';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import AlertWithLink from './components/Alerts/WithLink.vue';
import AttributionModal from './components/Modals/AttributionModal.vue';
import Banner from './components/Banner.vue';
import Card from './components/Cards/Card.vue';
import CardFooter from './components/Cards/CardFooter.vue';
import CardHeader from './components/Cards/CardHeader.vue';
import DownloadModal from './components/Modals/DownloadModal.vue';
import ErrorModal from './components/Modals/ErrorModal.vue';
import LicenseModal from './components/Modals/LicenseModal.vue';
import NavBar from './components/NavBar.vue';
import QuickView from './components/QuickView.vue';
import SettingsModal from './components/Modals/SettingsModal.vue';
import SettingsModalSelect from './components/Modals/SettingsModalSelect.vue';
import SettingsModalToggle from './components/Modals/SettingsModalToggle.vue';

import { useStore } from './stores/settings.js';
import { random } from './utilities/general';

const settings = useStore();
const url = new URL(window.location);

// eslint-disable-next-line no-undef
const appChange = APP_CHANGE;

// eslint-disable-next-line no-undef
const appCommitShort = APP_COMMIT_SHORT;

// eslint-disable-next-line no-undef
const appCommitLong = APP_COMMIT_LONG;

// eslint-disable-next-line no-undef
const appCopyrightYear = APP_COPYRIGHT_YEAR;

// eslint-disable-next-line no-undef
const appUpdated = APP_UPDATED;

// Update the theme.
if (settings.dark) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

/**
 * Contains the selected previous tunables hash.
 *
 * @type {import("vue").Ref<string | null>}
 */
const previous = ref(url.searchParams.get('previous') || null);

/**
 * Contains the selected latest tunables hash.
 *
 * @type {import("vue").Ref<string | null>}
 */
const latest = ref(url.searchParams.get('latest') || null);

// Watch the theme toggle.
settings.$subscribe(
  (_mutation, state) => {
    if (state.dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  { detached: true }
);

/**
 * Contains the selected game.
 *
 * @type {import("vue").Ref<"gta" | "rdo">}
 */
const game = ref(url.searchParams.get('game') || settings.game || 'gta');

/**
 * Contains the selected platform.
 *
 * @type {import("vue").Ref<"pcros" | "ps4" | "ps5" | "xboxone" | "xboxsx">}
 */
const platform = ref(url.searchParams.get('platform') || settings.platform || 'pcros');

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
  types: null,
});

/**
 * Stores the data needed for displaying attribution modals.
 *
 * @type {import("vue").Ref<Object>}
 */
const attributionModal = ref({
  show: false,
});

/**
 * Stores the data needed for displaying license modals.
 *
 * @type {import("vue").Ref<Object>}
 */
const licenseModal = ref({
  show: false,
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
  quickViewItemsDetail: false,
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
  eventId: null,
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
 * The URL to retrieve the tunable defaults.
 *
 * @type {import("vue").ComputedRef<string>}
 */
const defaultsUrl = computed(() => `https://api.rdo.gg/tunables/gta/defaults.json?${allUrlCacheKey.value}`);

/**
 * The URL to retrieve the tunable types.
 *
 * @type {import("vue").ComputedRef<string>}
 */
const typesUrl = computed(() => `/data/tunable_types.json?${allUrlCacheKey.value}`);

/**
 * The currently active (shown) banner.
 *
 * @type {import("vue").ComputedRef<string | null>}
 */
const activeBanner = computed(() => {
  const banners = [
    'new-site',
    'new-quick-view',
    'open-source',
    'hide-quick-view-items',
    'more-personalization',
    'game-platform-defaults',
    'gen-9-bonuses',
  ];

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
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
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
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
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
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
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
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
    return null;
  }
});

/**
 * The available game badge texts.
 *
 * @type {import("vue").ComputedRef<Object>}
 */
const gameBadges = computed(() => ({
  gta: { label: 'GTA', background: 'gta', tooltip: 'GTA Online' },
  rdo: { label: 'RDO', background: 'rdo', tooltip: 'Red Dead Online' },
}));

const saleStyles = computed(() => {
  const classes = tunables.value.types
    ?.map((type) => {
      return `.hide-sales [data-key="${type}"]`;
    })
    .join(', ');

  return `${classes} { display: none !important; }`;
});

/**
 * Gets the badge label for a game.
 *
 * @returns {string}
 */
function getGameBadgeLabel() {
  const value = game.value;
  return gameBadges.value[value]?.label ?? 'Invalid';
}

/**
 * Gets the badge background for a game.
 *
 * @returns {string}
 */
function getGameBadgeBackground() {
  const value = game.value;
  const type = gameBadges.value[value]?.background ?? 'danger';
  return `badge-${type}`;
}

/**
 * Gets the badge tooltip for a game.
 *
 * @returns {string}
 */
function getGameBadgeTooltip() {
  const value = game.value;
  return gameBadges.value[value]?.tooltip ?? 'Invalid';
}

/**
 * The available game options.
 *
 * @type {import("vue").ComputedRef<Array>}
 */
const gameOptions = computed(() => [
  { value: 'gta', label: 'GTA Online' },
  { value: 'rdo', label: 'Red Dead Online' },
]);

/**
 * The available platform badge texts.
 *
 * @type {import("vue").ComputedRef<Object>}
 */
const platformBadges = computed(() => ({
  pcros: { label: 'PC', background: 'pc', tooltip: 'PC' },
  ps4: { label: 'PS4', background: 'playstation', tooltip: 'PlayStation 4' },
  ps5: { label: 'PS5', background: 'playstation', tooltip: 'PlayStation 5' },
  xboxone: { label: 'One', background: 'xbox', tooltip: 'Xbox One' },
  xboxsx: { label: 'X|S', background: 'xbox', tooltip: 'Xbox Series X|S' },
}));

/**
 * Gets the badge label for a platform.
 *
 * @returns {string}
 */
function getPlatformBadgeLabel() {
  const value = platform.value;
  return platformBadges.value[value]?.label ?? 'Invalid';
}

/**
 * Gets the badge background for a platform.
 *
 * @returns {string}
 */
function getPlatformBadgeBackground() {
  const value = platform.value;
  const type = platformBadges.value[value]?.background ?? 'danger';
  return `badge-${type}`;
}

/**
 * Gets the badge tooltip for a platform.
 *
 * @returns {string}
 */
function getPlatformBadgeTooltip() {
  const value = platform.value;
  return platformBadges.value[value]?.tooltip ?? 'Invalid';
}

/**
 * The available platform options.
 *
 * @type {import("vue").ComputedRef<Array>}
 */
const platformOptions = computed(() => [
  {
    value: 'pcros',
    label: 'PC',
    hidden: false,
  },
  {
    value: 'ps4',
    label: 'PlayStation 4',
    hidden: game.value !== 'gta',
  },
  {
    value: 'ps5',
    label: 'PlayStation 5',
    hidden: game.value !== 'gta',
  },
  {
    value: 'xboxone',
    label: 'Xbox One',
    hidden: game.value !== 'gta',
  },
  {
    value: 'xboxsx',
    label: 'Xbox Series X|S',
    hidden: game.value !== 'gta',
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
      return '';
    }

    const provider = tunables.value.latest.meta.provider;
    const thanks = tunables.value.latest.meta.special_thanks.join(', ');

    return `Provider: ${provider}. Special thanks: ${thanks}.`;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
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
      return '';
    }

    const date = new Date(tunables.value.all.updated * 1000).toLocaleString('en-US', {
      dateStyle: 'short',
      timeStyle: 'medium',
    });

    return `Updated: ${date}`;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
    return null;
  }
});

const eventWeeklyChanged = computed(() => {
  try {
    const latest = tunables?.value?.latest?.contents?.tunables?.CD_GLOBAL?.EVENT_WKLY ?? 'N/A';
    const previous = tunables?.value?.previous?.contents?.tunables?.CD_GLOBAL?.EVENT_WKLY ?? 'N/A';

    if (!latest || !previous) {
      return false;
    }

    return latest !== previous;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
    return false;
  }
});

const showGoToEventWeeklyChange = computed(() => {
  const all = tunables?.value?.all?.all;
  const current = tunables?.value?.latest?.contents?.tunables?.CD_GLOBAL?.EVENT_WKLY;

  if (!all || !current) {
    return false;
  }

  const tunablesWithCurrentVersion = [...all].reverse().filter((item) => item.weekly_event_id === current);

  if (!tunablesWithCurrentVersion || tunablesWithCurrentVersion.length <= 1) {
    return false;
  }

  const currentTunablePosition = tunablesWithCurrentVersion.findIndex((item) => item.hash === latest.value);

  if (currentTunablePosition === 0) {
    return false;
  }

  const tunablesWithChanges = tunablesWithCurrentVersion[0];
  const tunablesWithChangesIndex = all.findIndex((item) => item.hash === tunablesWithChanges.hash);
  const tunablesWithChangesPrevious = all[tunablesWithChangesIndex + 1];

  return {
    weekly_id: current,
    previous: tunablesWithChangesPrevious,
    latest: tunablesWithChanges,
  };
});

const eventWeeklyTooltip = computed(() => {
  try {
    const latest = tunables?.value?.latest?.contents?.tunables?.CD_GLOBAL?.EVENT_WKLY ?? 'N/A';
    const previous = tunables?.value?.previous?.contents?.tunables?.CD_GLOBAL?.EVENT_WKLY ?? 'N/A';

    if (!latest || !previous) {
      return '';
    }

    if (latest === previous) {
      return '';
    }

    return `New weekly event: #${latest}`;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
    return '';
  }
});

const eventGtaPlusChanged = computed(() => {
  try {
    const latest =
      tunables?.value?.latest?.contents?.tunables?.CD_GLOBAL?.EVENT_MBSP ??
      tunables?.value?.latest?.contents?.tunables?.BASE_GLOBALS?.GTAO_MEMBERSHIP_EVENT_ID ??
      'N/A';
    const previous =
      tunables?.value?.previous?.contents?.tunables?.CD_GLOBAL?.EVENT_MBSP ??
      tunables?.value?.previous?.contents?.tunables?.BASE_GLOBALS?.GTAO_MEMBERSHIP_EVENT_ID ??
      'N/A';

    if (!latest || !previous) {
      return false;
    }

    return latest !== previous;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
    return false;
  }
});

const eventGtaPlusTooltip = computed(() => {
  try {
    const latest =
      tunables?.value?.latest?.contents?.tunables?.CD_GLOBAL?.EVENT_MBSP ??
      tunables?.value?.latest?.contents?.tunables?.BASE_GLOBALS?.GTAO_MEMBERSHIP_EVENT_ID ??
      'N/A';
    const previous =
      tunables?.value?.previous?.contents?.tunables?.CD_GLOBAL?.EVENT_MBSP ??
      tunables?.value?.previous?.contents?.tunables?.BASE_GLOBALS?.GTAO_MEMBERSHIP_EVENT_ID ??
      'N/A';

    if (!latest || !previous) {
      return '';
    }

    if (latest === previous) {
      return '';
    }

    return `New GTA+ event: #${latest}`;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
    return '';
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
      return 'Changes';
    }

    const previousDate = tunables.value.previous.date;
    const latestDate = tunables.value.latest.date;

    return `Changes between ${previousDate} and ${latestDate}`;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
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
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
    return null;
  }
});

/**
 * Ensures that when the game is changed, the platform is set to the default.
 * In addition, triggers a game update to update the difference display.
 */
watch(game, () => {
  try {
    Sentry.setTag('game', game.value);
    if (platform.value !== 'pcros') {
      platform.value = 'pcros';
    } else {
      handleGameUpdate();
    }
  } catch (error) {
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
  }
});

/**
 * Triggers a game update to update the difference display.
 */
watch(platform, () => {
  try {
    Sentry.setTag('platform', platform.value);
    handleGameUpdate();
  } catch (error) {
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
  }
});

/**
 * Triggers a game update to update the difference display.
 */
watch(title, (state) => {
  try {
    document.title = `${state} - RDO.GG Tunables`;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
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
        errorModal.value.eventId = null;
      }, 500);
    } catch (error) {
      const eventId = Sentry.captureException(error);
      showErrorModal('An unknown error occurred.', eventId);
      console.error(error);
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
    handleGetTunableTypes();
  } catch (error) {
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
  }
});

/**
 * The logic to execute when the game is updated.
 *
 * @param {boolean} init Whether or not the website is being initialized.
 * @returns {Promise<void>}
 */
async function handleGameUpdate(init = false) {
  try {
    // Reset the difference display.
    difference.value.loading = true;
    difference.value.html = null;

    // Ensure RDO is always loaded as PC.
    if (game.value === 'rdo') {
      platform.value = 'pcros';

      if (settings.game === 'rdo') {
        settings.platform = 'pcros';
      }
    }

    // Step 1. Retrieve the meta file for tunables.
    try {
      tunables.value.all = await cachedRequest(`${game.value}-${platform.value}`, allUrl.value);
    } catch (error) {
      const eventId = Sentry.captureException(error);
      showErrorModal('We were unable to retrieve some required data needed to display the tunables. Please try again later.', eventId);
      console.error(error);
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
      const eventId = Sentry.captureException(error);
      showErrorModal(
        'We were unable to retrieve the previous tunables. If the tunables were recently updated, please try again in a few minutes.',
        eventId
      );
      console.error(error);
      return;
    }

    // Step 5. Retrieve the latest tunables.
    try {
      tunables.value.latest = await cachedRequest(`${game.value}-${platform.value}-${latest.value}`, latestUrl.value);
    } catch (error) {
      const eventId = Sentry.captureException(error);
      showErrorModal(
        'We were unable to retrieve the latest tunables. If the tunables were recently updated, please try again in a few minutes.',
        eventId
      );
      console.error(error);
      return;
    }

    // Step 6. Update the difference display.
    updateDifference();
  } catch (error) {
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
  }
}

async function handleGetTunableTypes() {
  try {
    const response = await cachedRequest('tunable-types', typesUrl.value);
    const tunableTypes = response.map((item) => item.key);
    tunables.value.types = [...new Set(tunableTypes)];
  } catch (error) {
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Updates the difference display.
 *
 * @returns {void}
 */
async function updateDifference() {
  try {
    difference.value.loading = true;
    difference.value.html = null;

    const previousJson = tunables.value.previous?.contents;
    const latestJson = tunables.value.latest?.contents;
    const defaults = await cachedRequest('tunable-defaults', defaultsUrl.value);

    const previousFormatted = formatJson(previousJson);
    const latestFormatted = formatJson(latestJson);

    const diffPatcher = create({
      arrays: { detectMove: true },
      textDiff: { minLength: 60 },
    });

    const delta = diffPatcher.diff(previousFormatted, latestFormatted);
    const format = htmlExtended.format(delta, previousFormatted);

    // Make it easier to work with the result.
    const html = document.createElement('div');
    html.innerHTML = format;

    // Add tunable metadata to each line in the tunables section.
    html.querySelectorAll('[data-key="tunables"] li[data-key]').forEach((item) => {
      // Try to get the tunable's key.
      const tunableKey = item.getAttribute('data-key');
      if (!tunableKey) return;

      // Try to get the tunable's value.
      let tunableValue = item.querySelector('.jsondiffpatch-value');
      if (tunableValue) tunableValue = tunableValue.textContent;

      // Try to find the tunable's default value.
      let defaultValue = defaults[tunableKey];
      if (defaultValue === undefined) return;

      if (tunableKey.includes('POSIX') || tunableKey.includes('TIMESTAMP')) {
        // Format timestamps into readable dates.
        defaultValue = `"${new Date(defaultValue * 1000).toISOString()}"`;
      } else if (typeof defaultValue === 'string') {
        // Format string values to include quotes.
        defaultValue = `"${defaultValue}"`.toUpperCase();
      } else if (typeof defaultValue === 'number' && (tunableValue === 'true' || tunableValue === 'false')) {
        // Format bool values to be displayed as bools.
        defaultValue = Boolean(defaultValue);
      }

      // Create the meta element.
      const metaElement = document.createElement('div');
      metaElement.classList.add('jsondiffpatch-tunable-meta');
      metaElement.append(`Default: ${defaultValue}`);

      // Add it to the current tunable.
      item.append(metaElement);
    });

    // Set the difference value to the edited HTML.
    difference.value.html = html.innerHTML;
    difference.value.loading = false;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
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

    url.searchParams.set('game', game.value);
    url.searchParams.set('platform', platform.value);

    if (previous.value) {
      url.searchParams.set('previous', previous.value);
    } else {
      url.searchParams.delete('previous');
    }

    if (latest.value) {
      url.searchParams.set('latest', latest.value);
    } else {
      url.searchParams.delete('latest');
    }

    window.history.pushState({}, '', url);
  } catch (error) {
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Handles the toggle tunables event.
 *
 * @returns {void}
 */
function handleToggleTunables() {
  try {
    settings.tunablesPanel = !settings.tunablesPanel;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Handles the move tunables event.
 *
 * @returns {void}
 */
function handleMoveTunables() {
  try {
    settings.quickViewBelowTunables = !settings.quickViewBelowTunables;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Moves the comparison to the previous 2 tunables.
 *
 * @returns {void}
 */
function handleComparePrevious() {
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
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Moves the comparison to the next 2 tunables.
 *
 * @returns {void}
 */
function handleCompareNext() {
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
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Moves the comparison to the latest and previous tunables.
 *
 * @returns {void}
 */
function handleCompareLatest() {
  try {
    if (nextDisabled.value) return;

    const all = tunables.value.all?.all;
    if (!all) return;

    previous.value = all[1].hash;
    latest.value = all[0].hash;
    handleGameUpdate(true);
  } catch (error) {
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
  }
}

function handleCompareWeeklyChange() {
  try {
    if (!showGoToEventWeeklyChange.value) return;

    const previousTarget = showGoToEventWeeklyChange.value.previous;
    const latestTarget = showGoToEventWeeklyChange.value.latest;

    if (!previousTarget || !latestTarget) return;

    previous.value = previousTarget.hash;
    latest.value = latestTarget.hash;
    handleGameUpdate(true);
  } catch (error) {
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
  }
}

function handleDismissTunablesDisclaimer() {
  try {
    settings.tunablesDisclaimer = false;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
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
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Resets the settings to their default values.
 *
 * @returns {void}
 */
function handleEmergencyResetClick() {
  try {
    settings.$reset();
  } catch (error) {
    // Ignore
  }

  try {
    const url = new URL(window.location);
    url.searchParams.delete('game');
    url.searchParams.delete('platform');
    url.searchParams.delete('previous');
    url.searchParams.delete('latest');

    window.location.href = url;
  } catch (error) {
    window.location.reload();
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
      if (parentKey === 'tunables' && typeof json[key] !== 'object') {
        const unknownKey = '(UNKNOWN)';
        if (!json[unknownKey]) {
          json[unknownKey] = {};
        }

        const formattedKey = `0x${key.padStart(8, '0')}`;
        json[unknownKey][formattedKey] = json[key];

        delete json[key];
      }

      if (typeof json[key] === 'object') {
        json[key] = formatJson(json[key], key);
      }
    }

    return json;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    showErrorModal('An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Shows an error modal.
 *
 * @param {string} body The body of the error modal.
 * @returns {void}
 */
function showErrorModal(body, eventId = null) {
  try {
    errorModal.value.body = body;
    errorModal.value.show = true;
    errorModal.value.eventId = eventId;
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
    <template v-if="!settings.quickViewBelowTunables">
      <QuickView
        :game="game"
        :platform="platform"
        :loading="difference.loading"
        :tunables="tunables?.latest?.contents?.tunables"
        :ugc="tunables?.latest?.contents?.contentlists"
        @error="showErrorModal"
      />
    </template>

    <div>
      <template v-if="settings.goToWeek && !difference.loading && showGoToEventWeeklyChange">
        <AlertWithLink
          :buttonText="`Show changes for week ${showGoToEventWeeklyChange.weekly_id}`"
          :buttonHandler="handleCompareWeeklyChange"
        >
          <p>
            These tunables changes are minor updates to week <strong>{{ showGoToEventWeeklyChange.weekly_id }}</strong
            >. You can browse the weekly changes themselves by clicking the button.
          </p>
        </AlertWithLink>
      </template>
      <Card>
        <template #header>
          <CardHeader class="flex flex-row items-center justify-between">
            <h1 class="truncate">
              <template v-if="eventWeeklyChanged">
                <span v-tooltip="eventWeeklyTooltip" class="badge-outline badge mr-2">
                  <span>
                    <font-awesome-icon icon="fa-solid fa-asterisk" />
                  </span>
                  <span class="sr-only">{{ eventWeeklyTooltip }}</span>
                </span>
              </template>
              <template v-if="eventGtaPlusChanged">
                <span v-tooltip="eventGtaPlusTooltip" class="badge-outline-plus badge mr-2">
                  <span>
                    <font-awesome-icon icon="fa-solid fa-asterisk" />
                  </span>
                  <span class="sr-only">{{ eventGtaPlusTooltip }}</span>
                </span>
              </template>
              <span v-tooltip="getGameBadgeTooltip()" :class="getGameBadgeBackground()" class="badge mr-2">
                {{ getGameBadgeLabel() }}
                <span class="sr-only">{{ getGameBadgeTooltip() }}</span>
              </span>
              <span v-tooltip="getPlatformBadgeTooltip()" :class="getPlatformBadgeBackground()" class="badge mr-2">
                {{ getPlatformBadgeLabel() }}
                <span class="sr-only">{{ getPlatformBadgeTooltip() }}</span>
              </span>
              <span>{{ title }}</span>
            </h1>
            <div class="whitespace-nowrap">
              <Menu as="div" class="relative ml-3">
                <div>
                  <MenuButton
                    v-tooltip="'Tunables options'"
                    class="inline-flex items-center justify-center rounded-md p-2 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-600 hover:text-secondary-900 dark:hover:text-secondary-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <span class="sr-only">Tunables options</span>
                    <EllipsisVerticalIcon class="h-4 w-4" aria-hidden="true" />
                  </MenuButton>
                </div>
                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems
                    class="origin-top-right mt-2 absolute right-0 z-10 w-56 rounded-md bg-white dark:bg-secondary-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <MenuItem>
                      <button
                        @click="handleToggleTunables"
                        type="button"
                        class="flex items-center gap-x-2.5 w-full px-4 py-2 text-left text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-secondary-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky"
                      >
                        <template v-if="settings.tunablesPanel">
                          <ArrowsPointingInIcon class="h-4 w-4" aria-hidden="true" />
                          Collapse Tunables
                        </template>
                        <template v-else>
                          <ArrowsPointingOutIcon class="h-4 w-4" aria-hidden="true" />
                          Expand Tunables
                        </template>
                      </button>
                    </MenuItem>
                    <MenuItem>
                      <button
                        @click="handleMoveTunables"
                        type="button"
                        class="flex items-center gap-x-2.5 w-full px-4 py-2 text-left text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-secondary-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky"
                      >
                        <template v-if="settings.quickViewBelowTunables">
                          <ArrowDownIcon class="h-4 w-4" aria-hidden="true" />
                          Move below Quick View
                        </template>
                        <template v-else>
                          <ArrowUpIcon class="h-4 w-4" aria-hidden="true" />
                          Move above Quick View
                        </template>
                      </button>
                    </MenuItem>
                    <MenuItem>
                      <hr class="my-1 border-secondary-200 dark:border-secondary-600" />
                    </MenuItem>
                    <MenuItem v-if="!previousDisabled">
                      <button
                        @click="handleComparePrevious"
                        type="button"
                        class="flex items-center gap-x-2.5 w-full px-4 py-2 text-left text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-secondary-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky"
                      >
                        <ChevronLeftIcon class="h-4 w-4" aria-hidden="true" />
                        Compare previous
                      </button>
                    </MenuItem>
                    <MenuItem v-if="!nextDisabled">
                      <button
                        @click="handleCompareNext"
                        type="button"
                        class="flex items-center gap-x-2.5 w-full px-4 py-2 text-left text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-secondary-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky"
                      >
                        <ChevronRightIcon class="h-4 w-4" aria-hidden="true" />
                        Compare next
                      </button>
                    </MenuItem>
                    <MenuItem v-if="!latestDisabled">
                      <button
                        @click="handleCompareLatest"
                        type="button"
                        class="flex items-center gap-x-2.5 w-full px-4 py-2 text-left text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-secondary-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky"
                      >
                        <ChevronDoubleRightIcon class="h-4 w-4" aria-hidden="true" />
                        Compare latest
                      </button>
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </CardHeader>
        </template>
        <template #default v-if="settings.tunablesPanel">
          <div
            class="relative bg-secondary-100 dark:bg-secondary-900 px-2 py-2 sm:p-4 overflow-x-auto overflow-y-auto max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-190px)]"
          >
            <template v-if="!difference.loading">
              <template v-if="difference.html">
                <template v-if="settings.tunablesDisclaimer">
                  <AlertWithLink buttonText="Dismiss" :buttonHandler="handleDismissTunablesDisclaimer">
                    <p>
                      Some tunables may be hidden by default, such as ones available in the <strong>Quick View panel</strong> or ones that
                      are verbose and aren't relevant to most users.
                    </p>
                    <p class="mt-0.5 text-xs text-secondary-200">
                      Tip: You can change which tunables to show using the <Cog6ToothIcon class="inline w-4 h-4" /> button.
                    </p>
                  </AlertWithLink>
                </template>
                <!-- eslint-disable vue/no-v-text-v-html-on-component -->
                <component :is="`style`" v-html="saleStyles"></component>
                <div
                  :class="[
                    settings.added ? '' : 'hide-added',
                    settings.deleted ? '' : 'hide-deleted',
                    settings.modified ? '' : 'hide-modified',
                    settings.unchanged ? '' : 'hide-unchanged',
                    settings.meta ? '' : 'hide-meta',
                    settings.content ? '' : 'hide-content',
                    settings.quickViewItems ? '' : 'hide-quick-view',
                    settings.sales ? '' : 'hide-sales',
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
              <template v-for="n in 20" :key="n">
                <template v-if="n === 1 || n === 20">
                  <div
                    class="my-[1px] rounded-sm text-xs bg-secondary-300 dark:bg-secondary-600 animate-pulse"
                    :style="{ width: random(4, 20) + 'em' }"
                  >
                    &nbsp;
                  </div>
                </template>
                <template v-else>
                  <div
                    class="my-[1px] rounded-sm text-xs bg-secondary-300 dark:bg-secondary-600 animate-pulse"
                    :style="{ width: random(4, 12) + 'em', 'margin-left': random(0, 1) + 'em' }"
                  >
                    &nbsp;
                  </div>
                </template>
              </template>
            </template>
          </div>
        </template>
        <template #footer v-if="settings.tunablesPanel">
          <CardFooter>
            <div class="truncate">{{ footerProvider }}</div>
            <div class="truncate sm:flex-shrink-0">{{ footerUpdated }}</div>
          </CardFooter>
        </template>
      </Card>
    </div>

    <template v-if="settings.quickViewBelowTunables">
      <QuickView
        :game="game"
        :platform="platform"
        :loading="difference.loading"
        :tunables="tunables?.latest?.contents?.tunables"
        :ugc="tunables?.latest?.contents?.contentlists"
        @error="showErrorModal"
      />
    </template>

    <div
      class="mt-8 border-t border-secondary-800/10 dark:border-secondary-200/10 py-4 text-xs leading-5 text-secondary-500 sm:flex sm:items-center sm:justify-between"
    >
      <div class="flex space-x-4">
        <span>&copy; {{ appCopyrightYear }} RDO.GG</span>
        <span>
          <HeartIcon class="inline w-4 h-4 text-heart animate-pulse" /> from
          <a href="https://github.com/Senexis" target="_blank" rel="noopener noreferrer">Senexis</a> and
          <button @click="attributionModal.show = true" class="text-primary-600 hover:text-primary-400">contributors</button>
        </span>
      </div>
      <div class="flex space-x-4">
        <a href="https://rdo.gg/privacy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        <a href="https://rdo.gg/terms/" target="_blank" rel="noopener noreferrer">Terms of Service</a>
        <button @click="licenseModal.show = true" class="text-primary-600 hover:text-primary-400">License</button>
        <button @click="attributionModal.show = true" class="text-primary-600 hover:text-primary-400">Attribution</button>
      </div>
    </div>
  </main>

  <template v-if="!settings.bannersBlocked">
    <Banner id="new-site" :show="activeBanner === 'new-site'">
      Welcome to the new website! Check out all the settings using the
      <Cog6ToothIcon class="inline w-5 h-5" /> button.
      <br />
      <span class="text-sm text-secondary-200">
        Tip: Looking for tunables like <code class="text-inherit">0x8B7D3320</code>? Toggle the <strong>Verbose</strong>
        tunables setting.
      </span>
    </Banner>

    <Banner id="new-quick-view" :show="activeBanner === 'new-quick-view'">
      Newly added: the Quick View panel! See some popular items at a glance. Feel free to <strong>Collapse</strong> it using the
      <EllipsisVerticalIcon class="inline w-5 h-5" /> button.
      <br />
      <span class="text-sm text-secondary-200">
        Tip: Change your mind? You can always <strong>Expand</strong> the Quick View panel by clicking the
        <EllipsisVerticalIcon class="inline w-5 h-5" /> button again.
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

    <Banner id="hide-quick-view-items" :show="activeBanner === 'hide-quick-view-items'">
      Tunables also available in the Quick View panel (excluding sales) are now hidden by default to reduce clutter.
      <br />
      <span class="text-sm text-secondary-200">
        You can re-enable them using the <Cog6ToothIcon class="inline w-5 h-5" /> button, then enabling the
        <strong>Quick View</strong> tunables setting.
      </span>
    </Banner>

    <Banner id="more-personalization" :show="activeBanner === 'more-personalization'">
      Newly added: light mode, collapsible tunables panel, revamped settings, and more. Check out the new options using the
      <Cog6ToothIcon class="inline w-5 h-5" /> button!
    </Banner>

    <Banner id="game-platform-defaults" :show="activeBanner === 'game-platform-defaults'">
      Tired of picking your game and platform every time you visit? You can now set your default game and platform using the
      <Cog6ToothIcon class="inline w-5 h-5" /> button!
    </Banner>

    <template v-if="game === 'gta'">
      <Banner id="gen-9-bonuses" :show="activeBanner === 'gen-9-bonuses'">
        Missing some items in the Sales & Bonuses section?
        <br />
        <span class="text-sm text-secondary-200">
          We've hidden the PlayStation 5 and Xbox Series X|S benefits that never change to reduce clutter. You can re-enable them using the
          <Cog6ToothIcon class="inline w-5 h-5" /> button.
        </span>
      </Banner>
    </template>
  </template>

  <AttributionModal :open="attributionModal.show" @close="attributionModal.show = false"></AttributionModal>
  <LicenseModal :open="licenseModal.show" @close="licenseModal.show = false"></LicenseModal>
  <DownloadModal :files="files" :open="downloadModal.show" @close="downloadModal.show = false"></DownloadModal>

  <ErrorModal :open="errorModal.show" :event-id="errorModal.eventId" @reset="handleEmergencyResetClick">
    {{ errorModal.body }}
  </ErrorModal>

  <SettingsModal
    :open="settingsModal.show"
    @close="settingsModal.show = false"
    :change="appChange"
    :commitShort="appCommitShort"
    :commitLong="appCommitLong"
    :updated="appUpdated"
  >
    <h3 class="font-lg font-semibold pb-2 border-b-2 border-secondary-200 dark:border-secondary-600">General</h3>

    <div class="divide-y divide-secondary-200 dark:divide-secondary-600 mb-4">
      <SettingsModalSelect v-model="game" :options="gameOptions">
        <template #title>Game</template>
        <template #description>
          Select the game to compare tunables for.
          <template v-if="settings.game !== game">
            <button @click.stop="settings.game = game" class="text-primary-600 hover:text-primary-400">Set as your default game</button>
          </template>
          <template v-else>This is set as your default game.</template>
        </template>
      </SettingsModalSelect>
      <SettingsModalSelect v-model="platform" :options="platformOptions">
        <template #title>Platform</template>
        <template #description>
          Select the platform to compare tunables for.
          <template v-if="settings.platform !== platform">
            <button @click.stop="settings.platform = platform" class="text-primary-600 hover:text-primary-400">
              Set as your default platform
            </button>
          </template>
          <template v-else>This is set as your default platform.</template>
        </template>
      </SettingsModalSelect>
      <div class="flex items-center justify-between gap-2 py-2">
        <p class="text-xs text-secondary-500">
          Your default game and platform settings will be used when you browse to the website manually (eg. visiting
          <code>tunables.rdo.gg</code>). Full links, like the ones posted on
          <font-awesome-icon icon="fa-brands fa-x-twitter" aria-label="X" />, will override your preferences for that visit only. When a
          game does not support the platform you've picked, it will use PC instead and update your preferences.
        </p>
      </div>
      <SettingsModalToggle v-model="settings.bannersBlocked">
        <template #title>Block Banners</template>
        <template #description>Whether to block all banners for website updates.</template>
      </SettingsModalToggle>
      <div class="flex items-center justify-between gap-2 py-2">
        <p class="text-xs text-secondary-500">
          You can use <strong>Block Banners</strong> if you do not want to be notified of new features or changes to the website. You can
          always re-enable the option to be notified of any changes you missed.
        </p>
      </div>
    </div>

    <h3 class="font-lg font-semibold pb-2 border-b-2 border-secondary-200 dark:border-secondary-600">Personalization</h3>

    <div class="divide-y divide-secondary-200 dark:divide-secondary-600 mb-4">
      <SettingsModalToggle v-model="settings.dark" :isDarkModeToggle="true">
        <template #title>Dark mode</template>
        <template #description>Whether to use dark mode for the website.</template>
      </SettingsModalToggle>
      <SettingsModalToggle v-model="settings.tunablesPanel" :isVisibilityToggle="true">
        <template #title>Tunables Panel</template>
        <template #description>Whether to show the tunables panel.</template>
      </SettingsModalToggle>
      <SettingsModalToggle v-model="settings.quickView" :isVisibilityToggle="true">
        <template #title>Quick View Panel</template>
        <template #description>Whether to show the Quick View panel.</template>
      </SettingsModalToggle>
      <SettingsModalToggle v-model="settings.quickViewBelowTunables">
        <template #title>Quick View Below Tunables</template>
        <template #description>Whether to move the Quick View below tunables.</template>
      </SettingsModalToggle>
      <div class="flex items-center justify-between gap-2 py-2">
        <p class="text-xs text-secondary-500">
          More options for Quick View are available by clicking the <EllipsisVerticalIcon class="inline w-4 h-4" /> button on the Quick View
          panel.
          <a href="https://x.com/Tunables" target="_blank" rel="noopener noreferrer">
            Contact us on <font-awesome-icon icon="fa-brands fa-x-twitter" aria-label="X" />
          </a>
          if you have suggestions for more personalization options!
        </p>
      </div>
    </div>

    <h3 class="font-lg font-semibold pb-2 border-b-2 border-secondary-200 dark:border-secondary-600">Tunables Panel</h3>

    <div class="divide-y divide-secondary-200 dark:divide-secondary-600 mb-4">
      <SettingsModalToggle v-model="settings.tunablesDisclaimer" :isVisibilityToggle="true">
        <template #title>Tunables Disclaimer</template>
        <template #description> Whether to show the tunables disclaimer banner.</template>
      </SettingsModalToggle>

      <div class="flex items-center justify-between gap-2 py-2">
        <p class="text-xs text-secondary-500">
          The following options control the visibility of all tunables in the panel. You can use these to reduce the amount of tunables you
          see.
        </p>
      </div>

      <SettingsModalToggle v-model="settings.added" :isVisibilityToggle="true">
        <template #title>Added</template>
        <template #description>Whether to show tunables that have been added.</template>
      </SettingsModalToggle>
      <SettingsModalToggle v-model="settings.deleted" :isVisibilityToggle="true">
        <template #title>Deleted</template>
        <template #description>Whether to show tunables that have been deleted.</template>
      </SettingsModalToggle>
      <SettingsModalToggle v-model="settings.modified" :isVisibilityToggle="true">
        <template #title>Modified</template>
        <template #description>Whether to show tunables that have been modified.</template>
      </SettingsModalToggle>
      <SettingsModalToggle v-model="settings.unchanged" :isVisibilityToggle="true">
        <template #title>Unchanged</template>
        <template #description>Whether to show tunables that have not changed.</template>
      </SettingsModalToggle>

      <div class="flex items-center justify-between gap-2 py-2">
        <p class="text-xs text-secondary-500">
          Rather than applying to all tunables, the following options hide specific types of tunables. This can be used to reduce the amount
          of tunables you see.
        </p>
      </div>

      <SettingsModalToggle v-model="settings.quickViewItems" :isVisibilityToggle="true">
        <template #title>Quick View</template>
        <template #description>
          Whether to show tunables that are
          <button
            @click.stop="settingsModal.quickViewItemsDetail = !settingsModal.quickViewItemsDetail"
            class="text-primary-600 hover:text-primary-400"
          >
            available in Quick View</button
          >.
        </template>
      </SettingsModalToggle>
      <div v-if="settingsModal.quickViewItemsDetail" class="text-sm text-secondary-700 dark:text-secondary-300 py-2 overflow-hidden">
        <p class="mb-1">
          Tunables containing the following text in their key are hidden by toggling the <strong>Quick View</strong>
          setting:
        </p>
        <ul class="pl-5 list-disc grid sm:grid-cols-2 sm:gap-x-4 mb-2">
          <li
            v-for="item in [
              'BGS_SpecialEvent_*',
              'CAR_MEET_PRIZE_VEHICLE',
              '*_CASH_STAMP_TYPE',
              'CASINO_PRIZE_VEHICLE',
              'DAILY_OBJECTIVE',
              'FIXER_STUDIO_APPEARANCE',
              'HSW_TEST_RIDE',
              'HSW_TIME_TRIAL_SUBVARIATION',
              'LUXURY_SHOWCASE_VEHICLE',
              'PRIZE_VEHICLE_Z_OFFSET',
              'PROMO_TEST_DRIVE_VEHICLE',
              'SALV23_ROBBERY_VEHICLE',
              'SALV23_VEHICLE_ROBBERY',
              'SIMEON_TEST_DRIVE_VEHICLE',
              'SOCIAL_CLUB_GARAGE_PRIZE_VEHICLE',
              'SOCIAL_CLUB_GARAGE_VEHICLE',
              'TIMETRIALVARIATION',
              'WEEKLY_OBJECTIVE',
              'XM22_GUN_VAN_SLOT',
              'XM22_GUN_VAN_STOCK_ID',
              '*_XP_STAMP_TYPE',
            ]"
            :key="item"
          >
            <p class="mr-2 truncate">
              <code>{{ item }}</code>
            </p>
          </li>
        </ul>
      </div>

      <template v-if="game === 'gta'">
        <SettingsModalToggle v-model="settings.sales" :isVisibilityToggle="true">
          <template #title>Sales & Bonuses</template>
          <template #description>
            Whether to show tunables that are
            <a
              href="https://github.com/Senexis/RDO-GG-Tunables/blob/main/public/data/tunable_types.json"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary-600 hover:text-primary-400"
              >available in Sales & Bonuses</a
            >.
          </template>
        </SettingsModalToggle>
        <SettingsModalToggle v-model="settings.verbose" :isVisibilityToggle="true">
          <template #title>Verbose</template>
          <template #description>
            Whether to show tunables that are
            <button
              @click.stop="settingsModal.verboseDetail = !settingsModal.verboseDetail"
              class="text-primary-600 hover:text-primary-400"
            >
              verbose</button
            >.
          </template>
        </SettingsModalToggle>
        <div v-if="settingsModal.verboseDetail" class="text-sm text-secondary-700 dark:text-secondary-300 py-2 overflow-hidden">
          <p class="mb-1">
            Tunables containing the following text in their key are hidden by toggling the <strong>Verbose</strong>
            setting:
          </p>
          <ul class="pl-5 list-disc grid sm:grid-cols-2 sm:gap-x-4 mb-2">
            <li><code>bonus</code> section</li>
            <li
              v-for="item in [
                '0x8B7D3320',
                'BOOT_BUTTON_QUICK_MATCH_TYPE',
                'CURRENTVEHICLESALESSEASON',
                'CURRENTVEHICLESALESTUSEASON',
                'DISPLAY_SALES',
                'ELO_SEASON',
                'EVENT_END_DATE',
                'EVENT_MBSP',
                'EVENT_WKLY',
                'FM_CORONA',
                'FMCORONA',
                'GTAO_MEMBERSHIP_EVENT_ID',
                'GTAO_MEMBERSHIP_PERIOD_MESSAGE',
                'NPCFLOWINVITE',
                'PROFESIONALCORONA',
                'SALE_HASH_LABELS',
                'SALE_WEAPON_AMMO',
                'TUNABLE_VERSION',
              ]"
              :key="item"
            >
              <p class="mr-2 truncate">
                <code>{{ item }}</code>
              </p>
            </li>
          </ul>
          <p class="mb-1">The following miscellaneous features are hidden by toggling the <strong>Verbose</strong> setting:</p>
          <ul class="pl-5 list-disc mb-2">
            <li><strong>Mission Bonuses:</strong> Non-numeric and the RP Cap modifiers.</li>
          </ul>
        </div>
        <SettingsModalToggle v-model="settings.content" :isVisibilityToggle="true">
          <template #title>Content Lists</template>
          <template #description> Whether to show tunables that are in the <code>contentlists</code> section. </template>
        </SettingsModalToggle>
      </template>

      <SettingsModalToggle v-model="settings.tunables" :isVisibilityToggle="true">
        <template #title>Tunables</template>
        <template #description> Whether to show tunables that are in the <code>tunables</code> section. </template>
      </SettingsModalToggle>

      <div class="flex items-center justify-between gap-2 py-2">
        <p class="text-xs text-secondary-500">
          The following options allow you to configure various miscellaneous features of the tunables panel.
        </p>
      </div>

      <SettingsModalToggle v-model="settings.goToWeek" :isVisibilityToggle="true">
        <template #title>"Go to week" banner</template>
        <template #description>Whether to show the banner that allows you to quickly jump to the weekly changes.</template>
      </SettingsModalToggle>

      <SettingsModalToggle v-model="settings.meta" :isVisibilityToggle="true">
        <template #title>Metadata</template>
        <template #description>Whether to show tunable metadata such as the default value.</template>
      </SettingsModalToggle>
    </div>

    <template v-if="game === 'gta'">
      <h3 class="font-lg font-semibold pb-2 border-b-2 border-secondary-200 dark:border-secondary-600">Quick View Panel</h3>

      <div class="divide-y divide-secondary-200 dark:divide-secondary-600 mb-4">
        <SettingsModalToggle v-model="settings.salesDisclaimer" :isVisibilityToggle="true">
          <template #title>Sales Disclaimer</template>
          <template #description> Whether to show the sales disclaimer banner.</template>
        </SettingsModalToggle>
        <SettingsModalToggle v-model="settings.gen9Bonuses" :isVisibilityToggle="true">
          <template #title>Gen 9 Benefits</template>
          <template #description> Whether to show tunables in Sales & Bonuses that are PlayStation 5 or Xbox Series X|S benefits.</template>
        </SettingsModalToggle>
      </div>
    </template>

    <h3 class="font-lg font-semibold pb-2 border-b-2 border-secondary-200 dark:border-secondary-600">
      <a
        href="https://www.youtube.com/watch?v=yK0P1Bk8Cx4"
        target="_blank"
        rel="noopener noreferrer"
        class="text-inherit hover:text-inherit"
      >
        Danger Zone
      </a>
    </h3>

    <div class="divide-y divide-secondary-200 dark:divide-secondary-600 mb-4">
      <div class="flex items-center justify-between gap-2 py-2">
        <div class="flex flex-grow flex-col">
          <span class="text-sm font-medium text-secondary-900 dark:text-secondary-50">Reset Settings</span>
          <span class="text-sm text-secondary-700 dark:text-secondary-300">
            Reset all settings to their defaults, expand all collapsed content, and show all dismissed banners.
          </span>
        </div>
        <button
          @click="handleResetSettingsClick"
          class="inline-flex justify-center rounded-md border border-danger-600 dark:border-danger-700 bg-danger-600 dark:bg-danger-700 px-4 py-2 font-medium text-white dark:text-secondary-200 shadow-sm hover:bg-danger-500 dark:hover:bg-danger-600 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 mt-0 w-auto text-sm"
        >
          Reset
        </button>
      </div>
      <div class="flex items-center justify-between gap-2 py-2">
        <p class="text-xs text-secondary-500">
          Try <strong>Reset Settings</strong> if you are experiencing issues while using the website. You can also use it to start fresh.
          While this cannot be undone, you can always tweak the settings to your liking again.
        </p>
      </div>
    </div>
  </SettingsModal>
</template>
