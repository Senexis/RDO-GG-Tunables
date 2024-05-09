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
  buttonHandler: Function,
  buttonExternal: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div v-if="show" class="rounded-lg bg-primary-600 p-2 mb-2 shadow-md sm:p-3">
    <div class="flex items-center">
      <div class="flex-shrink-0 rounded-lg bg-primary-800 p-2">
        <InformationCircleIcon class="h-5 w-5 text-secondary-50" aria-hidden="true" />
      </div>
      <div class="ml-3 flex-1 md:flex md:justify-between md:items-center">
        <div class="text-sm text-secondary-50 leading-tight">
          <slot></slot>
        </div>
        <template v-if="props.buttonHandler">
          <p class="mt-1 text-sm md:ml-6 md:mt-0">
            <button
              :href="props.buttonHandler"
              @click="props.buttonHandler"
              type="button"
              class="flex items-center whitespace-nowrap font-medium rounded-md md:p-2 md:hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-secondary-50 text-secondary-50"
            >
              {{ props.buttonText }}
            </button>
          </p>
        </template>
      </div>
    </div>
  </div>
</template>
