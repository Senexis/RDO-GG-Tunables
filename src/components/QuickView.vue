<script setup>
import prettyMilliseconds from 'pretty-ms';
import * as Sentry from '@sentry/vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  CurrencyDollarIcon,
  EllipsisVerticalIcon,
} from '@heroicons/vue/24/outline';

import Accordion from './Accordion.vue';
import AlertWithLink from './Alerts/WithLink.vue';
import Card from './Cards/Card.vue';
import CardHeader from './Cards/CardHeader.vue';
import CardFooter from './Cards/CardFooter.vue';

import { useStore } from '../stores/settings.js';
import { computed, onMounted, ref } from 'vue';
import { orderObject, random } from '../utilities/general';

const emit = defineEmits(['error']);

const props = defineProps({
  game: {
    type: String,
    default: null,
  },
  platform: {
    type: String,
    default: null,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  tunables: {
    type: Object,
    default: null,
  },
  ugc: {
    type: Object,
    default: null,
  },
});

const settings = useStore();

const data = ref({
  loading: true,

  tunableDefaults: null,
  dailyObjectives: null,
  rcTimeTrials: null,
  hswTimeTrials: null,
  timeTrials: null,
  vehicles: null,
  weapons: null,
  tunableTypes: null,
  salvageYard: null,
});

const Accordions = Object.freeze({
  Sales: 'sales',
  UgcBonuses: 'ugc_bonuses',
  PeyotePlants: 'peyote_plants',
  TimeTrials: 'time_trials',
  GunVan: 'gun_van',
  Casino: 'casino',
  LsCarMeet: 'ls_car_meet',
  LuxuryAutosShowroom: 'luxury_autos_showroom',
  PremiumDeluxeMotorsportShowroom: 'premium_deluxe_motorsport_showroom',
  VinewoodCarClub: 'vinewood_car_club',
  RecordAStudios: 'record_a_studios',
  SalvageYard: 'salvage_yard',
  DailyObjectives: 'daily_objectives',
  WeeklyObjectives: 'weekly_objectives',
  RdoEvent: 'rdo_event',
  RdoStamps: 'rdo_stamps',
});

/**
 * Triggers a game update to initialize the difference display.
 */
onMounted(() => {
  try {
    handleQuickViewInit();
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
});

/**
 * Handles the quick view init event.
 */
async function handleQuickViewInit() {
  try {
    data.value.loading = true;

    const tunableDefaults = await request('https://api.rdo.gg/tunables/gta/defaults.json');
    const dailyObjectives = await request('/data/daily_objectives.json');
    const weeklyObjectives = await request('/data/weekly_objectives.json');
    const hswTimeTrials = await request('/data/hsw_time_trials.json');
    const labels = await request('/data/labels.json');
    const rcTimeTrials = await request('/data/rc_time_trials.json');
    const timeTrials = await request('/data/time_trials.json');
    const tunableTypes = await request('/data/tunable_types.json');
    const salvageYard = await request('/data/salvage_yard.json');

    data.value = {
      loading: false,
      tunableDefaults,
      dailyObjectives,
      weeklyObjectives,
      hswTimeTrials,
      labels,
      rcTimeTrials,
      timeTrials,
      tunableTypes,
      salvageYard,
    };
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Makes a request to the specified URL.
 *
 * @param {string} url The URL to make the request to.
 * @returns {Promise<any>}
 */
async function request(url) {
  try {
    const response = await fetch(`${url}?${Math.floor(Date.now() / 1000)}`);
    return await response.json();
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'We were unable to retrieve some required data needed to display the tunables. Please try again later.', eventId);
    console.error(error);
  }
}

/**
 * Handles the toggle quick view event.
 *
 * @returns {void}
 */
function handleToggleQuickView() {
  try {
    settings.quickView = !settings.quickView;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Handles the move quick view event.
 *
 * @returns {void}
 */
function handleMoveQuickView() {
  try {
    settings.quickViewBelowTunables = !settings.quickViewBelowTunables;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Handles the Collapse All Quick View items event.
 *
 * @returns {void}
 */
function handleCollapseAllQuickView() {
  try {
    settings.accordionsDismissed = [
      ...Object.values(Accordions),
      ...Object.keys(sales.value ?? []).map((key) => `${Accordions.Sales}_${key}`),
      ...Object.keys(ugcBonuses.value ?? []).map((key) => `${Accordions.UgcBonuses}_${key}`),
    ];
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Handles the Collapse All except Sales Quick View items event.
 *
 * @returns {void}
 */
function handleCollapseAllExceptSalesQuickView() {
  try {
    settings.accordionsDismissed = [
      ...Object.values(Accordions).filter((key) => key !== Accordions.Sales),
      ...Object.keys(ugcBonuses.value ?? []).map((key) => `${Accordions.UgcBonuses}_${key}`),
    ];
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Handles the Expand All Quick View items event.
 *
 * @returns {void}
 */
function handleExpandAllQuickView() {
  try {
    settings.accordionsDismissed = [];
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

function handleDismissSalesDisclaimer() {
  try {
    settings.salesDisclaimer = false;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Retrieves the value of a tunable.
 *
 * @param {string} key The tunables key to retrieve the value for.
 * @returns {string|null}
 */
function getTunable(key, context = null) {
  try {
    const tunables = props.tunables;

    if (tunables === undefined) return null;

    if (context === null) {
      for (const item in tunables) {
        if (tunables[item][key] === undefined) {
          continue;
        }

        return tunables[item][key];
      }

      return null;
    } else {
      if (!tunables[context] || tunables[context][key] === undefined) {
        return null;
      }

      return tunables[context][key];
    }
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Retrieves the text for a label.
 *
 * @param {string} value The label to retrieve the text for.
 * @returns {string}
 */
function getLabel(value) {
  try {
    if (!data.value.labels) return value;
    return data.value.labels[value] ?? value;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Tries to retrieve a tunable.
 *
 * @param {string} query The query to search for.
 */
function findTunable(query) {
  try {
    if (typeof query === 'number') {
      try {
        query = '0x' + (query >>> 0).toString(16).toUpperCase().padStart(8, '0');
      } catch {
        return null;
      }
    }

    const tunables = props.tunables;
    if (tunables === undefined) return null;

    for (const item in tunables) {
      for (const key in tunables[item]) {
        if (key.toLowerCase() === query.toLowerCase()) {
          return {
            key,
            value: tunables[item][key],
            context: item,
          };
        }
      }
    }

    return null;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

function findTunables(query) {
  try {
    if (typeof query === 'number') {
      try {
        query = '0x' + (query >>> 0).toString(16).toUpperCase().padStart(8, '0');
      } catch {
        return null;
      }
    }

    const tunables = props.tunables;
    if (tunables === undefined) return null;

    const results = [];

    for (const item in tunables) {
      for (const key in tunables[item]) {
        if (key.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            key,
            value: tunables[item][key],
            context: item,
          });
        }
      }
    }

    return results;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Tries to retrieve all tunables in a context.
 *
 * @param {string} query The query to search for.
 */
function findContext(query) {
  try {
    if (typeof query !== 'string') return null;

    const tunables = props.tunables;
    if (tunables === undefined) return null;

    for (const item in tunables) {
      if (item.toLowerCase() === query.toLowerCase()) {
        return {
          key: item,
          value: tunables[item],
        };
      }
    }

    return null;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Retrieves the default value of a tunable.
 *
 * @param {string} key The tunables key to retrieve the default value for.
 * @returns {string|null}
 */
function getTunableDefault(key) {
  try {
    if (!data.value.tunableDefaults) return null;
    return data.value.tunableDefaults[key] ?? null;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Retrieves the vehicle for a tunable.
 *
 * @param {string} tunable The tunable to retrieve the vehicle for.
 * @returns {string|null}
 */
function getVehicleTunable(tunable) {
  try {
    const value = getTunable(`${tunable}_MODEL_HASH`);
    if (value === null || value === -1) return null;
    if (!data.value.labels) return value;
    return data.value.labels[value] ?? value;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

function getSalvageYardVehicleMission(index) {
  const value = getTunable(`SALV23_VEHICLE_ROBBERY_${index}`);
  if (value === null || value === -1) return null;
  return getLabel(`JAMAL_ROB_CAN${value}`);
}

function getSalvageYardVehicleCanKeep(index) {
  const value = getTunable(`SALV23_VEHICLE_ROBBERY_CAN_KEEP_${index}`);
  return Boolean(value);
}

function getSalvageYardVehicleName(index) {
  const value = getTunable(`SALV23_VEHICLE_ROBBERY_ID_${index}`);
  if (value === null || value === -1) return null;

  if (!data.value.salvageYard) return null;
  const length = data.value.salvageYard.length;

  // TODO: Were R* just drunk when they scripted this or is there actually a situation where the other stuff is needed?
  // See vehrob_planning:0x2F6BA in case their stuff is different from just this.
  const vehicleIndex = (value % length) - 1;
  const vehicle = data.value.salvageYard[vehicleIndex];

  return getLabel(vehicle);
}

function getSalvageYardVehicle(index) {
  const mission = getSalvageYardVehicleMission(index);
  const canKeep = getSalvageYardVehicleCanKeep(index);
  const name = getSalvageYardVehicleName(index);

  if (!mission || !name) return null;

  if (canKeep) {
    return `${mission}: ${name} (claimable)`;
  }

  return `${mission}: ${name}`;
}

/**
 * Retrieves the daily objective for a day.
 *
 * @param {string} day The day to retrieve the daily objective for.
 * @returns {string|null}
 */
function getDailyObjective(day) {
  try {
    const value = getTunable(`DAILY_OBJECTIVE_${day.toUpperCase()}_1`);
    if (value === null || value === -1) return null;
    if (!data.value.dailyObjectives) return null;
    if (!data.value.dailyObjectives[value]) {
      console.warn(`Daily objective [${value}] not found, was there an update recently?`);
      return null;
    }
    return data.value.dailyObjectives[value] ?? null;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Retrieves the weekly objective ID.
 *
 * @returns {string|null}
 */
function getWeeklyObjectiveId() {
  try {
    if (props.game !== 'gta') return null;
    let value = getTunable('MP_WEEKLY_OBJECTIVE_ID_OVERRIDE');
    if (value === null || value === -1) return null;
    if (!data.value.weeklyObjectives) return null;
    if (!data.value.weeklyObjectives[value]) {
      console.warn(`Weekly objective [${value}] not found, was there an update recently?`);
      return null;
    }
    return data.value.weeklyObjectives[value] ?? null;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Retrieves the weekly objective.
 *
 * @returns {string|null}
 */
function getWeeklyObjective() {
  const objective = getWeeklyObjectiveId();
  if (objective === null) return null;
  const override = getWeeklyObjectiveCount();

  return getLabel(objective[0])
    .replace('~a~', '')
    .replace('~1~', formatNumber(override ?? objective[1]));
}

/**
 * Retrieves the weekly objective count.
 *
 * @returns {string|null}
 */
function getWeeklyObjectiveCount() {
  try {
    const value = getTunable('MP_WEEKLY_OBJECTIVE_COUNT_OVERRIDE');
    if (value === null || value === -1) return null;
    return value;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Retrieves the RC time trial for a tunable.
 *
 * @returns {string|null}
 */
function getRcTimeTrial() {
  try {
    const value = getTunable('RCTIMETRIALVARIATION');
    if (value === null || value === -1) return null;
    if (!data.value.rcTimeTrials) return null;
    if (!data.value.rcTimeTrials[value]) {
      emit('error', `RC time trial [${value}] not found, was there an update recently?`, null);
      return null;
    }
    return data.value.rcTimeTrials[value] ?? null;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Retrieves the HSW time trial for a tunable.
 *
 * @returns {string|null}
 */
function getHswTimeTrial() {
  try {
    const value = getTunable('HSW_TIME_TRIAL_SUBVARIATION');
    if (value === null || value === -1) return null;
    if (!data.value.hswTimeTrials) return null;
    if (!data.value.hswTimeTrials[value]) {
      emit('error', `HSW time trial [${value}] not found, was there an update recently?`, null);
      return null;
    }
    return data.value.hswTimeTrials[value];
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Retrieves the time trial for a tunable.
 *
 * @returns {string|null}
 */
function getTimeTrial() {
  try {
    const value = getTunable('TIMETRIALVARIATION');
    if (value === null || value === -1) return null;
    if (!data.value.timeTrials) return null;
    if (!data.value.timeTrials[value]) {
      emit('error', `Time trial [${value}] not found, was there an update recently?`, null);
      return null;
    }
    return data.value.timeTrials[value];
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Retrieves the car meet prize objective.
 *
 * @returns {string|null}
 */
function getCarMeetPrizeObjective() {
  try {
    const id = getTunable('CAR_MEET_PRIZE_VEHICLE_CHALLENGE_ID');
    const paramOne = getTunable('CAR_MEET_PRIZE_VEHICLE_CHALLENGE_PARAM_ONE');
    const paramTwo = getTunable('CAR_MEET_PRIZE_VEHICLE_CHALLENGE_PARAM_TWO');

    if (id === null || paramOne === null || paramTwo === null) {
      return null;
    }

    switch (id) {
      case 0:
        if (paramTwo === 1) {
          return `LS Car Meet Series: Place top ${paramOne}.`;
        } else {
          return `LS Car Meet Series: Place top ${paramOne} for ${paramTwo} days in a row.`;
        }
      case 1:
        if (paramTwo === 1) {
          return `Street Race Series: Place top ${paramOne}.`;
        } else {
          return `Street Race Series: Place top ${paramOne} for ${paramTwo} days in a row.`;
        }
      case 2:
        if (paramTwo === 1) {
          return `Pursuit Series: Place top ${paramOne}.`;
        } else {
          return `Pursuit Series: Place top ${paramOne} for ${paramTwo} days in a row.`;
        }
      case 3:
        if (paramOne === 1 && paramTwo === 1) {
          return `Sprints: Win 1 race.`;
        } else if (paramOne === 1 && paramTwo > 1) {
          return `Sprints: Win 1 race for ${paramTwo} days in a row.`;
        } else if (paramOne > 1 && paramTwo === 1) {
          return `Sprints: Win ${paramOne} races.`;
        } else {
          return `Sprints: Win ${paramOne} races for ${paramTwo} days in a row.`;
        }
      case 4:
        if (paramTwo === 1) {
          return `LS Car Meet Series: Place top ${paramOne}.`;
        } else {
          return `LS Car Meet Series: Place top ${paramOne} in ${paramTwo} races.`;
        }
      case 5:
        if (paramTwo === 1) {
          return `Street Race Series: Place top ${paramOne}.`;
        } else {
          return `Street Race Series: Place top ${paramOne} in ${paramTwo} races.`;
        }
      case 6:
        if (paramTwo === 1) {
          return `Pursuit Series: Place top ${paramOne}.`;
        } else {
          return `Pursuit Series: Place top ${paramOne} in ${paramTwo} races.`;
        }
      case 7:
        if (paramTwo === 1) {
          return `Sprints: Win ${paramOne} race.`;
        } else {
          return `Sprints: Win ${paramOne} races.`;
        }
      case 8:
        if (paramTwo === 1) {
          return `Drag Race Series: Place top ${paramOne}.`;
        } else {
          return `Drag Race Series: Place top ${paramOne} for ${paramTwo} days in a row.`;
        }
      case 9:
        if (paramTwo === 1) {
          return `Drag Race Series: Place top ${paramOne}.`;
        } else {
          return `Drag Race Series: Place top ${paramOne} in ${paramTwo} races.`;
        }
      case 10:
        if (paramTwo === 1) {
          return `Drift Race: Place top ${paramOne}.`;
        } else {
          return `Drift Race: Place top ${paramOne} for ${paramTwo} days in a row.`;
        }
      case 11:
        if (paramTwo === 1) {
          return `Drift Race: Place top ${paramOne}.`;
        } else {
          return `Drift Race: Place top ${paramOne} in ${paramTwo} races.`;
        }
      default:
        return null;
    }
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Retrieves the gun van inventory.
 *
 * @returns {object}
 */
function getGunVan() {
  try {
    const result = {
      weapons: [
        { item: 'WEAPON_BAT', discount: null, discount_plus: null },
        { item: 'WEAPON_KNIFE', discount: null, discount_plus: null },
        { item: 'WEAPON_RAILGUNXM3', discount: null, discount_plus: null },
        { item: 'WEAPON_MICROSMG', discount: null, discount_plus: null },
        { item: 'WEAPON_PUMPSHOTGUN', discount: null, discount_plus: null },
      ],
      throwables: [{ item: 'WEAPON_STICKYBOMB', discount: null, discount_plus: null }],
      body_armor: [
        { item: 'WT_BA_0', discount: null, discount_plus: null },
        { item: 'WT_BA_1', discount: null, discount_plus: null },
        { item: 'WT_BA_2', discount: null, discount_plus: null },
        { item: 'WT_BA_3', discount: null, discount_plus: null },
        { item: 'WT_BA_4', discount: null, discount_plus: null },
      ],
    };

    for (let i = 0; i < 10; i++) {
      const item = getTunable(`XM22_GUN_VAN_SLOT_WEAPON_TYPE_${i}`);
      if (item) {
        result['weapons'][i] = {
          item: item,
          discount: null,
          discount_plus: null,
        };
      }

      if (!result['weapons'][i]) continue;

      const discount = getTunable(`XM22_GUN_VAN_SLOT_WEAPON_DISCOUNT_${i}`, 'BASE_GLOBALS');
      if (discount) {
        result['weapons'][i].discount = discount;
      }

      const discount_plus = getTunable(`XM22_GUN_VAN_SLOT_WEAPON_DISCOUNT_${i}`, 'MP_FM_MEMBERSHIP');
      if (discount_plus) {
        result['weapons'][i].discount_plus = discount_plus;
      }
    }

    for (let i = 0; i < 3; i++) {
      const item = getTunable(`XM22_GUN_VAN_SLOT_THROWABLE_TYPE_${i}`);
      if (item) {
        result['throwables'][i] = {
          item: item,
          discount: null,
          discount_plus: null,
        };
      }

      if (!result['throwables'][i]) continue;

      const discount = getTunable(`XM22_GUN_VAN_SLOT_THROWABLE_DISCOUNT_${i}`, 'BASE_GLOBALS');
      if (discount) {
        result['throwables'][i].discount = discount;
      }

      const discount_plus = getTunable(`XM22_GUN_VAN_SLOT_THROWABLE_DISCOUNT_${i}`, 'MP_FM_MEMBERSHIP');
      if (discount_plus) {
        result['throwables'][i].discount_plus = discount_plus;
      }
    }

    for (let i = 0; i < 5; i++) {
      const item = getTunable(`XM22_GUN_VAN_SLOT_ARMOUR_TYPE_${i}`);
      if (item) {
        result['body_armor'][i] = {
          item: item,
          discount: null,
          discount_plus: null,
        };
      }

      if (!result['body_armor'][i]) continue;

      const discount = getTunable(`XM22_GUN_VAN_SLOT_ARMOUR_DISCOUNT_${i}`, 'BASE_GLOBALS');
      if (discount) {
        result['body_armor'][i].discount = discount;
      }

      const discount_plus = getTunable(`XM22_GUN_VAN_SLOT_ARMOUR_DISCOUNT_${i}`, 'MP_FM_MEMBERSHIP');
      if (discount_plus) {
        result['body_armor'][i].discount_plus = discount_plus;
      }
    }

    return result;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Retrieves whether studio appearance is enabled for a day.
 *
 * @param {string} day The day to retrieve the studio appearance for.
 * @returns {bool|null}
 */
function getStudioAppearanceEnabled(day) {
  try {
    const value = getTunable(`FIXER_STUDIO_APPEARANCE_DISABLE_${day.toUpperCase()}`);
    if (value === null) return null;
    return value === false;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

function getPeyotePlants() {
  try {
    const isEnabled = getTunable('VC_PEYOTE_ENABLE');
    if (!isEnabled) return null;

    const tunables = findTunables('VC_PEYOTE_DISABLE_');
    if (!tunables.length) return null;

    return {
      enabled: tunables.filter((i) => i.value === false).map((i) => getLabel('PEYOTE_' + i.key.replace('VC_PEYOTE_DISABLE_', ''))),
      disabled: tunables.filter((i) => i.value === true).map((i) => getLabel('PEYOTE_' + i.key.replace('VC_PEYOTE_DISABLE_', ''))),
    };
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Retrieves the sales for the current tunables.
 *
 * @returns {object}
 */
function getSales() {
  try {
    const results = {};
    for (const tunableType of data.value.tunableTypes) {
      const tunable = findTunable(tunableType.key);
      if (!tunable) continue;

      if (props.game === 'gta' && ['pcrosalt', 'ps5', 'xboxsx'].includes(props.platform)) {
        if (!settings.gen9Bonuses && tunableType.gen_9_bonus) continue;
      }

      const salesTitle = tunable.context === 'MP_FM_MEMBERSHIP' ? `${tunableType.type}_plus` : tunableType.type;
      const baseValue = getTunableDefault(tunableType.key);

      tunableType.values = [];

      const key = tunableType.display || tunableType.key;
      results[salesTitle] = results[salesTitle] || {};
      results[salesTitle][key] = results[salesTitle][key] || tunableType;

      if (baseValue) {
        const percentage = -(100 - Math.round((tunable.value / baseValue) * 100));
        results[salesTitle][key].values.push([tunable.value, percentage]);
      } else {
        results[salesTitle][key].values.push([tunable.value, null]);
      }
    }

    return orderObject(results, true);
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Retrieves the title for the sales section.
 *
 * @returns string
 */
function getSalesTitle(title) {
  try {
    const key = 'QV_' + title.replace(/_plus$/g, '').toUpperCase();
    const label = getLabel(key);
    if (key === label) return getLabel('QV_MISCELLANEOUS');
    return label;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Retrieves the UGC bonuses for the current tunables.
 *
 * @returns {object}
 */
function getUgcBonuses() {
  try {
    const ugc = props.ugc;
    if (!ugc) return null;

    const results = {};

    for (const [contentListKey, contentList] of Object.entries(ugc)) {
      results[contentListKey] = {
        ugc: contentList,
        modifiers: [],
        plus_only: false,
      };

      const modifiers = findContext(`CONTENT_MODIFIER_${contentListKey}`);

      if (modifiers && modifiers.value) {
        for (const [modifierKey, modifierValue] of Object.entries(modifiers.value)) {
          if (!settings.verbose && modifierKey.includes('RP_CAP')) continue;
          let formattedValue = modifierValue;
          if (!settings.verbose && isNaN(modifierValue)) continue;
          if (!isNaN(modifierValue)) {
            formattedValue = Number(formattedValue).toLocaleString('en-US', { maximumFractionDigits: 2 });
            if (modifierKey.includes('MULTIPLIER')) formattedValue += 'x';
          }
          results[contentListKey].modifiers.push({
            type: modifierKey,
            value: formattedValue,
            plus: false,
          });
        }
      }

      const modifiersPlus = findContext(`CONTENT_MODIFIER_MEMBERSHIP_${contentListKey}`);

      if (modifiersPlus && modifiersPlus.value) {
        for (const [modifierKey, modifierValue] of Object.entries(modifiersPlus.value)) {
          if (!settings.verbose && modifierKey.includes('RP_CAP')) continue;
          let formattedValue = modifierValue;
          if (!settings.verbose && isNaN(modifierValue)) continue;
          if (!isNaN(modifierValue)) {
            formattedValue = Number(formattedValue).toLocaleString('en-US', { maximumFractionDigits: 2 });
            if (modifierKey.includes('MULTIPLIER')) formattedValue += 'x';
          }
          if (results[contentListKey].modifiers.some((i) => i.type === modifierKey && i.value === formattedValue)) continue;
          results[contentListKey].modifiers.push({
            type: modifierKey,
            value: formattedValue,
            plus: true,
          });
        }
      }

      const nonPlusCount = results[contentListKey].modifiers.filter((i) => !i.plus).length;
      const plusCount = results[contentListKey].modifiers.filter((i) => i.plus).length;

      if (nonPlusCount === 0 && plusCount > 0) {
        results[contentListKey].plus_only = true;
      }
    }

    return orderObject(results, true);
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Retrieves the badge class for a UGC modifier.
 *
 * @returns string
 */
function getUgcModifierBadge(modifier) {
  try {
    if (modifier.type.endsWith('CASH_MULTIPLIER')) return 'badge-cash';
    if (modifier.type.endsWith('XP_MULTIPLIER')) return 'badge-rp';
    return 'badge-primary';
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Retrieves the label for a UGC modifier.
 *
 * @returns string
 */
function getUgcModifierLabel(modifier) {
  try {
    const type = getLabel(modifier.type);
    const value = modifier.value;
    return `${type}: ${value}`;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Retrieves the text to display for currency.
 *
 * @returns string
 */
function formatSale(item) {
  try {
    const mappedDiscounts = item.values
      .sort((a, b) => a[0] - b[0])
      .filter((a, i, arr) => arr.findIndex((b) => a[0] === b[0]) === i)
      .map((i) => formatSaleValue(item.format ?? 'sale_cash', i[0], i[1]));

    let formattedLabel = item.display ? getLabel(item.display) : item.key;
    let formattedValue = 'Unknown';

    if (mappedDiscounts.length === 0) {
      return `${formattedLabel}: ${formattedValue}`;
    }

    if (mappedDiscounts.length === 1) {
      formattedValue = mappedDiscounts[0];
    } else {
      const lowestDiscount = mappedDiscounts[0];
      const highestDiscount = mappedDiscounts[mappedDiscounts.length - 1];
      formattedValue = `${lowestDiscount} - ${highestDiscount}`;
    }

    return `${formattedLabel}: ${formattedValue}`;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

function formatSaleValue(format, value, percentage) {
  const fc = Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format;

  const fn = Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format;

  let multiplier = null;

  if (percentage < -100 || percentage > 100) {
    multiplier = '';
    percentage = '';
  } else {
    multiplier = `(${fn(percentage / 100)}x)`;
    percentage = `(${fn(percentage)}%)`;
  }

  switch (format) {
    case 'bonus_rp':
      return `${fn(value)} RP ${multiplier}`;
    case 'bonus_rp_multiplier':
      return `${fn(value)}x RP`;
    case 'bonus_cash':
      return `${fc(value)} ${multiplier}`;
    case 'bonus_cash_multiplier':
      return `${fn(value)}x Cash`;
    case 'bonus_time_m':
      if (value === 1) return `1 minute ${percentage}`;
      return `${fn(value)} minutes ${percentage}`;
    case 'bonus_time_ms':
      return `${prettyMilliseconds(value, { verbose: true })} ${percentage}`;
    case 'sale_chips':
      if (value === 0) return `FREE ${percentage}`;
      return `${fn(value)} Chips ${percentage}`;
    case 'sale_cash':
    default:
      if (value === 0) return `FREE ${percentage}`;
      return `${fc(value)} ${percentage}`;
  }
}
/**
 * Retrieves the text to display for numbers.
 *
 * @returns string
 */
function formatNumber(value) {
  try {
    return Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

/**
 * Retrieves the active event and its features in RDO.
 *
 * @returns {object|null}
 */
function getRdoEvent() {
  try {
    if (props.game !== 'rdo') return null;

    const event = getTunable('BGS_SpecialEvent');
    if (!event) return null;

    const name = event === 1788394582 ? 'Christmas' : event === -921030142 ? 'Halloween' : 'Unknown';
    const features = [];

    const bitset = getTunable('BGS_SpecialEventBitset');
    if (bitset) {
      if ((bitset & (1 << 0)) !== 0) features.push('Christmas Decorations');
      if ((bitset & (1 << 1)) !== 0) features.push('Snow');
      // Unknown: (1 << 2)
      if ((bitset & (1 << 3)) !== 0) features.push('Christmas Wraith');
      // Unknown: (1 << 4)
      if ((bitset & (1 << 5)) !== 0) features.push('Heavy Snow');
      if ((bitset & (1 << 6)) !== 0) features.push('Christmas Lights');
      if ((bitset & (1 << 7)) !== 0) features.push('Seasonal Cripps Greetings');
      if ((bitset & (1 << 8)) !== 0) features.push('Christmas Music');
      if ((bitset & (1 << 9)) !== 0) features.push('Seasonal Harriet Greetings');
      if ((bitset & (1 << 10)) !== 0) features.push('Christmas Present');
      if ((bitset & (1 << 11)) !== 0) features.push('Seasonal Call to Arms Modes');
    }

    return {
      event: name,
      features: features.sort(),
    };
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

function getRdoStamps() {
  try {
    if (props.game !== 'rdo') return null;

    const stampLabels = {
      net_on_call: 'NM_PLAYLIST_STORY_MISSION_ON_CALL',
      net_playlist_adversary_large: 'NM_PLAYLIST_ADVERSARY_LARGE',
      net_playlist_adversary_medium: 'NM_PLAYLIST_ADVERSARY_MEDIUM',
      net_playlist_adversary_small: 'NM_PLAYLIST_ADVERSARY_SMALL',
      net_playlist_capture: 'NM_PLAYLIST_CAPTURE',
      net_playlist_elimination_large: 'NM_PLAYLIST_ELIMINATION_LARGE',
      net_playlist_elimination_medium: 'NM_PLAYLIST_ELIMINATION_MEDIUM',
      net_playlist_elimination_small: 'NM_PLAYLIST_ELIMINATION_SMALL',
      net_playlist_featured_series_001: 'NM_PLAYLIST_FEATURED_001',
      net_playlist_gun_rush_free_for_all: 'NM_PLAYLIST_GUN_RUSH',
      net_playlist_gun_rush_teams: 'NM_PLAYLIST_GUN_RUSH_TEAMS',
      net_playlist_nominated_series: 'NM_PLAYLIST_NOMINATED',
      net_playlist_nominated_series_large: 'NM_PLAYLIST_NOMINATED_LARGE',
      net_playlist_nominated_series_medium: 'NM_PLAYLIST_NOMINATED_MEDIUM',
      net_playlist_nominated_series_small: 'NM_PLAYLIST_NOMINATED_SMALL',
      net_playlist_race_series: 'NM_PLAYLIST_RACE',
      net_playlist_shootout: 'NM_PLAYLIST_SHOOTOUT',
    };

    const stampValues = [
      'STAMP_INVALID',
      'STAMP_CASH',
      'STAMP_CASH_2',
      'STAMP_CASH_3',
      'STAMP_XP',
      'STAMP_XP_2',
      'STAMP_XP_3',
      'STAMP_DISC_25',
      'STAMP_DISC_50',
      'STAMP_GOLD',
      'STAMP_LOCK',
      'STAMP_LOCKED_RANK',
      'STAMP_LOCKED_RANK_GOLD',
      'STAMP_NEW',
      'STAMP_UNLOCKED_RANK',
      'STAMP_WISHLIST',
    ];

    const context = findContext('MP_UI_GLOBALS');
    const stamps = [];

    if (!context) return stamps;

    for (const key in context.value) {
      if (!key.endsWith('_CASH_STAMP_TYPE') && !key.endsWith('_XP_STAMP_TYPE')) continue;
      const tunable = getTunable(key, 'MP_UI_GLOBALS');
      const type = key.toLowerCase().replace('_cash_stamp_type', '').replace('_xp_stamp_type', '');

      const value = getLabel(stampValues[tunable] ?? tunable);
      const label = getLabel(stampLabels[type] ?? type);

      stamps.push(`${value} on ${label}`);
    }

    return stamps;
  } catch (error) {
    const eventId = Sentry.captureException(error);
    emit('error', 'An unknown error occurred.', eventId);
    console.error(error);
  }
}

// GTA
const carMeetPrizeObjective = computed(() => getCarMeetPrizeObjective());
const carMeetPrizeVehicle = computed(() => getVehicleTunable('CAR_MEET_PRIZE_VEHICLE'));
const promoTestDriveVehicle1 = computed(() => getVehicleTunable('PROMO_TEST_DRIVE_VEHICLE_1'));
const promoTestDriveVehicle2 = computed(() => getVehicleTunable('PROMO_TEST_DRIVE_VEHICLE_2'));
const promoTestDriveVehicle3 = computed(() => getVehicleTunable('PROMO_TEST_DRIVE_VEHICLE_3'));
const hswTestRide = computed(() => getVehicleTunable('HSW_TEST_RIDE'));
const casinoPrizeVehicle = computed(() => getVehicleTunable('CASINO_PRIZE_VEHICLE'));
const luxuryShowcaseVehicle1 = computed(() => getVehicleTunable('LUXURY_SHOWCASE_VEHICLE_1'));
const luxuryShowcaseVehicle2 = computed(() => getVehicleTunable('LUXURY_SHOWCASE_VEHICLE_2'));
const simeonTestDriveVehicle1 = computed(() => getVehicleTunable('SIMEON_TEST_DRIVE_VEHICLE_1'));
const simeonTestDriveVehicle2 = computed(() => getVehicleTunable('SIMEON_TEST_DRIVE_VEHICLE_2'));
const simeonTestDriveVehicle3 = computed(() => getVehicleTunable('SIMEON_TEST_DRIVE_VEHICLE_3'));
const simeonTestDriveVehicle4 = computed(() => getVehicleTunable('SIMEON_TEST_DRIVE_VEHICLE_4'));
const simeonTestDriveVehicle5 = computed(() => getVehicleTunable('SIMEON_TEST_DRIVE_VEHICLE_5'));
const socialClubGaragePrizeVehicle = computed(() => getVehicleTunable('SOCIAL_CLUB_GARAGE_PRIZE_VEHICLE'));
const socialClubGarageVehicle1 = computed(() => getVehicleTunable('SOCIAL_CLUB_GARAGE_VEHICLE_1'));
const socialClubGarageVehicle2 = computed(() => getVehicleTunable('SOCIAL_CLUB_GARAGE_VEHICLE_2'));
const socialClubGarageVehicle3 = computed(() => getVehicleTunable('SOCIAL_CLUB_GARAGE_VEHICLE_3'));
const socialClubGarageVehicle4 = computed(() => getVehicleTunable('SOCIAL_CLUB_GARAGE_VEHICLE_4'));
const socialClubGarageVehicle5 = computed(() => getVehicleTunable('SOCIAL_CLUB_GARAGE_VEHICLE_5'));
const socialClubGarageVehicle6 = computed(() => getVehicleTunable('SOCIAL_CLUB_GARAGE_VEHICLE_6'));
const socialClubGarageVehicle7 = computed(() => getVehicleTunable('SOCIAL_CLUB_GARAGE_VEHICLE_7'));
const socialClubGarageVehicle8 = computed(() => getVehicleTunable('SOCIAL_CLUB_GARAGE_VEHICLE_8'));
const socialClubGarageVehicle9 = computed(() => getVehicleTunable('SOCIAL_CLUB_GARAGE_VEHICLE_9'));
const salvageYardVehicle1 = computed(() => getSalvageYardVehicle(0));
const salvageYardVehicle2 = computed(() => getSalvageYardVehicle(1));
const salvageYardVehicle3 = computed(() => getSalvageYardVehicle(2));
const dailyObjectiveMon = computed(() => getDailyObjective('SAT'));
const dailyObjectiveTue = computed(() => getDailyObjective('SUN'));
const dailyObjectiveWed = computed(() => getDailyObjective('MON'));
const dailyObjectiveThu = computed(() => getDailyObjective('TUE'));
const dailyObjectiveFri = computed(() => getDailyObjective('WED'));
const dailyObjectiveSat = computed(() => getDailyObjective('THU'));
const dailyObjectiveSun = computed(() => getDailyObjective('FRI'));
const weeklyObjective = computed(() => getWeeklyObjective());
const timeTrial = computed(() => getTimeTrial());
const hswTimeTrial = computed(() => getHswTimeTrial());
const rcTimeTrial = computed(() => getRcTimeTrial());
const gunVan = computed(() => getGunVan());
const studioAppearanceEnabledMon = computed(() => getStudioAppearanceEnabled('MON'));
const studioAppearanceEnabledTue = computed(() => getStudioAppearanceEnabled('TUE'));
const studioAppearanceEnabledWed = computed(() => getStudioAppearanceEnabled('WED'));
const studioAppearanceEnabledThu = computed(() => getStudioAppearanceEnabled('THU'));
const studioAppearanceEnabledFri = computed(() => getStudioAppearanceEnabled('FRI'));
const studioAppearanceEnabledSat = computed(() => getStudioAppearanceEnabled('SAT'));
const studioAppearanceEnabledSun = computed(() => getStudioAppearanceEnabled('SUN'));
const peyotePlants = computed(() => getPeyotePlants());
const sales = computed(() => getSales());
const ugcBonuses = computed(() => getUgcBonuses());

// RDO
const rdoEvent = computed(() => getRdoEvent());
const rdoStamps = computed(() => getRdoStamps());
</script>

<template>
  <Card>
    <template #header>
      <CardHeader class="flex flex-row items-center justify-between">
        <h1 class="truncate">Quick View</h1>
        <div class="whitespace-nowrap">
          <Menu as="div" class="relative ml-3">
            <div>
              <MenuButton
                v-tooltip="'Quick View options'"
                class="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-hidden focus:ring-inset disabled:pointer-events-none disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-600 dark:hover:text-slate-50"
              >
                <span class="sr-only">Quick View options</span>
                <EllipsisVerticalIcon class="size-4" aria-hidden="true" />
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
                class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg focus:outline-hidden dark:bg-slate-800"
              >
                <MenuItem>
                  <button
                    type="button"
                    class="flex w-full items-center gap-x-2.5 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-hidden focus:ring-inset dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-50"
                    @click="handleToggleQuickView"
                  >
                    <template v-if="settings.quickView">
                      <ArrowsPointingInIcon class="size-4" aria-hidden="true" />
                      Collapse Quick View
                    </template>
                    <template v-else>
                      <ArrowsPointingOutIcon class="size-4" aria-hidden="true" />
                      Expand Quick View
                    </template>
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    type="button"
                    class="flex w-full items-center gap-x-2.5 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-hidden focus:ring-inset dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-50"
                    @click="handleMoveQuickView"
                  >
                    <template v-if="settings.quickViewBelowTunables">
                      <ArrowUpIcon class="size-4" aria-hidden="true" />
                      Move above Tunables
                    </template>
                    <template v-else>
                      <ArrowDownIcon class="size-4" aria-hidden="true" />
                      Move below Tunables
                    </template>
                  </button>
                </MenuItem>
                <MenuItem>
                  <hr class="my-1 border-slate-200 dark:border-slate-600" />
                </MenuItem>
                <MenuItem>
                  <button
                    type="button"
                    class="flex w-full items-center gap-x-2.5 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-hidden focus:ring-inset dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-50"
                    @click="handleCollapseAllQuickView"
                  >
                    <ArrowsPointingInIcon class="size-4" aria-hidden="true" />
                    Collapse all sections
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    type="button"
                    class="flex w-full items-center gap-x-2.5 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-hidden focus:ring-inset dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-50"
                    @click="handleCollapseAllExceptSalesQuickView"
                  >
                    <CurrencyDollarIcon class="size-4" aria-hidden="true" />
                    Collapse all except Sales
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    type="button"
                    class="flex w-full items-center gap-x-2.5 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-hidden focus:ring-inset dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-50"
                    @click="handleExpandAllQuickView"
                  >
                    <ArrowsPointingOutIcon class="size-4" aria-hidden="true" />
                    Expand all sections
                  </button>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </CardHeader>
    </template>
    <template v-if="settings.quickView" #default>
      <template v-if="!loading && !data.loading && tunables">
        <!-- GTA -->
        <template v-if="(sales && Object.keys(sales).length) || (ugcBonuses && Object.keys(ugcBonuses).length)">
          <Accordion :id="Accordions.Sales">
            <template #title>Sales & Bonuses</template>
            <template #default>
              <template v-if="settings.salesDisclaimer">
                <AlertWithLink button-text="Dismiss" :button-handler="handleDismissSalesDisclaimer">
                  <p>
                    This is an automatically generated list of sales and bonuses. Some items may be missing, especially right after the game
                    is updated.<br />
                    <a href="https://x.com/TezFunz2" target="_blank" rel="noopener noreferrer" class="font-bold text-white!"
                      >Follow @TezFunz2 on <font-awesome-icon icon="fa-brands fa-x-twitter" aria-label="X"
                    /></a>
                    for the latest, more accurate, manually written sales and bonuses.
                  </p>
                  <p class="mt-0.5 text-xs text-slate-200">
                    Currently known sales and bonuses: {{ formatNumber(data?.tunableTypes?.length ?? 0) }}.
                    <a
                      href="https://github.com/Senexis/RDO-GG-Tunables/blob/main/public/data/tunable_types.json"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="font-bold text-white!"
                      >Help increase this number by contributing here!</a
                    >
                  </p>
                </AlertWithLink>
              </template>

              <div
                class="divide-y divide-slate-300 overflow-hidden rounded-lg border border-slate-300 bg-white dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-800"
              >
                <template v-for="(category, key) in sales" :key="key">
                  <Accordion :id="`${Accordions.Sales}_${key}`">
                    <template #title>
                      <div class="flex w-full items-center justify-between overflow-hidden">
                        <div class="flex gap-2 overflow-hidden">
                          <span class="truncate">{{ getSalesTitle(key) }}</span>
                          <template v-if="key.endsWith('_plus')">
                            <span v-tooltip="'Only applies to GTA+ Members'" class="badge badge-plus">
                              <font-awesome-icon icon="fa-solid fa-plus" />
                            </span>
                          </template>
                        </div>
                        <div class="hidden sm:block">
                          <span class="badge badge-primary ml-2">
                            {{ Object.keys(category).length === 1 ? '1 item' : `${Object.keys(category).length} items` }}
                          </span>
                        </div>
                        <div class="block sm:hidden">
                          <span class="badge badge-primary ml-2">
                            {{ Object.keys(category).length }}
                          </span>
                        </div>
                      </div>
                    </template>
                    <template #default>
                      <ul :class="[Object.keys(category).length >= 8 ? 'grid sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-3' : '', 'list-disc']">
                        <template v-for="item in category" :key="item">
                          <li class="ml-5">
                            <p v-tooltip.top-start="formatSale(item)" class="mr-2 truncate">
                              {{ formatSale(item) }}
                            </p>
                          </li>
                        </template>
                      </ul>
                    </template>
                  </Accordion>
                </template>
                <template v-if="ugcBonuses && Object.keys(ugcBonuses).length">
                  <Accordion :id="Accordions.UgcBonuses">
                    <template #title>
                      <div class="flex w-full items-center justify-between overflow-hidden">
                        <div class="flex gap-2 overflow-hidden">
                          <span class="truncate">Mission Bonuses</span>
                        </div>
                        <div class="hidden sm:block">
                          <span class="badge badge-primary ml-2">
                            {{ Object.keys(ugcBonuses).length === 1 ? '1 list' : `${Object.keys(ugcBonuses).length} lists` }}
                          </span>
                        </div>
                        <div class="block sm:hidden">
                          <span class="badge badge-primary ml-2">
                            {{ Object.keys(ugcBonuses).length }}
                          </span>
                        </div>
                      </div>
                    </template>
                    <template #default>
                      <div
                        class="divide-y divide-slate-300 overflow-hidden rounded-lg border border-slate-300 bg-white dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-800"
                      >
                        <template v-for="(list, index) in ugcBonuses" :key="index">
                          <Accordion :id="`${Accordions.UgcBonuses}_${index}`">
                            <template #title>
                              <div class="flex w-full items-center justify-between overflow-hidden">
                                <div class="flex gap-2 overflow-hidden">
                                  <span class="truncate">List {{ Number(index) + 1 }}</span>
                                  <template v-if="list.plus_only">
                                    <span v-tooltip="'Only applies to GTA+ Members'" class="badge badge-plus">
                                      <font-awesome-icon icon="fa-solid fa-plus" />
                                    </span>
                                  </template>
                                </div>
                                <div class="hidden whitespace-nowrap sm:block">
                                  <span class="badge badge-primary ml-2">
                                    {{ list.ugc.length === 1 ? '1 mission' : `${list.ugc.length} missions` }}
                                  </span>
                                  <span class="badge badge-primary ml-2">
                                    {{ list.modifiers.length === 1 ? '1 modifier' : `${list.modifiers.length} modifiers` }}
                                  </span>
                                </div>
                                <div class="block sm:hidden">
                                  <span class="badge badge-primary ml-2">
                                    {{ list.ugc.length }} mis. | {{ list.modifiers.length }} mod.
                                  </span>
                                </div>
                              </div>
                            </template>
                            <template #default>
                              <h3 class="my-1 font-semibold">Modifiers</h3>
                              <div class="mb-4">
                                <template v-if="list.modifiers.length">
                                  <template v-for="(modifier, item) in list.modifiers" :key="item">
                                    <template v-if="modifier.plus">
                                      <span
                                        v-tooltip="'Only applies to GTA+ Members'"
                                        :class="getUgcModifierBadge(modifier)"
                                        class="badge mr-1"
                                      >
                                        <font-awesome-icon icon="fa-solid fa-plus" />
                                        {{ getUgcModifierLabel(modifier) }}
                                      </span>
                                    </template>
                                    <template v-else>
                                      <span :class="getUgcModifierBadge(modifier)" class="badge mr-1">{{
                                        getUgcModifierLabel(modifier)
                                      }}</span>
                                    </template>
                                  </template>
                                </template>
                                <template v-else>
                                  <span class="text-slate-600 dark:text-slate-400">No modifiers detected.</span>
                                </template>
                              </div>
                              <h3 class="my-1 font-semibold">Missions</h3>
                              <ul
                                :class="[
                                  Object.keys(list.ugc).length >= 8 ? 'grid sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-3' : '',
                                  'list-disc',
                                ]"
                              >
                                <template v-if="Object.keys(list.ugc).length">
                                  <template v-for="(mission, item) in list.ugc" :key="item">
                                    <li class="ml-5">
                                      <p v-tooltip.top-start="mission" class="mr-2 truncate">{{ mission }}</p>
                                    </li>
                                  </template>
                                </template>
                                <template v-else>
                                  <span class="text-slate-600 dark:text-slate-400">No missions detected.</span>
                                </template>
                              </ul>
                            </template>
                          </Accordion>
                        </template>
                      </div>
                    </template>
                  </Accordion>
                </template>
              </div>
            </template>
          </Accordion>
        </template>
        <template v-if="peyotePlants">
          <Accordion :id="Accordions.PeyotePlants">
            <template #title>
              <div class="flex w-full items-center justify-between overflow-hidden">
                <div class="flex gap-2 overflow-hidden">
                  <span class="truncate">Peyote Plants</span>
                </div>
                <span v-tooltip="'This section is enabled on special occasions'" class="badge badge-plus ml-2">Seasonal</span>
              </div>
            </template>
            <template #default>
              <template v-if="peyotePlants.enabled.length">
                <h3 class="my-1 font-semibold">Enabled Peyote Plants</h3>
                <ul class="grid list-disc sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-3">
                  <template v-for="item in peyotePlants.enabled" :key="item">
                    <li class="ml-5">
                      <p class="v-popper--has-tooltip mr-2 truncate">{{ item }}</p>
                    </li>
                  </template>
                </ul>
              </template>
              <template v-if="settings.verbose && peyotePlants.disabled.length">
                <h3 class="my-1 font-semibold">Disabled Peyote Plants</h3>
                <ul class="grid list-disc sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-3">
                  <template v-for="item in peyotePlants.disabled" :key="item">
                    <li class="ml-5">
                      <p class="v-popper--has-tooltip mr-2 truncate">{{ item }}</p>
                    </li>
                  </template>
                </ul>
              </template>
              <a href="https://gtaweb.eu/gtao-map/ls/2dc" target="_blank" rel="noopener noreferrer"> See the locations on GTAWeb.eu </a>
            </template>
          </Accordion>
        </template>
        <template v-if="timeTrial || hswTimeTrial || rcTimeTrial">
          <Accordion :id="Accordions.TimeTrials">
            <template #title>Time Trials</template>
            <template #default>
              <ul class="list-disc">
                <template v-if="timeTrial">
                  <li class="ml-5"><strong>Time Trial:</strong> {{ timeTrial }}</li>
                </template>
                <template v-if="hswTimeTrial">
                  <li class="ml-5"><strong>HSW Time Trial:</strong> {{ hswTimeTrial }}</li>
                </template>
                <template v-if="rcTimeTrial">
                  <li class="ml-5"><strong>RC Bandito Time Trial:</strong> {{ rcTimeTrial }}</li>
                </template>
              </ul>
              <a href="https://gtaweb.eu/gtao-map/ls/6x5kxtvuwilukg" target="_blank" rel="noopener noreferrer">
                See the locations on GTAWeb.eu
              </a>
            </template>
          </Accordion>
        </template>
        <template v-if="gunVan && getTunable('XM22_GUN_VAN_STOCK_ID')">
          <Accordion :id="Accordions.GunVan">
            <template #title>Gun Van</template>
            <template #default>
              <h3 class="my-1 font-semibold">Weapons</h3>
              <ul class="list-disc">
                <template v-for="item in gunVan.weapons" :key="item">
                  <li class="ml-5">
                    {{ getLabel(item.item) }}
                    <template v-if="item.discount && item.discount_plus">
                      (<span>{{ Math.floor(item.discount * 100) }}%</span>,
                      <span class="text-plus">{{ Math.floor(item.discount_plus * 100) }}%</span>)
                    </template>
                    <template v-else-if="item.discount">
                      (<span>{{ Math.floor(item.discount * 100) }}%</span>)
                    </template>
                  </li>
                </template>
              </ul>
              <h3 class="my-1 font-semibold">Throwables</h3>
              <ul class="list-disc">
                <template v-for="item in gunVan.throwables" :key="item">
                  <li class="ml-5">
                    {{ getLabel(item.item) }}
                    <template v-if="item.discount && item.discount_plus">
                      (<span>{{ Math.floor(item.discount * 100) }}%</span>,
                      <span class="text-plus">{{ Math.floor(item.discount_plus * 100) }}%</span>)
                    </template>
                    <template v-else-if="item.discount">
                      (<span>{{ Math.floor(item.discount * 100) }}%</span>)
                    </template>
                  </li>
                </template>
              </ul>
              <h3 class="my-1 font-semibold">Body Armor</h3>
              <ul class="list-disc">
                <template v-for="item in gunVan.body_armor" :key="item">
                  <li class="ml-5">
                    {{ getLabel(item.item) }}
                    <template v-if="item.discount && item.discount_plus">
                      (<span>{{ Math.floor(item.discount * 100) }}%</span>,
                      <span class="text-plus">{{ Math.floor(item.discount_plus * 100) }}%</span>)
                    </template>
                    <template v-else-if="item.discount">
                      (<span>{{ Math.floor(item.discount * 100) }}%</span>)
                    </template>
                  </li>
                </template>
              </ul>
              <a href="https://gtaweb.eu/gtao-map/ls/2" target="_blank" rel="noopener noreferrer">See the location on GTAWeb.eu</a>
            </template>
          </Accordion>
        </template>
        <template v-if="casinoPrizeVehicle">
          <Accordion :id="Accordions.Casino">
            <template #title>Casino</template>
            <template #default>
              <ul class="list-disc">
                <template v-if="casinoPrizeVehicle">
                  <li class="ml-5"><strong>Podium Vehicle:</strong> {{ casinoPrizeVehicle }}</li>
                </template>
              </ul>
            </template>
          </Accordion>
        </template>
        <template
          v-if="
            carMeetPrizeObjective ||
            carMeetPrizeVehicle ||
            promoTestDriveVehicle1 ||
            promoTestDriveVehicle2 ||
            promoTestDriveVehicle3 ||
            hswTestRide
          "
        >
          <Accordion :id="Accordions.LsCarMeet">
            <template #title>LS Car Meet</template>
            <template #default>
              <template v-if="carMeetPrizeObjective || carMeetPrizeVehicle">
                <h3 class="my-1 font-semibold">Prize Ride</h3>
                <ul class="list-disc">
                  <template v-if="carMeetPrizeVehicle">
                    <li class="ml-5">{{ carMeetPrizeVehicle }}</li>
                  </template>
                  <template v-if="carMeetPrizeObjective">
                    <li class="ml-5">
                      <strong>Objective:</strong>
                      {{ carMeetPrizeObjective }}
                    </li>
                  </template>
                </ul>
              </template>
              <template v-if="promoTestDriveVehicle1 || promoTestDriveVehicle2 || promoTestDriveVehicle3 || hswTestRide">
                <h3 class="my-1 font-semibold">Test Rides</h3>
                <ul class="list-disc">
                  <template v-if="promoTestDriveVehicle1">
                    <li class="ml-5">{{ promoTestDriveVehicle1 }}</li>
                  </template>
                  <template v-if="promoTestDriveVehicle2">
                    <li class="ml-5">{{ promoTestDriveVehicle2 }}</li>
                  </template>
                  <template v-if="promoTestDriveVehicle3">
                    <li class="ml-5">{{ promoTestDriveVehicle3 }}</li>
                  </template>
                  <template v-if="hswTestRide">
                    <li class="ml-5"><strong>Premium:</strong> {{ hswTestRide }}</li>
                  </template>
                </ul>
              </template>
            </template>
          </Accordion>
        </template>
        <template v-if="luxuryShowcaseVehicle1 || luxuryShowcaseVehicle2">
          <Accordion :id="Accordions.LuxuryAutosShowroom">
            <template #title>Luxury Autos Showroom</template>
            <template #default>
              <ul class="list-disc">
                <template v-if="luxuryShowcaseVehicle1">
                  <li class="ml-5">{{ luxuryShowcaseVehicle1 }}</li>
                </template>
                <template v-if="luxuryShowcaseVehicle2">
                  <li class="ml-5">{{ luxuryShowcaseVehicle2 }}</li>
                </template>
              </ul>
            </template>
          </Accordion>
        </template>
        <template
          v-if="
            simeonTestDriveVehicle1 ||
            simeonTestDriveVehicle2 ||
            simeonTestDriveVehicle3 ||
            simeonTestDriveVehicle4 ||
            simeonTestDriveVehicle5
          "
        >
          <Accordion :id="Accordions.PremiumDeluxeMotorsportShowroom">
            <template #title>Premium Deluxe Motorsport Showroom</template>
            <template #default>
              <ul class="list-disc">
                <template v-if="simeonTestDriveVehicle1">
                  <li class="ml-5">{{ simeonTestDriveVehicle1 }}</li>
                </template>
                <template v-if="simeonTestDriveVehicle2">
                  <li class="ml-5">{{ simeonTestDriveVehicle2 }}</li>
                </template>
                <template v-if="simeonTestDriveVehicle3">
                  <li class="ml-5">{{ simeonTestDriveVehicle3 }}</li>
                </template>
                <template v-if="simeonTestDriveVehicle4">
                  <li class="ml-5">{{ simeonTestDriveVehicle4 }}</li>
                </template>
                <template v-if="simeonTestDriveVehicle5">
                  <li class="ml-5">{{ simeonTestDriveVehicle5 }}</li>
                </template>
              </ul>
            </template>
          </Accordion>
        </template>
        <template
          v-if="
            socialClubGaragePrizeVehicle ||
            socialClubGarageVehicle1 ||
            socialClubGarageVehicle2 ||
            socialClubGarageVehicle3 ||
            socialClubGarageVehicle4 ||
            socialClubGarageVehicle5 ||
            socialClubGarageVehicle6 ||
            socialClubGarageVehicle7 ||
            socialClubGarageVehicle8 ||
            socialClubGarageVehicle9
          "
        >
          <Accordion :id="Accordions.VinewoodCarClub">
            <template #title>Vinewood Car Club</template>
            <template #default>
              <ul class="list-disc">
                <template v-if="socialClubGaragePrizeVehicle">
                  <li class="ml-5"><strong>Reward Vehicle:</strong> {{ socialClubGaragePrizeVehicle }}</li>
                </template>
                <template v-if="socialClubGarageVehicle1">
                  <li class="ml-5">{{ socialClubGarageVehicle1 }}</li>
                </template>
                <template v-if="socialClubGarageVehicle2">
                  <li class="ml-5">{{ socialClubGarageVehicle2 }}</li>
                </template>
                <template v-if="socialClubGarageVehicle3">
                  <li class="ml-5">{{ socialClubGarageVehicle3 }}</li>
                </template>
                <template v-if="socialClubGarageVehicle4">
                  <li class="ml-5">{{ socialClubGarageVehicle4 }}</li>
                </template>
                <template v-if="socialClubGarageVehicle5">
                  <li class="ml-5">{{ socialClubGarageVehicle5 }}</li>
                </template>
                <template v-if="socialClubGarageVehicle6">
                  <li class="ml-5">{{ socialClubGarageVehicle6 }}</li>
                </template>
                <template v-if="socialClubGarageVehicle7">
                  <li class="ml-5">{{ socialClubGarageVehicle7 }}</li>
                </template>
                <template v-if="socialClubGarageVehicle8">
                  <li class="ml-5">{{ socialClubGarageVehicle8 }}</li>
                </template>
                <template v-if="socialClubGarageVehicle9">
                  <li class="ml-5">{{ socialClubGarageVehicle9 }}</li>
                </template>
              </ul>
            </template>
          </Accordion>
        </template>
        <template
          v-if="
            studioAppearanceEnabledMon ||
            studioAppearanceEnabledTue ||
            studioAppearanceEnabledWed ||
            studioAppearanceEnabledThu ||
            studioAppearanceEnabledFri ||
            studioAppearanceEnabledSat ||
            studioAppearanceEnabledSun
          "
        >
          <Accordion :id="Accordions.RecordAStudios">
            <template #title>Record A Studios</template>
            <template #default>
              <h3 class="my-1 font-semibold">Dr. Dre Studio Appearances:</h3>
              <ul class="list-disc">
                <li class="ml-5"><strong>Monday:</strong> {{ studioAppearanceEnabledMon ? 'Enabled' : 'Disabled' }}</li>
                <li class="ml-5"><strong>Tuesday:</strong> {{ studioAppearanceEnabledTue ? 'Enabled' : 'Disabled' }}</li>
                <li class="ml-5"><strong>Wednesday:</strong> {{ studioAppearanceEnabledWed ? 'Enabled' : 'Disabled' }}</li>
                <li class="ml-5"><strong>Thursday:</strong> {{ studioAppearanceEnabledThu ? 'Enabled' : 'Disabled' }}</li>
                <li class="ml-5"><strong>Friday:</strong> {{ studioAppearanceEnabledFri ? 'Enabled' : 'Disabled' }}</li>
                <li class="ml-5"><strong>Saturday:</strong> {{ studioAppearanceEnabledSat ? 'Enabled' : 'Disabled' }}</li>
                <li class="ml-5"><strong>Sunday:</strong> {{ studioAppearanceEnabledSun ? 'Enabled' : 'Disabled' }}</li>
              </ul>
              <a href="https://gtaweb.eu/gtao-map/ls/-/studio" target="_blank" rel="noopener noreferrer">Get notifications on GTAWeb.eu</a>
            </template>
          </Accordion>
        </template>
        <template v-if="salvageYardVehicle1 || salvageYardVehicle2 || salvageYardVehicle3">
          <Accordion :id="Accordions.SalvageYard">
            <template #title>Salvage Yard</template>
            <template #default>
              <h3 class="my-1 font-semibold">Robbery Vehicles:</h3>
              <ul class="list-disc">
                <li class="ml-5">{{ salvageYardVehicle1 }}</li>
                <li class="ml-5">{{ salvageYardVehicle2 }}</li>
                <li class="ml-5">{{ salvageYardVehicle3 }}</li>
              </ul>
              <a href="https://gtaweb.eu/gtao-map/ls/-/salvage-yards" target="_blank" rel="noopener noreferrer"
                >More information on GTAWeb.eu</a
              >
            </template>
          </Accordion>
        </template>
        <template
          v-if="
            dailyObjectiveMon ||
            dailyObjectiveTue ||
            dailyObjectiveWed ||
            dailyObjectiveThu ||
            dailyObjectiveFri ||
            dailyObjectiveSat ||
            dailyObjectiveSun
          "
        >
          <Accordion :id="Accordions.DailyObjectives">
            <template #title>Daily Objectives</template>
            <template #default>
              <ul class="list-disc">
                <template v-if="dailyObjectiveMon">
                  <li class="ml-5"><strong>Monday:</strong> {{ dailyObjectiveMon }}</li>
                </template>
                <template v-if="dailyObjectiveTue">
                  <li class="ml-5"><strong>Tuesday:</strong> {{ dailyObjectiveTue }}</li>
                </template>
                <template v-if="dailyObjectiveWed">
                  <li class="ml-5"><strong>Wednesday:</strong> {{ dailyObjectiveWed }}</li>
                </template>
                <template v-if="dailyObjectiveThu">
                  <li class="ml-5"><strong>Thursday:</strong> {{ dailyObjectiveThu }}</li>
                </template>
                <template v-if="dailyObjectiveFri">
                  <li class="ml-5"><strong>Friday:</strong> {{ dailyObjectiveFri }}</li>
                </template>
                <template v-if="dailyObjectiveSat">
                  <li class="ml-5"><strong>Saturday:</strong> {{ dailyObjectiveSat }}</li>
                </template>
                <template v-if="dailyObjectiveSun">
                  <li class="ml-5"><strong>Sunday:</strong> {{ dailyObjectiveSun }}</li>
                </template>
              </ul>
              <a href="https://gtaweb.eu/gtao-toolkit" target="_blank" rel="noopener noreferrer">Track on GTAWeb.eu</a>
            </template>
          </Accordion>
        </template>
        <template v-if="weeklyObjective">
          <Accordion :id="Accordions.WeeklyObjectives">
            <template #title>Weekly Objective</template>
            <template #default>
              <ul class="list-disc">
                <template v-if="weeklyObjective">
                  <li class="ml-5">{{ weeklyObjective }}</li>
                </template>
              </ul>
              <a href="https://gtaweb.eu/gtao-toolkit" target="_blank" rel="noopener noreferrer">Track on GTAWeb.eu</a>
            </template>
          </Accordion>
        </template>

        <!-- RDO -->
        <template v-if="rdoStamps">
          <Accordion :id="Accordions.RdoStamps">
            <template #title>Bonuses</template>
            <template #default>
              <ul class="list-disc">
                <template v-for="stamp in rdoStamps" :key="stamp">
                  <li class="ml-5">{{ stamp }}</li>
                </template>
              </ul>
              <p class="mt-2 text-xs text-slate-500">
                Since the detailed bonuses are not included in the tunables for Red Dead Online, this is not the full list.
              </p>
            </template>
          </Accordion>
        </template>
        <template v-if="rdoEvent">
          <Accordion :id="Accordions.RdoEvent">
            <template #title>Active Event</template>
            <template #default>
              <ul class="list-disc">
                <li class="ml-5"><strong>Event:</strong> {{ rdoEvent.event }}</li>
                <template v-if="rdoEvent.features">
                  <li class="ml-5"><strong>Features:</strong></li>
                  <ul class="list-disc">
                    <template v-for="feature in rdoEvent.features" :key="feature">
                      <li class="ml-12">{{ feature }}</li>
                    </template>
                  </ul>
                </template>
              </ul>
            </template>
          </Accordion>
        </template>
      </template>
      <template v-else>
        <template v-for="n in 5" :key="n">
          <div class="flex w-full items-center justify-between px-3 py-2 text-sm">
            <div class="animate-pulse rounded-xs bg-slate-300 dark:bg-slate-600" :style="{ width: random(4, 20) + 'em' }">&nbsp;</div>
          </div>
        </template>
      </template>
    </template>
    <template v-if="settings.quickView" #footer>
      <CardFooter>
        <div class="truncate">
          <template v-if="game === 'gta'">
            Find more locations and details on <a href="https://gtaweb.eu/gtav-map" target="_blank" rel="noopener noreferrer">GTAWeb.eu</a>.
          </template>
          <template v-if="game === 'rdo'">
            Find more locations and details on
            <a href="https://jeanropke.github.io/RDOMap/" target="_blank" rel="noopener noreferrer">the RDO map</a>.
          </template>
          <a href="https://x.com/Tunables" target="_blank" rel="noopener noreferrer"
            >Contact us on <font-awesome-icon icon="fa-brands fa-x-twitter" aria-label="X"
          /></a>
          if you have suggestions for the Quick View!
        </div>
      </CardFooter>
    </template>
  </Card>
</template>
