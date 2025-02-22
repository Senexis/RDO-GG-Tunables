<script setup>
import { computed } from 'vue';
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid';

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const activeOption = computed({
  get() {
    return props.options.find((option) => option.value === props.modelValue);
  },
  set(value) {
    emit('update:modelValue', value.value);
  },
});
</script>

<template>
  <div class="items-center justify-between gap-2 py-2 sm:flex">
    <div class="flex flex-grow cursor-pointer select-none flex-col" @click="$refs.listbox.el.click()">
      <span class="text-sm font-medium text-secondary-900 dark:text-secondary-50">
        <slot name="title"></slot>
      </span>
      <span class="text-sm text-secondary-700 dark:text-secondary-300">
        <slot name="description"></slot>
      </span>
    </div>
    <Listbox v-model="activeOption" as="div" class="w-full flex-shrink-0 sm:w-40">
      <ListboxLabel class="block text-sm font-medium">
        <slot></slot>
      </ListboxLabel>
      <div class="relative mt-1">
        <ListboxButton
          ref="listbox"
          class="relative w-full cursor-pointer rounded-md border border-secondary-300 bg-transparent py-2 pl-3 pr-8 text-left text-secondary-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-secondary-700 dark:text-secondary-200 sm:text-sm"
        >
          <span class="block truncate">{{ activeOption.label }}</span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon class="size-5 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
          </span>
        </ListboxButton>

        <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
          <ListboxOptions
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-secondary-800 sm:text-sm"
          >
            <template v-for="option in props.options">
              <ListboxOption
                v-if="!option.hidden"
                :key="option.value"
                v-slot="{ active, selected }"
                as="template"
                :disabled="option.disabled"
                :value="option"
                @input="emit('update:modelValue', option.value)"
              >
                <li
                  :class="[
                    active
                      ? 'bg-secondary-50 text-secondary-700 dark:bg-secondary-700 dark:text-secondary-300'
                      : 'text-secondary-900 dark:text-secondary-200',
                    option.disabled ? 'opacity-50' : '',
                    'relative cursor-pointer select-none py-2 pl-3 pr-9',
                  ]"
                >
                  <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ option.label }}</span>

                  <span
                    v-if="selected"
                    class="absolute inset-y-0 right-0 flex items-center pr-4 text-secondary-900 dark:text-secondary-200"
                  >
                    <CheckIcon class="size-5" aria-hidden="true" />
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
