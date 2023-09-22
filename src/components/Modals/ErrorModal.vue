<script setup>
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline';
import BaseModal from './BaseModal.vue';

const url = new URL(window.location);
url.searchParams.delete('game');
url.searchParams.delete('platform');
url.searchParams.delete('previous');
url.searchParams.delete('latest');

const emit = defineEmits(['reset']);

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});
</script>

<template>
  <BaseModal :open="props.open">
    <div class="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div class="sm:flex sm:items-start">
        <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
          <ExclamationCircleIcon class="h-6 w-6 text-red-100" aria-hidden="true" />
        </div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 class="text-lg font-medium leading-6 text-slate-800 dark:text-slate-200">An error occurred</h3>
          <div class="mt-2">
            <p class="text-sm">
              <slot></slot>
            </p>
          </div>
          <div class="mt-2">
            <p class="text-sm">
              If this issue persists, try reloading the page without options. If that doesn't solve the issue, please report this issue on
              GitHub.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
      class="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse justify-between sm:px-6"
    >
      <div class="flex flex-row-reverse gap-3">
        <a
          :href="url"
          class="mt-3 inline-flex w-full justify-center rounded-md border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 px-4 py-2 text-base font-medium text-slate-800 dark:text-slate-200 shadow-sm hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
        >
          Reload
        </a>
        <button
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md border border-red-700 bg-red-800 px-4 py-2 text-base font-medium text-slate-800 dark:text-slate-200 shadow-sm hover:bg-red-700 hover:text-slate-900 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
          @click.stop="emit('reset')"
        >
          Reset
        </button>
      </div>
      <div class="flex gap-3">
        <a
          href="https://github.com/Senexis/RDO-GG-Tunables/issues/new/choose"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-3 inline-flex w-full justify-center rounded-md border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 px-4 py-2 text-base font-medium text-slate-800 dark:text-slate-200 shadow-sm hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
        >
          GitHub
        </a>
      </div>
    </div>
  </BaseModal>
</template>
