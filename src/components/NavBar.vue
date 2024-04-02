<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { ArrowDownTrayIcon, Bars3Icon, Cog6ToothIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const emit = defineEmits(['configure', 'download']);

const navigation = [
  { name: 'API', href: 'https://rdo.gg/api/#tag/tunables', external: true },
  { name: 'Patreon', href: 'https://rdo.gg/patreon/', icon: 'fa-brands fa-patreon', external: true },
  { name: 'X', href: 'https://x.com/Tunables', icon: 'fa-brands fa-x-twitter', external: true },
  { name: 'Bluesky', href: 'https://bsky.app/profile/tunables.rdo.gg', bsky: true, external: true },
  { name: 'Discord', href: 'https://rdo.gg/discord/', icon: 'fa-brands fa-discord', external: true },
  { name: 'GitHub', href: 'https://github.com/Senexis/RDO-GG-Tunables', icon: 'fa-brands fa-github', external: true },
];
</script>

<template>
  <Disclosure as="nav" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
          <div class="flex flex-shrink-0 items-center mr-4">
            <a href="https://tunables.rdo.gg/">
              <img class="h-8 w-auto" src="https://rdo.gg/img/menu.png" alt="Tunables" />
            </a>
          </div>
          <div class="hidden sm:block">
            <div class="flex space-x-2">
              <a
                v-for="item in navigation"
                :key="item.name"
                :href="item.href"
                :class="[
                  item.current
                    ? 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-50'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-50',
                  'px-3 py-2 rounded-md text-sm font-medium',
                ]"
                :target="item.external ? '_blank' : undefined"
                :rel="item.external ? 'noopener noreferrer' : undefined"
                :aria-current="item.current ? 'page' : undefined"
                v-tooltip="item.icon || item.bsky ? item.name : undefined"
              >
                <template v-if="item.icon">
                  <span class="sr-only">{{ item.name }}</span>
                  <font-awesome-icon :icon="item.icon" />
                </template>
                <template v-else-if="item.bsky">
                  <svg class="svg-inline--fa" viewBox="0 0 360 320" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M254.896 184.158C252.81 183.926 250.733 183.645 248.671 183.315C250.773 183.574 252.849 183.855 254.896 184.158Z"
                      fill="currentColor"
                    />
                    <path
                      d="M180 141.964C163.699 110.262 119.308 51.1817 78.0347 22.044C38.4971 -5.86834 23.414 -1.03207 13.526 3.43594C2.08093 8.60755 0 26.1785 0 36.5164C0 46.8542 5.66748 121.272 9.36416 133.694C21.5786 174.738 65.0603 188.607 105.104 184.156C107.151 183.852 109.227 183.572 111.329 183.312C109.267 183.642 107.19 183.924 105.104 184.156C46.4204 192.847 -5.69621 214.233 62.6582 290.33C137.848 368.18 165.705 273.637 180 225.702C194.295 273.637 210.76 364.771 295.995 290.33C360 225.702 313.58 192.85 254.896 184.158C252.81 183.926 250.733 183.645 248.671 183.315C250.773 183.574 252.849 183.855 254.896 184.158C294.94 188.61 338.421 174.74 350.636 133.697C354.333 121.275 360 46.8568 360 36.519C360 26.1811 357.919 8.61012 346.474 3.43851C336.586 -1.02949 321.503 -5.86576 281.965 22.0466C240.692 51.1843 196.301 110.262 180 141.964Z"
                      fill="currentColor"
                    />
                  </svg>
                </template>
                <template v-else>
                  {{ item.name }}
                </template>
              </a>
            </div>
          </div>
        </div>
        <div class="-mr-2 sm:mr-0 flex">
          <button
            type="button"
            @click="emit('download')"
            v-tooltip="'Download tunables'"
            class="inline-flex items-center justify-center rounded-md p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky"
          >
            <span class="sr-only">Download tunables</span>
            <ArrowDownTrayIcon class="h-6 w-6" aria-hidden="true" />
          </button>

          <button
            type="button"
            @click="emit('configure')"
            v-tooltip="'Settings'"
            class="inline-flex items-center justify-center rounded-md p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky"
          >
            <span class="sr-only">Settings</span>
            <Cog6ToothIcon class="h-6 w-6" aria-hidden="true" />
          </button>

          <!-- Mobile menu button -->
          <DisclosureButton
            v-tooltip="'Open main menu'"
            class="inline-flex sm:hidden items-center justify-center rounded-md p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 py-3 mb-4 border-y border-slate-800/10 dark:border-slate-200/10">
        <DisclosureButton
          v-for="item in navigation"
          :key="item.name"
          as="a"
          :href="item.href"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noopener noreferrer' : undefined"
          :class="[
            item.current
              ? 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-50'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-50',
            'flex items-center justify-start gap-x-2.5 px-3 py-2 rounded-md text-base font-medium',
          ]"
          :aria-current="item.current ? 'page' : undefined"
        >
          <template v-if="item.icon">
            <font-awesome-icon :icon="item.icon" />
          </template>
          <template v-else-if="item.bsky">
            <svg class="svg-inline--fa" viewBox="0 0 360 320" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M254.896 184.158C252.81 183.926 250.733 183.645 248.671 183.315C250.773 183.574 252.849 183.855 254.896 184.158Z"
                fill="currentColor"
              />
              <path
                d="M180 141.964C163.699 110.262 119.308 51.1817 78.0347 22.044C38.4971 -5.86834 23.414 -1.03207 13.526 3.43594C2.08093 8.60755 0 26.1785 0 36.5164C0 46.8542 5.66748 121.272 9.36416 133.694C21.5786 174.738 65.0603 188.607 105.104 184.156C107.151 183.852 109.227 183.572 111.329 183.312C109.267 183.642 107.19 183.924 105.104 184.156C46.4204 192.847 -5.69621 214.233 62.6582 290.33C137.848 368.18 165.705 273.637 180 225.702C194.295 273.637 210.76 364.771 295.995 290.33C360 225.702 313.58 192.85 254.896 184.158C252.81 183.926 250.733 183.645 248.671 183.315C250.773 183.574 252.849 183.855 254.896 184.158C294.94 188.61 338.421 174.74 350.636 133.697C354.333 121.275 360 46.8568 360 36.519C360 26.1811 357.919 8.61012 346.474 3.43851C336.586 -1.02949 321.503 -5.86576 281.965 22.0466C240.692 51.1843 196.301 110.262 180 141.964Z"
                fill="currentColor"
              />
            </svg>
          </template>
          {{ item.name }}
        </DisclosureButton>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>
