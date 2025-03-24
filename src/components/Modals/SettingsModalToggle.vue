<script setup>
import { ref, watch } from 'vue';
import { Switch, SwitchDescription, SwitchGroup, SwitchLabel } from '@headlessui/vue';

import { EyeIcon, EyeSlashIcon, CheckIcon, MoonIcon, SunIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  modelValue: Boolean,
  isVisibilityToggle: {
    type: Boolean,
    default: false,
  },
  isDarkModeToggle: {
    type: Boolean,
    default: false,
  },
});

const enabled = ref(props.modelValue);

const emit = defineEmits(['update:modelValue']);

watch(enabled, (value) => {
  emit('update:modelValue', value);
});
</script>

<template>
  <SwitchGroup as="div" class="flex items-center justify-between gap-2 py-2">
    <span class="flex grow cursor-pointer flex-col" @click="$refs.switch.el.click()">
      <SwitchLabel as="span" class="text-sm font-medium text-slate-900 dark:text-slate-50" passive>
        <slot name="title"></slot>
      </SwitchLabel>
      <SwitchDescription as="span" class="text-sm text-slate-700 dark:text-slate-300">
        <slot name="description"></slot>
      </SwitchDescription>
    </span>
    <Switch
      ref="switch"
      v-model="enabled"
      :class="[
        enabled ? 'bg-sky-600' : 'bg-slate-400 dark:bg-slate-300',
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-hidden',
      ]"
    >
      <span
        :class="[
          enabled ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none relative inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
        ]"
      >
        <span
          :class="[
            enabled ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in',
            'absolute inset-0 flex size-full items-center justify-center transition-opacity',
          ]"
          aria-hidden="true"
        >
          <template v-if="props.isVisibilityToggle">
            <EyeSlashIcon class="size-3 text-slate-400" />
          </template>
          <template v-else-if="props.isDarkModeToggle">
            <SunIcon class="size-3 text-slate-400" />
          </template>
          <template v-else>
            <XMarkIcon class="size-3 text-slate-400" />
          </template>
        </span>
        <span
          :class="[
            enabled ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out',
            'absolute inset-0 flex size-full items-center justify-center transition-opacity',
          ]"
          aria-hidden="true"
        >
          <template v-if="props.isVisibilityToggle">
            <EyeIcon class="size-3 text-sky-600" />
          </template>
          <template v-else-if="props.isDarkModeToggle">
            <MoonIcon class="size-3 text-sky-600" />
          </template>
          <template v-else>
            <CheckIcon class="size-3 text-sky-600" />
          </template>
        </span>
      </span>
    </Switch>
  </SwitchGroup>
</template>
