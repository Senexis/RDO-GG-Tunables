<script setup>
import BaseModal from "./BaseModal.vue";

const emit = defineEmits(["close"]);

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  commitShort: {
    type: String,
    default: "",
  },
  commitLong: {
    type: String,
    default: "",
  },
  change: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <BaseModal :open="props.open" @close="emit('close')">
    <div class="bg-slate-900 text-slate-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <slot></slot>
      <template v-if="props.commitShort">
        <p class="text-xs opacity-60">
          App version:
          <a
            :href="`https://github.com/Senexis/RDO-GG-Tunables/commit/${props.commitLong}`"
            target="_blank"
            rel="noopener noreferrer"
            :title="props.commitLong"
          >
            {{ props.commitShort }}
          </a>
        </p>
        <template v-if="props.change">
          <p class="text-xs opacity-60">Latest change: {{ props.change }}</p>
        </template>
      </template>
    </div>
    <div class="bg-slate-800 text-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
      <div class="flex gap-3">
        <button
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-base font-medium text-slate-200 shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </BaseModal>
</template>
