<script setup>
import { PlusIcon, MinusIcon } from "@heroicons/vue/24/outline";

import { computed } from "vue";
import { useStore } from "../stores/settings.js";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const settings = useStore();
const open = computed(() => {
  return settings.quickViewOpen.includes(props.id);
});

function toggleOpen() {
  if (open.value) {
    settings.quickViewOpen = settings.quickViewOpen.filter((id) => id !== props.id);
  } else {
    settings.quickViewOpen = [...settings.quickViewOpen, props.id];
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
