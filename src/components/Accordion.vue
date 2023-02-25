<script setup>
import { PlusIcon, MinusIcon } from "@heroicons/vue/24/outline";

import { computed, ref } from "vue";
import { useStore } from "../stores/settings.js";

const props = defineProps({
  id: {
    type: String,
    required: false,
  },
});

const openFallback = ref(false);

const settings = useStore();
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
    <div @click="toggleOpen" class="flex items-center justify-between text-sm px-3 py-2 select-none cursor-pointer hover:bg-slate-600">
      <slot name="title"></slot>
      <div class="px-2">
        <PlusIcon v-if="!open" class="inline-block w-4 h-4" />
        <MinusIcon v-else class="inline-block w-4 h-4" />
      </div>
    </div>
    <div v-show="open" class="bg-slate-900 px-3 py-4">
      <slot></slot>
    </div>
  </div>
</template>
