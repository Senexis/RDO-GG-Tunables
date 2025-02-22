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
    <div class="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
      <h3 class="mb-4 border-b-2 border-secondary-200 pb-2 text-lg font-semibold dark:border-secondary-600">Download tunables</h3>
      <DownloadModalFiles :files="files" />
    </div>
    <div
      class="bg-secondary-50 px-4 py-3 text-secondary-900 dark:bg-secondary-800 dark:text-secondary-50 sm:flex sm:flex-row-reverse sm:px-6"
    >
      <div class="flex gap-3">
        <button
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md border border-secondary-300 bg-white px-4 py-2 text-base font-medium text-secondary-800 shadow-sm hover:bg-secondary-50 hover:text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-200 dark:hover:bg-secondary-700 dark:hover:text-secondary-200 sm:mt-0 sm:w-auto sm:text-sm"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </BaseModal>
</template>
