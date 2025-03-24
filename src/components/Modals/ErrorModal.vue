<script setup>
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
  eventId: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <BaseModal :open="props.open">
    <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div class="sm:flex sm:items-start">
        <div
          class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-200 text-white! sm:mx-0 sm:size-10 dark:bg-red-800"
        >
          <font-awesome-icon icon="fa-solid fa-bug h-6 w-6" aria-hidden="true" />
        </div>
        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 class="text-lg leading-6 font-medium text-slate-800 dark:text-slate-200">A wild bug appeared!</h3>
          <div class="mt-2">
            <p class="text-sm">
              <slot></slot>
            </p>
          </div>
          <div class="mt-2">
            <p class="text-xs text-slate-700 dark:text-slate-300">
              If this issue persists, try reloading the page using the <strong>Reload</strong> button first to remove your game and platform
              preferences. If that doesn't work, you can try to reset all settings using the <strong>Reset</strong> button.
            </p>
          </div>
          <div class="mt-2">
            <p class="text-xs text-slate-700 dark:text-slate-300">
              If that still doesn't resolve the issue, please report this issue to us using the
              <strong><font-awesome-icon icon="fa-brands fa-github" aria-label="GitHub" /></strong> or
              <strong><font-awesome-icon icon="fa-brands fa-x-twitter" aria-label="X" /></strong> button.
              <template v-if="eventId"
                >Please include the following information when reporting the issue: <code class="text-xs" v-text="eventId"></code
              ></template>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
      class="justify-between bg-slate-50 px-4 py-3 text-slate-900 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-slate-800 dark:text-slate-50"
    >
      <div class="flex flex-row-reverse gap-3">
        <a
          :href="url"
          class="mt-3 inline-flex w-full justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-base font-medium text-slate-800! shadow-xs hover:bg-slate-50 hover:text-slate-800! focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-hidden sm:mt-0 sm:w-auto sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200! dark:hover:bg-slate-700 dark:hover:text-slate-200!"
        >
          Reload
        </a>
        <button
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md border border-red-600 bg-red-600 px-4 py-2 font-medium text-white! shadow-xs hover:bg-red-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-hidden sm:mt-0 sm:w-auto sm:text-sm dark:border-red-700 dark:bg-red-700 dark:text-slate-200! dark:hover:bg-red-600 dark:hover:text-white!"
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
          class="mt-3 inline-flex w-full items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-base font-medium text-slate-800! shadow-xs hover:bg-slate-50 hover:text-slate-800! focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-hidden sm:mt-0 sm:w-auto sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200! dark:hover:bg-slate-700 dark:hover:text-slate-200!"
        >
          <font-awesome-icon icon="fa-brands fa-github" aria-label="GitHub" />
        </a>
        <a
          href="https://x.com/Tunables"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-3 inline-flex w-full items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-base font-medium text-slate-800! shadow-xs hover:bg-slate-50 hover:text-slate-800! focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-hidden sm:mt-0 sm:w-auto sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200! dark:hover:bg-slate-700 dark:hover:text-slate-200!"
        >
          <font-awesome-icon icon="fa-brands fa-x-twitter" aria-label="X" />
        </a>
      </div>
    </div>
  </BaseModal>
</template>
