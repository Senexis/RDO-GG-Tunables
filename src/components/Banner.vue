<script setup>
import { MegaphoneIcon, XMarkIcon } from "@heroicons/vue/24/outline";

const emit = defineEmits(["close"]);

const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  button: String,
  buttonExternal: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div v-if="show" class="fixed inset-x-0 bottom-0 pb-2 sm:pb-5">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="rounded-lg bg-sky-600 p-2 shadow-lg sm:p-3">
        <div class="flex flex-wrap items-center justify-between">
          <div class="flex w-0 flex-1 items-center">
            <span class="flex rounded-lg bg-sky-800 p-2">
              <MegaphoneIcon class="h-6 w-6 text-white" aria-hidden="true" />
            </span>
            <p class="ml-3 font-medium text-white leading-tight">
              <span class="inline">
                <slot></slot>
              </span>
            </p>
          </div>
          <div v-if="props.button" class="order-3 mt-2 w-full flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto">
            <a
              :href="props.button"
              :target="props.buttonExternal ? '_blank' : undefined"
              :rel="props.buttonExternal ? 'noopener noreferrer' : undefined"
              class="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-sky-600 shadow-sm hover:bg-sky-50"
            >
              Learn more
            </a>
          </div>
          <div class="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
            <button
              type="button"
              class="-mr-1 flex rounded-md p-2 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-white"
              @click="emit('close')"
            >
              <span class="sr-only">Dismiss</span>
              <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
