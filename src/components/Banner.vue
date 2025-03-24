<script setup>
import { NoSymbolIcon, MegaphoneIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { useStore } from '../stores/settings.js';

const emit = defineEmits(['close']);

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  show: {
    type: Boolean,
    default: true,
  },
  buttonText: {
    type: String,
    default: 'Learn more',
  },
  buttonLink: {
    type: String,
    default: null,
  },
  buttonExternal: {
    type: Boolean,
    default: false,
  },
});

const settings = useStore();

function dismiss() {
  settings.bannersDismissed = [...settings.bannersDismissed, props.id];
  emit('close');
}

function block() {
  settings.bannersBlocked = true;
  emit('close');
}
</script>

<template>
  <div v-if="show" class="fixed inset-x-0 bottom-0 pb-2 sm:pb-5">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="rounded-lg bg-sky-600 p-2 shadow-lg sm:p-3">
        <div class="flex flex-wrap items-center justify-between">
          <div class="flex w-0 flex-1 items-center">
            <span class="flex rounded-lg bg-sky-800 p-2">
              <MegaphoneIcon class="size-6 text-slate-50" aria-hidden="true" />
            </span>
            <p class="ml-3 leading-tight font-medium text-slate-50">
              <span class="inline">
                <slot></slot>
              </span>
            </p>
          </div>
          <div v-if="props.buttonLink" class="order-3 mt-2 w-full shrink-0 sm:order-2 sm:mt-0 sm:w-auto">
            <a
              :href="props.buttonLink"
              :target="props.buttonExternal ? '_blank' : undefined"
              :rel="props.buttonExternal ? 'noopener noreferrer' : undefined"
              class="flex items-center justify-center rounded-md border border-transparent bg-slate-50 px-4 py-2 text-sm font-medium text-sky-600 shadow-xs hover:bg-sky-50"
            >
              {{ props.buttonText }}
            </a>
          </div>
          <div class="order-2 flex shrink-0 flex-row-reverse gap-2 sm:order-3 sm:ml-2">
            <button
              v-tooltip="'Dismiss'"
              type="button"
              class="-mr-1 flex rounded-md p-2 hover:bg-sky-500 focus:ring-2 focus:ring-slate-50 focus:outline-hidden"
              @click="dismiss"
            >
              <span class="sr-only">Dismiss</span>
              <XMarkIcon class="size-6 text-slate-50" aria-hidden="true" />
            </button>

            <button
              v-tooltip="'Block all banners'"
              type="button"
              class="-mr-1 flex rounded-md p-2 hover:bg-sky-500 focus:ring-2 focus:ring-slate-50 focus:outline-hidden"
              @click="block"
            >
              <span class="sr-only">Block all banners</span>
              <NoSymbolIcon class="size-6 text-slate-50" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
