<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import { ArrowDownTrayIcon, Bars3Icon, Cog6ToothIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const emit = defineEmits(['configure', 'download']);

const navigation = [
  { name: 'Patreon', href: 'https://rdo.gg/patreon/', icon: 'fa-brands fa-patreon', external: true },
  { name: 'X', href: 'https://x.com/Tunables', icon: 'fa-brands fa-x-twitter', external: true },
  { name: 'Mastodon', href: 'https://mastodon.social/@Tunables', icon: 'fa-brands fa-mastodon', external: true },
  { name: 'BlueSky', href: 'https://bsky.app/profile/tunables.rdo.gg', icon: 'fa-brands fa-bluesky', external: true },
  { name: 'Discord', href: 'https://rdo.gg/discord/', icon: 'fa-brands fa-discord', external: true },
  { name: 'GitHub', href: 'https://github.com/Senexis/RDO-GG-Tunables', icon: 'fa-brands fa-github', external: true },
  { name: 'API', href: 'https://rdo.gg/api/#tag/tunables', external: true },
];
</script>

<template>
  <Disclosure v-slot="{ open }" as="nav">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
          <div class="mr-4 flex shrink-0 items-center">
            <a href="https://tunables.rdo.gg/">
              <img class="h-8 w-auto" src="https://rdo.gg/img/menu.png" alt="Tunables" />
            </a>
          </div>
          <div class="hidden sm:block">
            <div class="flex space-x-2">
              <a
                v-for="item in navigation"
                :key="item.name"
                v-tooltip="item.icon ? item.name : null"
                :href="item.href"
                :class="[
                  item.current
                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-50'
                    : 'text-slate-700! hover:bg-slate-50 hover:text-slate-900! dark:text-slate-300! dark:hover:bg-slate-700 dark:hover:text-slate-50!',
                  'rounded-md px-3 py-2 text-sm font-medium',
                ]"
                :target="item.external ? '_blank' : undefined"
                :rel="item.external ? 'noopener noreferrer' : undefined"
                :aria-current="item.current ? 'page' : undefined"
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
        <div class="-mr-2 flex sm:mr-0">
          <button
            v-tooltip="'Download tunables'"
            type="button"
            class="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-hidden focus:ring-inset dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-50"
            @click="emit('download')"
          >
            <span class="sr-only">Download tunables</span>
            <ArrowDownTrayIcon class="size-6" aria-hidden="true" />
          </button>

          <button
            v-tooltip="'Settings'"
            type="button"
            class="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-hidden focus:ring-inset dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-50"
            @click="emit('configure')"
          >
            <span class="sr-only">Settings</span>
            <Cog6ToothIcon class="size-6" aria-hidden="true" />
          </button>

          <!-- Mobile menu button -->
          <DisclosureButton
            v-tooltip="'Open main menu'"
            class="inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-hidden focus:ring-inset sm:hidden dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-50"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block size-6" aria-hidden="true" />
            <XMarkIcon v-else class="block size-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="mb-4 space-y-1 border-y border-slate-800/10 px-2 py-3 dark:border-slate-200/10">
        <DisclosureButton
          v-for="item in navigation"
          :key="item.name"
          as="a"
          :href="item.href"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noopener noreferrer' : undefined"
          :class="[
            item.current
              ? 'bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-50'
              : 'text-slate-700! hover:bg-slate-50 hover:text-slate-900! dark:text-slate-300! dark:hover:bg-slate-700 dark:hover:text-slate-50!',
            'flex items-center justify-start gap-x-2.5 rounded-md px-3 py-2 text-base font-medium',
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
