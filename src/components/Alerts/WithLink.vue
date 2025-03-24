<script setup>
import { InformationCircleIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  buttonText: {
    type: String,
    default: 'Details',
  },
  buttonHandler: {
    type: Function,
    default: null,
  },
  buttonExternal: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div v-if="show" class="mb-2 rounded-lg bg-sky-600 p-2 shadow-md sm:p-3">
    <div class="flex items-center">
      <div class="shrink-0 rounded-lg bg-sky-800 p-2">
        <InformationCircleIcon class="size-5 text-slate-50" aria-hidden="true" />
      </div>
      <div class="ml-3 flex-1 md:flex md:items-center md:justify-between">
        <div class="text-sm leading-tight text-slate-50">
          <slot></slot>
        </div>
        <template v-if="props.buttonHandler">
          <p class="mt-1 text-sm md:mt-0 md:ml-6">
            <button
              :href="props.buttonHandler"
              type="button"
              class="flex items-center rounded-md font-medium whitespace-nowrap text-slate-50 focus:ring-2 focus:ring-slate-50 focus:outline-hidden md:p-2 md:hover:bg-sky-500"
              @click="props.buttonHandler"
            >
              {{ props.buttonText }}
            </button>
          </p>
        </template>
      </div>
    </div>
  </div>
</template>
