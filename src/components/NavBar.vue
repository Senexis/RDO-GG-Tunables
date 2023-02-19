<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ArrowDownTrayIcon, Bars3Icon, Cog6ToothIcon, XMarkIcon } from "@heroicons/vue/24/outline";

const emit = defineEmits(["configure", "download"]);

const navigation = [
  { name: "RDO.GG", href: "https://rdo.gg/", external: true },
  { name: "API", href: "https://rdo.gg/api/#tag/tunables", external: true },
  { name: "Twitter", href: "https://twitter.com/Tunables", external: true },
  { name: "GitHub", href: "https://github.com/Senexis/RDO-GG-Tunables", external: true },
];
</script>

<template>
  <Disclosure as="nav" class="bg-slate-800" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
          <div class="flex flex-shrink-0 items-center mr-4">
            <img class="h-8 w-auto" src="https://rdo.gg/img/menu.png" alt="Tunables" />
          </div>
          <div class="hidden sm:block">
            <div class="flex space-x-2">
              <a
                v-for="item in navigation"
                :key="item.name"
                :href="item.href"
                :class="[
                  item.current ? 'bg-slate-900 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white',
                  'px-3 py-2 rounded-md text-sm font-medium',
                ]"
                :target="item.external ? '_blank' : undefined"
                :rel="item.external ? 'noopener noreferrer' : undefined"
                :aria-current="item.current ? 'page' : undefined"
                >{{ item.name }}</a
              >
            </div>
          </div>
        </div>
        <div class="-mr-2 sm:mr-0 flex">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky"
            @click="emit('download')"
          >
            <span class="sr-only">Download tunables</span>
            <ArrowDownTrayIcon class="h-6 w-6" aria-hidden="true" />
          </button>

          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky"
            @click="emit('configure')"
          >
            <span class="sr-only">Open settings</span>
            <Cog6ToothIcon class="h-6 w-6" aria-hidden="true" />
          </button>

          <!-- Mobile menu button -->
          <DisclosureButton
            class="inline-flex sm:hidden items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pt-2 pb-3">
        <DisclosureButton
          v-for="item in navigation"
          :key="item.name"
          as="a"
          :href="item.href"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noopener noreferrer' : undefined"
          :class="[
            item.current ? 'bg-slate-900 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white',
            'block px-3 py-2 rounded-md text-base font-medium',
          ]"
          :aria-current="item.current ? 'page' : undefined"
        >
          {{ item.name }}
        </DisclosureButton>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>
