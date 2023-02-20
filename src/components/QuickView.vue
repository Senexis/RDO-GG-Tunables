<script setup>
import { ArrowPathIcon, EyeSlashIcon, ExclamationTriangleIcon } from "@heroicons/vue/24/outline";

import Accordion from "./Accordion.vue";
import Card from "./Cards/Card.vue";
import CardHeader from "./Cards/CardHeader.vue";
import CardFooter from "./Cards/CardFooter.vue";

import { useStore } from "../stores/settings.js";
import { computed, onMounted, ref } from "vue";
import { orderObject } from "../utilities/general";

const emit = defineEmits(["error"]);

const props = defineProps({
  loading: {
    type: Boolean,
    required: true,
  },
  tunables: {
    type: Object,
    default: null,
  },
});

const settings = useStore();

const data = ref({
  loading: true,

  dailyObjectives: null,
  rcTimeTrials: null,
  hswTimeTrials: null,
  timeTrials: null,
  vehicles: null,
  weapons: null,
  tunableDefaults: null,
  tunableTypes: null,
});

/**
 * Triggers a game update to initialize the difference display.
 */
onMounted(() => {
  try {
    handleQuickViewInit();
  } catch (error) {
    emit("error", "An unknown error occurred. (6D1FCF8B)", error);
  }
});

/**
 * Handles the quick view init event.
 */
async function handleQuickViewInit() {
  try {
    data.value.loading = true;

    const dailyObjectives = await request("/data/daily_objectives.json");
    const hswTimeTrials = await request("/data/hsw_time_trials.json");
    const labels = await request("/data/labels.json");
    const rcTimeTrials = await request("/data/rc_time_trials.json");
    const timeTrials = await request("/data/time_trials.json");
    const tunableDefaults = await request("/data/tunable_defaults.json");
    const tunableTypes = await request("/data/tunable_types.json");

    data.value = {
      loading: false,
      dailyObjectives,
      hswTimeTrials,
      labels,
      rcTimeTrials,
      timeTrials,
      tunableDefaults,
      tunableTypes,
    };
  } catch (error) {
    emit("error", "An unknown error occurred. (9A5D1051)", error);
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
    emit("error", "An unknown error occurred. (1B69EB10)", error);
  }
}

/**
 * Handles the hide quick view event.
 *
 * @returns {void}
 */
function handleHideQuickView() {
  try {
    settings.quickView = false;
  } catch (error) {
    emit("error", "An unknown error occurred. (892CDFE2)", error);
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
    emit("error", "An unknown error occurred. (8A01F8A0)", error);
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
    emit("error", "An unknown error occurred. (BD8056FF)", error);
  }
}

/**
 * Tries to retrieve a tunable.
 *
 * @param {string} query The query to search for.
 */
function findTunable(query) {
  try {
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
    emit("error", "An unknown error occurred. (F89A8514)", error);
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
    emit("error", "An unknown error occurred. (8A01F8A0)", error);
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
    emit("error", "An unknown error occurred. (D24280B2)", error);
  }
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
    if (!data.value.dailyObjectives) return value;
    return data.value.dailyObjectives[value] ?? value;
  } catch (error) {
    emit("error", "An unknown error occurred. (144BBEE1)", error);
  }
}

/**
 * Retrieves the RC time trial for a tunable.
 *
 * @param {string} tunable The tunable to retrieve the RC time trial for.
 * @returns {string|null}
 */
function getRcTimeTrial() {
  try {
    const value = getTunable("RCTIMETRIALVARIATION");
    if (value === null || value === -1) return null;
    if (!data.value.rcTimeTrials) return value;
    return data.value.rcTimeTrials[value] ?? value;
  } catch (error) {
    emit("error", "An unknown error occurred. (1013FD58)", error);
  }
}

/**
 * Retrieves the HSW time trial for a tunable.
 *
 * @param {string} tunable The tunable to retrieve the HSW time trial for.
 * @returns {string|null}
 */
function getHswTimeTrial() {
  try {
    const value = getTunable("HSW_TIME_TRIAL_SUBVARIATION");
    if (value === null || value === -1) return null;
    if (!data.value.hswTimeTrials) return value;
    return data.value.hswTimeTrials[value] ?? value;
  } catch (error) {
    emit("error", "An unknown error occurred. (9BE71C1E)", error);
  }
}

/**
 * Retrieves the time trial for a tunable.
 *
 * @param {string} tunable The tunable to retrieve the time trial for.
 * @returns {string|null}
 */
function getTimeTrial() {
  try {
    const value = getTunable("TIMETRIALVARIATION");
    if (value === null || value === -1) return null;
    if (!data.value.timeTrials) return value;
    return data.value.timeTrials[value] ?? value;
  } catch (error) {
    emit("error", "An unknown error occurred. (BF45361D)", error);
  }
}

/**
 * Retrieves the car meet prize objective.
 *
 * @returns {string|null}
 */
function getCarMeetPrizeObjective() {
  try {
    const id = getTunable("CAR_MEET_PRIZE_VEHICLE_CHALLENGE_ID");
    const paramOne = getTunable("CAR_MEET_PRIZE_VEHICLE_CHALLENGE_PARAM_ONE");
    const paramTwo = getTunable("CAR_MEET_PRIZE_VEHICLE_CHALLENGE_PARAM_TWO");

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
      default:
        return null;
    }
  } catch (error) {
    emit("error", "An unknown error occurred. (E9F80C5D)", error);
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
        { item: "WEAPON_BAT", discount: null, discount_plus: null },
        { item: "WEAPON_KNIFE", discount: null, discount_plus: null },
        { item: "WEAPON_RAILGUNXM3", discount: null, discount_plus: null },
        { item: "WEAPON_MICROSMG", discount: null, discount_plus: null },
        { item: "WEAPON_PUMPSHOTGUN", discount: null, discount_plus: null },
      ],
      throwables: [{ item: "WEAPON_STICKYBOMB", discount: null, discount_plus: null }],
      body_armor: [
        { item: "WT_BA_0", discount: null, discount_plus: null },
        { item: "WT_BA_1", discount: null, discount_plus: null },
        { item: "WT_BA_2", discount: null, discount_plus: null },
        { item: "WT_BA_3", discount: null, discount_plus: null },
        { item: "WT_BA_4", discount: null, discount_plus: null },
      ],
    };

    for (let i = 0; i < 10; i++) {
      const item = getTunable(`XM22_GUN_VAN_SLOT_WEAPON_TYPE_${i}`);
      if (item) {
        result["weapons"][i] = {
          item: item,
          discount: null,
          discount_plus: null,
        };
      }

      if (!result["weapons"][i]) continue;

      const discount = getTunable(`XM22_GUN_VAN_SLOT_WEAPON_DISCOUNT_${i}`, "BASE_GLOBALS");
      if (discount) {
        result["weapons"][i].discount = discount;
      }

      const discount_plus = getTunable(`XM22_GUN_VAN_SLOT_WEAPON_DISCOUNT_${i}`, "MP_FM_MEMBERSHIP");
      if (discount_plus) {
        result["weapons"][i].discount_plus = discount_plus;
      }
    }

    for (let i = 0; i < 3; i++) {
      const item = getTunable(`XM22_GUN_VAN_SLOT_THROWABLE_TYPE_${i}`);
      if (item) {
        result["throwables"][i] = {
          item: item,
          discount: null,
          discount_plus: null,
        };
      }

      if (!result["throwables"][i]) continue;

      const discount = getTunable(`XM22_GUN_VAN_SLOT_THROWABLE_DISCOUNT_${i}`, "BASE_GLOBALS");
      if (discount) {
        result["throwables"][i].discount = discount;
      }

      const discount_plus = getTunable(`XM22_GUN_VAN_SLOT_THROWABLE_DISCOUNT_${i}`, "MP_FM_MEMBERSHIP");
      if (discount_plus) {
        result["throwables"][i].discount_plus = discount_plus;
      }
    }

    for (let i = 0; i < 5; i++) {
      const item = getTunable(`XM22_GUN_VAN_SLOT_ARMOUR_TYPE_${i}`);
      if (item) {
        result["body_armor"][i] = {
          item: item,
          discount: null,
          discount_plus: null,
        };
      }

      if (!result["body_armor"][i]) continue;

      const discount = getTunable(`XM22_GUN_VAN_SLOT_ARMOUR_DISCOUNT_${i}`, "BASE_GLOBALS");
      if (discount) {
        result["body_armor"][i].discount = discount;
      }

      const discount_plus = getTunable(`XM22_GUN_VAN_SLOT_ARMOUR_DISCOUNT_${i}`, "MP_FM_MEMBERSHIP");
      if (discount_plus) {
        result["body_armor"][i].discount_plus = discount_plus;
      }
    }

    return result;
  } catch (error) {
    emit("error", "An unknown error occurred. (C0350559)", error);
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

      const salesTitle = tunable.context === "MP_FM_MEMBERSHIP" ? `${tunableType.type}_plus` : tunableType.type;
      const baseValue = getTunableDefault(tunableType.key);

      results[salesTitle] = results[salesTitle] || {};
      results[salesTitle][tunableType.display] = results[salesTitle][tunableType.display] || [];

      if (baseValue) {
        const percentage = 100 - Math.round((tunable.value / baseValue) * 100);
        results[salesTitle][tunableType.display].push([tunable.value, percentage]);
      } else {
        results[salesTitle][tunableType.display].push([tunable.value, null]);
      }
    }

    return orderObject(results, true);
  } catch (error) {
    emit("error", "An unknown error occurred. (31D92717)", error);
  }
}

/**
 * Retrieves the title for the sales section.
 *
 * @returns string
 */
function getSalesTitle(title) {
  try {
    switch (title) {
      case "biker_business_sales":
        return "Biker Business Sales";
      case "biker_business_sales_plus":
        return "Biker Business Sales (GTA+)";
      case "bunker_sales":
        return "Bunker Sales";
      case "bunker_sales_plus":
        return "Bunker Sales (GTA+)";
      case "vehicle_sales":
        return "Vehicle Sales";
      case "vehicle_sales_plus":
        return "Vehicle Sales (GTA+)";
      case "vehicle_upgrade_sales":
        return "Vehicle Upgrade Sales";
      case "vehicle_upgrade_sales_plus":
        return "Vehicle Upgrade Sales (GTA+)";
      case "weapon_sales":
        return "Weapon Sales";
      case "weapon_sales_plus":
        return "Weapon Sales (GTA+)";
      default:
        return "Miscellaneous";
    }
  } catch (error) {
    emit("error", "An unknown error occurred. (04CAE23B)", error);
  }
}

/**
 * Retrieves the text to display for cash sales.
 *
 * @returns string
 */
function formatCashSale(discounts) {
  try {
    const fc = Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format;

    return discounts
      .sort((a, b) => a[0] - b[0])
      .filter((a, i, arr) => arr.findIndex((b) => a[0] === b[0]) === i)
      .map((i) => `${fc(i[0])} ${i[1] ? `(${i[1]}%)` : ""}`.trim())
      .join(" - ");
  } catch (error) {
    emit("error", "An unknown error occurred. (C37D9727)", error);
  }
}

const carMeetPrizeObjective = computed(() => getCarMeetPrizeObjective());
const carMeetPrizeVehicle = computed(() => getVehicleTunable("CAR_MEET_PRIZE_VEHICLE"));
const promoTestDriveVehicle1 = computed(() => getVehicleTunable("PROMO_TEST_DRIVE_VEHICLE_1"));
const promoTestDriveVehicle2 = computed(() => getVehicleTunable("PROMO_TEST_DRIVE_VEHICLE_2"));
const promoTestDriveVehicle3 = computed(() => getVehicleTunable("PROMO_TEST_DRIVE_VEHICLE_3"));
const hswTestRide = computed(() => getVehicleTunable("HSW_TEST_RIDE"));
const casinoPrizeVehicle = computed(() => getVehicleTunable("CASINO_PRIZE_VEHICLE"));
const luxuryShowcaseVehicle1 = computed(() => getVehicleTunable("LUXURY_SHOWCASE_VEHICLE_1"));
const luxuryShowcaseVehicle2 = computed(() => getVehicleTunable("LUXURY_SHOWCASE_VEHICLE_2"));
const simeonTestDriveVehicle1 = computed(() => getVehicleTunable("SIMEON_TEST_DRIVE_VEHICLE_1"));
const simeonTestDriveVehicle2 = computed(() => getVehicleTunable("SIMEON_TEST_DRIVE_VEHICLE_2"));
const simeonTestDriveVehicle3 = computed(() => getVehicleTunable("SIMEON_TEST_DRIVE_VEHICLE_3"));
const simeonTestDriveVehicle4 = computed(() => getVehicleTunable("SIMEON_TEST_DRIVE_VEHICLE_4"));
const simeonTestDriveVehicle5 = computed(() => getVehicleTunable("SIMEON_TEST_DRIVE_VEHICLE_5"));
const dailyObjectiveMon = computed(() => getDailyObjective("MON"));
const dailyObjectiveTue = computed(() => getDailyObjective("TUE"));
const dailyObjectiveWed = computed(() => getDailyObjective("WED"));
const dailyObjectiveThu = computed(() => getDailyObjective("THU"));
const dailyObjectiveFri = computed(() => getDailyObjective("FRI"));
const dailyObjectiveSat = computed(() => getDailyObjective("SAT"));
const dailyObjectiveSun = computed(() => getDailyObjective("SUN"));
const timeTrial = computed(() => getTimeTrial());
const hswTimeTrial = computed(() => getHswTimeTrial());
const rcTimeTrial = computed(() => getRcTimeTrial());
const gunVan = computed(() => getGunVan());
const sales = computed(() => getSales());
</script>

<template>
  <Card v-if="settings.quickView">
    <template #header>
      <CardHeader class="flex flex-row items-center justify-between">
        <h1 class="truncate">Quick View</h1>
        <div class="whitespace-nowrap">
          <button
            @click="handleHideQuickView"
            type="button"
            class="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky disabled:opacity-50 disabled:pointer-events-none"
          >
            <span class="sr-only">Hide Quick View</span>
            <EyeSlashIcon class="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </CardHeader>
    </template>
    <template #default>
      <template v-if="!loading && !data.loading && tunables">
        <Accordion id="sales">
          <template #title>Sales & Bonuses</template>
          <template #default>
            <p class="mb-4 text-sm text-slate-400 border border-yellow-600 rounded-lg bg-yellow-500/5 p-2 flex items-center gap-2">
              <ExclamationTriangleIcon class="hidden md:block w-6 h-6 text-yellow-600" />
              <span>
                <strong>Note:</strong> This is a <strong>generated, likely incomplete</strong> list based on
                <a
                  href="https://github.com/Senexis/RDO-GG-Tunables/blob/main/public/data/tunable_types.json"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  certain conditions
                </a>
                and will need updates over time.<br />
                For more accurate updates on the latest sales and bonuses as well as items that may be missing from this list, follow
                <a href="https://twitter.com/TezFunz2" target="_blank" rel="noopener noreferrer">@TezFunz2</a> on Twitter.</span
              >
            </p>

            <div class="rounded-lg overflow-hidden bg-slate-800 divide-y divide-slate-700 border border-slate-700">
              <template v-if="sales && Object.keys(sales).length">
                <template v-for="(category, key) in sales" :key="key">
                  <Accordion :id="`sales_${key}`">
                    <template #title>
                      <div class="flex justify-between items-center w-full">
                        <span>{{ getSalesTitle(key) }}</span>
                        <span class="inline-flex items-center rounded-full bg-sky-700 px-2.5 py-0.5 text-xs font-medium text-white">
                          {{ Object.keys(category).length === 1 ? "1 item" : `${Object.keys(category).length} items` }}
                        </span>
                      </div>
                    </template>
                    <template #default>
                      <ul class="list-disc">
                        <template v-for="(discounts, item) in category" :key="item">
                          <li class="ml-8">{{ getLabel(item) }}: {{ formatCashSale(discounts) }}</li>
                        </template>
                      </ul>
                    </template>
                  </Accordion>
                </template>
              </template>
              <template v-else>
                <p class="mb-4">No sales found.</p>
              </template>
            </div>
          </template>
        </Accordion>
        <template v-if="timeTrial || hswTimeTrial || rcTimeTrial">
          <Accordion id="time_trials">
            <template #title>Time Trials</template>
            <template #default>
              <ul class="list-disc">
                <template v-if="timeTrial">
                  <li class="ml-8"><strong>Time Trial:</strong> {{ timeTrial }}</li>
                </template>
                <template v-if="hswTimeTrial">
                  <li class="ml-8"><strong>HSW Time Trial:</strong> {{ hswTimeTrial }}</li>
                </template>
                <template v-if="rcTimeTrial">
                  <li class="ml-8"><strong>RC Bandito Time Trial:</strong> {{ rcTimeTrial }}</li>
                </template>
              </ul>
              <a href="https://gtaweb.eu/gtao-map/ls/6x5kxtvuwilukg" target="_blank" rel="noopener noreferrer">
                See the locations on GTAWeb.eu
              </a>
            </template>
          </Accordion>
        </template>
        <template v-if="gunVan && getTunable('XM22_GUN_VAN_STOCK_ID')">
          <Accordion id="gun_van">
            <template #title>Gun Van</template>
            <template #default>
              <h3 class="my-1 font-bold">Weapons</h3>
              <ul class="list-disc">
                <template v-for="item in gunVan.weapons" :key="item">
                  <li class="ml-8">
                    {{ getLabel(item.item) }}
                    <template v-if="item.discount && item.discount_plus">
                      (<span>{{ Math.floor(item.discount * 100) }}%</span>,
                      <span class="text-yellow-500">{{ Math.floor(item.discount_plus * 100) }}%</span>)
                    </template>
                    <template v-else-if="item.discount">
                      (<span>{{ Math.floor(item.discount * 100) }}%</span>)
                    </template>
                  </li>
                </template>
              </ul>
              <h3 class="my-1 font-bold">Throwables</h3>
              <ul class="list-disc">
                <template v-for="item in gunVan.throwables" :key="item">
                  <li class="ml-8">
                    {{ getLabel(item.item) }}
                    <template v-if="item.discount && item.discount_plus">
                      (<span>{{ Math.floor(item.discount * 100) }}%</span>,
                      <span class="text-yellow-500">{{ Math.floor(item.discount_plus * 100) }}%</span>)
                    </template>
                    <template v-else-if="item.discount">
                      (<span>{{ Math.floor(item.discount * 100) }}%</span>)
                    </template>
                  </li>
                </template>
              </ul>
              <h3 class="my-1 font-bold">Body Armor</h3>
              <ul class="list-disc">
                <template v-for="item in gunVan.body_armor" :key="item">
                  <li class="ml-8">
                    {{ getLabel(item.item) }}
                    <template v-if="item.discount && item.discount_plus">
                      (<span>{{ Math.floor(item.discount * 100) }}%</span>,
                      <span class="text-yellow-500">{{ Math.floor(item.discount_plus * 100) }}%</span>)
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
          <Accordion id="casino">
            <template #title>Casino</template>
            <template #default>
              <ul class="list-disc">
                <template v-if="casinoPrizeVehicle">
                  <li class="ml-8"><strong>Podium Vehicle:</strong> {{ casinoPrizeVehicle }}</li>
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
          <Accordion id="ls_car_meet">
            <template #title>LS Car Meet</template>
            <template #default>
              <ul class="list-disc">
                <template v-if="carMeetPrizeObjective">
                  <li class="ml-8">
                    <strong>Prize Ride Objective:</strong>
                    {{ carMeetPrizeObjective }}
                  </li>
                </template>
                <template v-if="carMeetPrizeVehicle">
                  <li class="ml-8"><strong>Prize Ride:</strong> {{ carMeetPrizeVehicle }}</li>
                </template>
                <template v-if="promoTestDriveVehicle1">
                  <li class="ml-8"><strong>Test Ride 1:</strong> {{ promoTestDriveVehicle1 }}</li>
                </template>
                <template v-if="promoTestDriveVehicle2">
                  <li class="ml-8"><strong>Test Ride 2:</strong> {{ promoTestDriveVehicle2 }}</li>
                </template>
                <template v-if="promoTestDriveVehicle3">
                  <li class="ml-8"><strong>Test Ride 3:</strong> {{ promoTestDriveVehicle3 }}</li>
                </template>
                <template v-if="hswTestRide">
                  <li class="ml-8"><strong>Premium Test Ride:</strong> {{ hswTestRide }}</li>
                </template>
              </ul>
            </template>
          </Accordion>
        </template>
        <template v-if="luxuryShowcaseVehicle1 || luxuryShowcaseVehicle2">
          <Accordion id="luxury_autos_showroom">
            <template #title>Luxury Autos Showroom</template>
            <template #default>
              <ul class="list-disc">
                <template v-if="luxuryShowcaseVehicle1">
                  <li class="ml-8"><strong>Vehicle 1:</strong> {{ luxuryShowcaseVehicle1 }}</li>
                </template>
                <template v-if="luxuryShowcaseVehicle2">
                  <li class="ml-8"><strong>Vehicle 2:</strong> {{ luxuryShowcaseVehicle2 }}</li>
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
          <Accordion id="premium_deluxe_motorsport_showroom">
            <template #title>Premium Deluxe Motorsport Showroom</template>
            <template #default>
              <ul class="list-disc">
                <template v-if="simeonTestDriveVehicle1">
                  <li class="ml-8"><strong>Vehicle 1:</strong> {{ simeonTestDriveVehicle1 }}</li>
                </template>
                <template v-if="simeonTestDriveVehicle2">
                  <li class="ml-8"><strong>Vehicle 2:</strong> {{ simeonTestDriveVehicle2 }}</li>
                </template>
                <template v-if="simeonTestDriveVehicle3">
                  <li class="ml-8"><strong>Vehicle 3:</strong> {{ simeonTestDriveVehicle3 }}</li>
                </template>
                <template v-if="simeonTestDriveVehicle4">
                  <li class="ml-8"><strong>Vehicle 4:</strong> {{ simeonTestDriveVehicle4 }}</li>
                </template>
                <template v-if="simeonTestDriveVehicle5">
                  <li class="ml-8"><strong>Vehicle 5:</strong> {{ simeonTestDriveVehicle5 }}</li>
                </template>
              </ul>
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
          <Accordion id="daily_objectives">
            <template #title>Daily Objectives</template>
            <template #default>
              <ul class="list-disc">
                <template v-if="dailyObjectiveMon">
                  <li class="ml-8"><strong>Monday:</strong> {{ dailyObjectiveMon }}</li>
                </template>
                <template v-if="dailyObjectiveTue">
                  <li class="ml-8"><strong>Tuesday:</strong> {{ dailyObjectiveTue }}</li>
                </template>
                <template v-if="dailyObjectiveWed">
                  <li class="ml-8"><strong>Wednesday:</strong> {{ dailyObjectiveWed }}</li>
                </template>
                <template v-if="dailyObjectiveThu">
                  <li class="ml-8"><strong>Thursday:</strong> {{ dailyObjectiveThu }}</li>
                </template>
                <template v-if="dailyObjectiveFri">
                  <li class="ml-8"><strong>Friday:</strong> {{ dailyObjectiveFri }}</li>
                </template>
                <template v-if="dailyObjectiveSat">
                  <li class="ml-8"><strong>Saturday:</strong> {{ dailyObjectiveSat }}</li>
                </template>
                <template v-if="dailyObjectiveSun">
                  <li class="ml-8"><strong>Sunday:</strong> {{ dailyObjectiveSun }}</li>
                </template>
              </ul>
            </template>
          </Accordion>
        </template>
      </template>
      <template v-else>
        <div class="bg-slate-900 px-2 py-2 sm:p-4 flex flex-col items-center justify-center gap-2">
          <ArrowPathIcon class="block animate-spin h-12 w-12" aria-hidden="true" />
          <p class="text-lg font-medium">Loading...</p>
        </div>
      </template>
    </template>
    <template #footer>
      <CardFooter>
        <div class="truncate text-sm leading-tight">Let us know on Twitter if there's something you want added!</div>
      </CardFooter>
    </template>
  </Card>
</template>
