<script setup>
import { ArrowRightIcon, InformationCircleIcon } from '@heroicons/vue/20/solid';

const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  buttonText: {
    type: String,
    default: 'Details',
  },
  buttonHandler: Function,
  buttonExternal: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div v-if="show" class="rounded-lg bg-sky-600 p-2 mb-2 shadow-md sm:p-3">
    <div class="flex items-center">
      <div class="flex-shrink-0 rounded-lg bg-sky-800 p-2">
        <InformationCircleIcon class="h-5 w-5 text-slate-50" aria-hidden="true" />
      </div>
      <div class="ml-3 flex-1 md:flex md:justify-between md:items-center">
        <p class="text-sm text-slate-50 leading-tight">
          <slot></slot>
        </p>
        <template v-if="props.buttonHandler">
          <p class="mt-1 text-sm md:ml-6 md:mt-0">
            <button
              :href="props.buttonHandler"
              @click="props.buttonHandler"
              type="button"
              class="flex items-center whitespace-nowrap font-medium rounded-md md:p-2 md:hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-slate-50 text-slate-50"
            >
              {{ props.buttonText }}
              <ArrowRightIcon class="ml-1 h-4 w-4 text-slate-50" aria-hidden="true" />
            </button>
          </p>
        </template>
      </div>
    </div>
  </div>
</template>
