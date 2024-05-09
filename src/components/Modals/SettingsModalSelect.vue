<script setup>
import { computed } from 'vue';
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid';

const props = defineProps({
  modelValue: String,
  options: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const selected = computed({
  get() {
    return props.options.find((option) => option.value === props.modelValue);
  },
  set(value) {
    emit('update:modelValue', value.value);
  },
});
</script>

<template>
  <div class="sm:flex items-center justify-between gap-2 py-2">
    <div class="flex flex-grow flex-col cursor-pointer select-none" @click="$refs.listbox.el.click()">
      <span class="text-sm font-medium text-secondary-900 dark:text-secondary-50">
        <slot name="title"></slot>
      </span>
      <span class="text-sm text-secondary-700 dark:text-secondary-300">
        <slot name="description"></slot>
      </span>
    </div>
    <Listbox as="div" class="w-full sm:w-40 flex-shrink-0" v-model="selected">
      <ListboxLabel class="block text-sm font-medium">
        <slot></slot>
      </ListboxLabel>
      <div class="relative mt-1">
        <ListboxButton
          ref="listbox"
          class="relative w-full cursor-pointer rounded-md border border-secondary-300 dark:border-secondary-700 bg-transparent py-2 pl-3 pr-8 text-left text-secondary-900 dark:text-secondary-200 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
        >
          <span class="block truncate">{{ selected.label }}</span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon class="h-5 w-5 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
          </span>
        </ListboxButton>

        <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
          <ListboxOptions
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-secondary-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <template v-for="option in props.options">
              <ListboxOption
                as="template"
                v-if="!option.hidden"
                :disabled="option.disabled"
                :key="option.value"
                :value="option"
                v-slot="{ active, selected }"
                @input="emit('update:modelValue', option.value)"
              >
                <li
                  :class="[
                    active ? 'text-secondary-700 dark:text-secondary-300 bg-secondary-50 dark:bg-secondary-700' : 'text-secondary-900 dark:text-secondary-200',
                    option.disabled ? 'opacity-50' : '',
                    'relative cursor-pointer select-none py-2 pl-3 pr-9',
                  ]"
                >
                  <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ option.label }}</span>

                  <span v-if="selected" class="text-secondary-900 dark:text-secondary-200 absolute inset-y-0 right-0 flex items-center pr-4">
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                  </span>
                </li>
              </ListboxOption>
            </template>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>
