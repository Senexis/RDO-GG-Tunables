<script setup>
import { ref, watch } from "vue";
import { Switch, SwitchDescription, SwitchGroup, SwitchLabel } from "@headlessui/vue";

const props = defineProps({
  modelValue: Boolean,
});

const enabled = ref(props.modelValue);

const emit = defineEmits(["update:modelValue"]);

watch(enabled, (value) => {
  emit("update:modelValue", value);
});
</script>

<template>
  <SwitchGroup as="div" class="flex items-center justify-between gap-2 py-2">
    <span class="flex flex-grow flex-col cursor-pointer select-none" @click="$refs.switch.el.click()">
      <SwitchLabel as="span" class="text-sm font-medium text-slate-50" passive>
        <slot name="title"></slot>
      </SwitchLabel>
      <SwitchDescription as="span" class="text-sm text-slate-300">
        <slot name="description"></slot>
      </SwitchDescription>
    </span>
    <Switch
      ref="switch"
      v-model="enabled"
      :class="[
        enabled ? 'bg-sky-600' : 'bg-slate-300',
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2',
      ]"
    >
      <span
        aria-hidden="true"
        :class="[
          enabled ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
        ]"
      />
    </Switch>
  </SwitchGroup>
</template>
