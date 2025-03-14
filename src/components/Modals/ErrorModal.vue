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
    <div class="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
      <div class="sm:flex sm:items-start">
        <div
          class="mx-auto flex size-12 flex-shrink-0 items-center justify-center rounded-full bg-danger-100 text-white dark:bg-danger-900 sm:mx-0 sm:size-10"
        >
          <font-awesome-icon icon="fa-solid fa-bug h-6 w-6" aria-hidden="true" />
        </div>
        <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <h3 class="text-lg font-medium leading-6 text-secondary-800 dark:text-secondary-200">A wild bug appeared!</h3>
          <div class="mt-2">
            <p class="text-sm">
              <slot></slot>
            </p>
          </div>
          <div class="mt-2">
            <p class="text-xs text-secondary-700 dark:text-secondary-300">
              If this issue persists, try reloading the page using the <strong>Reload</strong> button first to remove your game and platform
              preferences. If that doesn't work, you can try to reset all settings using the <strong>Reset</strong> button.
            </p>
          </div>
          <div class="mt-2">
            <p class="text-xs text-secondary-700 dark:text-secondary-300">
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
      class="justify-between bg-secondary-50 px-4 py-3 text-secondary-900 dark:bg-secondary-800 dark:text-secondary-50 sm:flex sm:flex-row-reverse sm:px-6"
    >
      <div class="flex flex-row-reverse gap-3">
        <a
          :href="url"
          class="mt-3 inline-flex w-full justify-center rounded-md border border-secondary-300 bg-white px-4 py-2 text-base font-medium text-secondary-800 shadow-sm hover:bg-secondary-50 hover:text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-200 dark:hover:bg-secondary-700 dark:hover:text-secondary-200 sm:mt-0 sm:w-auto sm:text-sm"
        >
          Reload
        </a>
        <button
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md border border-danger-600 bg-danger-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-danger-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-danger-700 dark:bg-danger-700 dark:text-secondary-200 dark:hover:bg-danger-600 dark:hover:text-white sm:mt-0 sm:w-auto sm:text-sm"
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
          class="mt-3 inline-flex w-full items-center justify-center rounded-md border border-secondary-300 bg-white px-4 py-2 text-base font-medium text-secondary-800 shadow-sm hover:bg-secondary-50 hover:text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-200 dark:hover:bg-secondary-700 dark:hover:text-secondary-200 sm:mt-0 sm:w-auto sm:text-sm"
        >
          <font-awesome-icon icon="fa-brands fa-github" aria-label="GitHub" />
        </a>
        <a
          href="https://x.com/Tunables"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-3 inline-flex w-full items-center justify-center rounded-md border border-secondary-300 bg-white px-4 py-2 text-base font-medium text-secondary-800 shadow-sm hover:bg-secondary-50 hover:text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-200 dark:hover:bg-secondary-700 dark:hover:text-secondary-200 sm:mt-0 sm:w-auto sm:text-sm"
        >
          <font-awesome-icon icon="fa-brands fa-x-twitter" aria-label="X" />
        </a>
      </div>
    </div>
  </BaseModal>
</template>
