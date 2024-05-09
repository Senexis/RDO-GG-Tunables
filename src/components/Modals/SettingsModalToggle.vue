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
    <span class="flex flex-grow flex-col cursor-pointer select-none" @click="$refs.switch.el.click()">
      <SwitchLabel as="span" class="text-sm font-medium text-secondary-900 dark:text-secondary-50" passive>
        <slot name="title"></slot>
      </SwitchLabel>
      <SwitchDescription as="span" class="text-sm text-secondary-700 dark:text-secondary-300">
        <slot name="description"></slot>
      </SwitchDescription>
    </span>
    <Switch
      ref="switch"
      v-model="enabled"
      :class="[
        enabled ? 'bg-primary-600' : 'bg-secondary-400 dark:bg-secondary-300',
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      ]"
    >
      <span
        :class="[
          enabled ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
        ]"
      >
        <span
          :class="[
            enabled ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in',
            'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
          ]"
          aria-hidden="true"
        >
          <template v-if="props.isVisibilityToggle">
            <EyeSlashIcon class="h-3 w-3 text-secondary-400" />
          </template>
          <template v-else-if="props.isDarkModeToggle">
            <SunIcon class="h-3 w-3 text-secondary-400" />
          </template>
          <template v-else>
            <XMarkIcon class="h-3 w-3 text-secondary-400" />
          </template>
        </span>
        <span
          :class="[
            enabled ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out',
            'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
          ]"
          aria-hidden="true"
        >
          <template v-if="props.isVisibilityToggle">
            <EyeIcon class="h-3 w-3 text-primary-600" />
          </template>
          <template v-else-if="props.isDarkModeToggle">
            <MoonIcon class="h-3 w-3 text-primary-600" />
          </template>
          <template v-else>
            <CheckIcon class="h-3 w-3 text-primary-600" />
          </template>
        </span>
      </span>
    </Switch>
  </SwitchGroup>
</template>
