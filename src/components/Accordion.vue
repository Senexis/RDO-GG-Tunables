<script setup>
import { PlusIcon, MinusIcon } from '@heroicons/vue/24/outline';

import { computed, ref } from 'vue';
import { useStore } from '../stores/settings.js';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const settings = useStore();
const openFallback = ref(false);

const open = computed(() => {
  if (!props.id) return openFallback.value;
  return !settings.accordionsDismissed.includes(props.id);
});

function toggleOpen() {
  if (!props.id) return (openFallback.value = !openFallback.value);
  if (open.value) {
    settings.accordionsDismissed = [...settings.accordionsDismissed, props.id];
  } else {
    settings.accordionsDismissed = settings.accordionsDismissed.filter((id) => id !== props.id);
  }
}
</script>

<template>
  <div>
    <button
      type="button"
      class="flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-600"
      @click="toggleOpen"
    >
      <slot name="title"></slot>
      <div v-tooltip="open ? 'Collapse' : 'Expand'" class="px-2">
        <PlusIcon v-if="!open" class="inline-block size-4" />
        <MinusIcon v-else class="inline-block size-4" />
      </div>
    </button>
    <div v-show="open" class="bg-white px-3 py-4 dark:bg-slate-900">
      <slot></slot>
    </div>
  </div>
</template>
