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
      <h3 class="mb-4 border-b-2 border-slate-200 pb-2 text-lg font-semibold dark:border-slate-600">Download tunables</h3>
      <DownloadModalFiles :files="files" />
    </div>
    <div class="bg-slate-50 px-4 py-3 text-slate-900 sm:flex sm:flex-row-reverse sm:px-6 dark:bg-slate-800 dark:text-slate-50">
      <div class="flex gap-3">
        <button
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-base font-medium text-slate-800 shadow-xs hover:bg-slate-50 hover:text-slate-800 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-hidden sm:mt-0 sm:w-auto sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </BaseModal>
</template>
