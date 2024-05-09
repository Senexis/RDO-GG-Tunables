<script setup>
import BaseModal from './BaseModal.vue';
import DownloadModalFiles from './DownloadModalFiles.vue';

const emit = defineEmits(['close']);

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  files: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <BaseModal :open="props.open" @close="emit('close')">
    <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <h3 class="font-lg font-semibold pb-2 mb-4 border-b-2 border-secondary-200 dark:border-secondary-600">Download tunables</h3>
      <DownloadModalFiles :files="files" />
    </div>
    <div
      class="bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
    >
      <div class="flex gap-3">
        <button
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-4 py-2 text-base font-medium text-secondary-800 dark:text-secondary-200 shadow-sm hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-800 dark:hover:text-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </BaseModal>
</template>
