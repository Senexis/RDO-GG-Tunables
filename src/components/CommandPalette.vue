<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid';
import {
  ArrowDownTrayIcon,
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  ArrowsUpDownIcon,
  BoltIcon,
  BoltSlashIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  MoonIcon,
} from '@heroicons/vue/24/outline';
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue';

const items = [
  { name: 'Open Settings', icon: Cog6ToothIcon, shortcut: null, event: null, url: null },
  { name: 'Open Download Tunables', icon: ArrowDownTrayIcon, shortcut: null, event: null, url: null },
  { name: 'Switch Game to GTA Online', icon: null, shortcut: null, event: null, url: null },
  { name: 'Switch Game to Red Dead Online', icon: null, shortcut: null, event: null, url: null },

  // Items past this point are search-only
  { name: 'Collapse All Quick View Sections Except Sales', icon: CurrencyDollarIcon, shortcut: null, event: null, url: null },
  { name: 'Collapse All Quick View Sections', icon: ArrowsPointingInIcon, shortcut: null, event: null, url: null },
  { name: 'Collapse Quick View', icon: ArrowsPointingInIcon, shortcut: null, event: null, url: null },
  { name: 'Collapse Tunables', icon: ArrowsPointingInIcon, shortcut: null, event: null, url: null },
  { name: 'Compare Latest Tunables', icon: ChevronDoubleRightIcon, shortcut: null, event: null, url: null },
  { name: 'Compare Next Tunables', icon: ChevronRightIcon, shortcut: null, event: null, url: null },
  { name: 'Compare Previous Tunables', icon: ChevronLeftIcon, shortcut: null, event: null, url: null },
  { name: 'Expand All Quick View Sections', icon: ArrowsPointingOutIcon, shortcut: null, event: null, url: null },
  { name: 'Switch Platform to PC', icon: null, shortcut: null, event: null, url: null },
  { name: 'Switch Platform to PlayStation 4', icon: null, shortcut: null, event: null, url: null },
  { name: 'Switch Platform to PlayStation 5', icon: null, shortcut: null, event: null, url: null },
  { name: 'Switch Platform to Xbox One', icon: null, shortcut: null, event: null, url: null },
  { name: 'Switch Platform to Xbox Series S|X', icon: null, shortcut: null, event: null, url: null },
  { name: 'Switch Quick View and Tunables Order', icon: ArrowsUpDownIcon, shortcut: null, event: null, url: null },
  { name: 'Toggle "Go to week" Banner', icon: null, shortcut: null, event: null, url: null },
  { name: 'Toggle Added Tunables', icon: null, shortcut: null, event: null, url: null },
  { name: 'Toggle All Tunables', icon: null, shortcut: null, event: null, url: null },
  { name: 'Toggle Banners', icon: null, shortcut: null, event: null, url: null },
  { name: 'Toggle Content List Tunables', icon: null, shortcut: null, event: null, url: null },
  { name: 'Toggle Dark Mode', icon: MoonIcon, shortcut: null, event: null, url: null },
  { name: 'Toggle Deleted Tunables', icon: null, shortcut: null, event: null, url: null },
  { name: 'Toggle Modified Tunables', icon: null, shortcut: null, event: null, url: null },
  { name: 'Toggle Quick View Panel', icon: null, shortcut: null, event: null, url: null },
  { name: 'Toggle Quick View Tunables', icon: null, shortcut: null, event: null, url: null },
  { name: 'Toggle Sale & Bonus Tunables', icon: null, shortcut: null, event: null, url: null },
  { name: 'Toggle Tunable Metadata', icon: null, shortcut: null, event: null, url: null },
  { name: 'Toggle Tunables Panel', icon: null, shortcut: null, event: null, url: null },
  { name: 'Toggle Unchanged Tunables', icon: null, shortcut: null, event: null, url: null },
  { name: 'Toggle Verbose Tunables', icon: null, shortcut: null, event: null, url: null },
];

const featured = computed(() => items.slice(0, 4));

const open = ref(false);
const query = ref('');

const filtered = computed(() =>
  query.value === ''
    ? []
    : items.filter((item) => item.name.toLowerCase().includes(query.value.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name))
);

function onSelect(item) {
  open.value = false;

  if (item.event) {
    document.dispatchEvent(new CustomEvent(item.event));
  } else if (item.url) {
    window.location = item.url;
  } else {
    console.warn(`No event or URL defined for Quick Action "${item.name}"`);
  }
}

function onHotkeySearch() {
  open.value = true;
}

onMounted(() => {
  document.addEventListener('hotkey-search', onHotkeySearch);
});

onBeforeUnmount(() => {
  document.removeEventListener('hotkey-search', onHotkeySearch);
});
</script>

<template>
  <TransitionRoot :show="open" as="template" @after-leave="query = ''" appear>
    <Dialog as="div" class="relative z-10" @close="open = false">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-slate-500/75 dark:bg-slate-800/75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
        <TransitionChild
          as="template"
          enter="ease-out duration-200"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="ease-in duration-100"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel
            class="mx-auto max-w-2xl transform divide-y overflow-hidden rounded-xl backdrop-blur backdrop-filter shadow-2xl transition-all divide-slate-100 ring-1 ring-black ring-opacity-5 dark:divide-slate-500 dark:divide-opacity-20 bg-white dark:bg-slate-900 !bg-opacity-80"
          >
            <Combobox @update:modelValue="onSelect">
              <div class="relative">
                <MagnifyingGlassIcon
                  class="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-900 text-opacity-40 dark:text-slate-400 dark:text-opacity-100"
                  aria-hidden="true"
                />
                <ComboboxInput
                  class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-slate-900 dark:text-slate-400 focus:ring-0 sm:text-sm"
                  placeholder="Search..."
                  @change="query = $event.target.value"
                />
              </div>

              <ComboboxOptions
                v-if="query === '' || filtered.length > 0"
                static
                class="max-h-80 scroll-py-2 divide-y divide-slate-500 divide-opacity-10 overflow-y-auto"
              >
                <li class="p-2">
                  <h2 class="sr-only">Quick actions</h2>
                  <ul class="text-sm text-slate-700 dark:text-slate-400">
                    <ComboboxOption
                      v-for="action in query === '' ? featured : filtered"
                      :key="action.name"
                      :value="action"
                      as="template"
                      v-slot="{ active }"
                    >
                      <li :class="['flex cursor-pointer select-none items-center rounded-md px-3 py-2', active && 'bg-sky-600 text-white']">
                        <component
                          :is="action.icon || BoltIcon"
                          :class="[
                            'h-6 w-6 flex-none',
                            active
                              ? 'text-white text-opacity-100'
                              : 'text-slate-900 text-opacity-40 dark:text-slate-400 dark:text-opacity-100',
                          ]"
                          aria-hidden="true"
                        />
                        <span class="ml-3 flex-auto truncate">{{ action.name }}</span>
                        <span v-if="active" class="ml-3 flex-none text-sky-100">Run...</span>
                        <span v-if="!active && action.shortcut" class="ml-3 flex-none text-xs font-semibold text-slate-500">
                          <kbd class="font-mono mr-0.5">⌘</kbd>
                          <kbd class="font-mono">{{ action.shortcut }}</kbd>
                        </span>
                      </li>
                    </ComboboxOption>
                  </ul>
                </li>
              </ComboboxOptions>

              <div v-if="query !== '' && filtered.length === 0" class="px-6 py-14 text-center sm:px-14">
                <BoltSlashIcon
                  class="mx-auto h-6 w-6 text-slate-900 text-opacity-40 dark:text-slate-400 dark:text-opacity-100"
                  aria-hidden="true"
                />
                <p class="mt-4 text-sm text-slate-900 dark:text-slate-400">No Quick Actions found. Please try again.</p>
              </div>

              <div
                class="flex flex-row items-center gap-1 px-2 py-1.5 border-t border-slate-500 border-opacity-10 bg-slate-50 dark:bg-slate-800 !bg-opacity-80"
              >
                <div class="flex-shrink-0 rounded bg-amber-800 p-0.5">
                  <BoltIcon class="h-4 w-4 text-slate-50" aria-hidden="true" />
                </div>
                <p class="text-xs text-slate-500">Quick Actions is experimental. You may encounter issues using it.</p>
              </div>
            </Combobox>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
