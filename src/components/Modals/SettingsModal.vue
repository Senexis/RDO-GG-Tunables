<script setup>
import BaseModal from './BaseModal.vue';

const emit = defineEmits(['close']);

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  commitShort: {
    type: String,
    default: '',
  },
  commitLong: {
    type: String,
    default: '',
  },
  change: {
    type: String,
    default: '',
  },
  updated: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <BaseModal :open="props.open" @close="emit('close')">
    <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <slot></slot>
      <div
        class="text-xs text-slate-900/60 dark:text-slate-50/60 bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-lg shadow-sm transition-opacity opacity-50 hover:opacity-100"
      >
        <p class="break-words">
          <template v-if="props.commitLong && props.commitShort">
            <a
              :href="`https://github.com/Senexis/RDO-GG-Tunables/commit/${props.commitLong}`"
              target="_blank"
              rel="noopener noreferrer"
              v-tooltip="props.commitLong"
            >
              [{{ props.commitShort }}]
            </a>
          </template>
          <template v-if="props.change">
            {{ props.change }}
          </template>
          <template v-if="props.updated"> ({{ props.updated }}) </template>
        </p>
        <p class="mt-2">
          <a href="https://github.com/Senexis/RDO-GG-Tunables/commits/main" target="_blank" rel="noopener noreferrer">Click here</a>
          for the full version history.
        </p>
      </div>
    </div>
    <div class="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
      <div class="flex gap-3">
        <button
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-base font-medium text-slate-800 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </BaseModal>
</template>
