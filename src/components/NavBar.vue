<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { ArrowDownTrayIcon, Bars3Icon, Cog6ToothIcon, BoltIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const emit = defineEmits(['configure', 'download']);

const navigation = [
  { name: 'API', href: 'https://rdo.gg/api/#tag/tunables', external: true },
  { name: 'Patreon', href: 'https://rdo.gg/patreon/', icon: 'fa-brands fa-patreon', external: true },
  { name: 'X', href: 'https://x.com/Tunables', icon: 'fa-brands fa-x-twitter', external: true },
  { name: 'Bluesky', href: 'https://bsky.app/profile/tunables.rdo.gg', icon: 'fa-solid fa-cloud', external: true },
  { name: 'Discord', href: 'https://rdo.gg/discord/', icon: 'fa-brands fa-discord', external: true },
  { name: 'GitHub', href: 'https://github.com/Senexis/RDO-GG-Tunables', icon: 'fa-brands fa-github', external: true },
];

function onQuickActions() {
  document.dispatchEvent(new CustomEvent('hotkey-search'));
}
</script>

<template>
  <Disclosure as="nav" class="bg-slate-100 dark:bg-slate-800" v-slot="{ open }">
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
                v-tooltip="item.icon ? item.name : undefined"
              >
                <template v-if="item.icon">
                  <span class="sr-only">{{ item.name }}</span>
                  <font-awesome-icon :icon="item.icon" />
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

          <!-- Want to try this out? Press ⌘K! -->
          <!-- <button
            type="button"
            @click="onQuickActions"
            v-tooltip="'Quick Actions (⌘K)'"
            class="inline-flex items-center justify-center rounded-md p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky"
          >
            <span class="sr-only">Quick Actions (⌘K)</span>
            <BoltIcon class="h-6 w-6" aria-hidden="true" />
          </button> -->

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
          {{ item.name }}
        </DisclosureButton>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>
