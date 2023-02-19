<script setup>
import { computed } from "vue";
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";

const props = defineProps({
  modelValue: String,
  options: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const selected = computed({
  get() {
    return props.options.find((option) => option.value === props.modelValue);
  },
  set(value) {
    emit("update:modelValue", value.value);
  },
});
</script>

<template>
  <div class="sm:flex items-center justify-between gap-2 py-2">
    <div class="flex flex-grow flex-col cursor-pointer select-none" @click="$refs.listbox.el.click()">
      <span class="text-sm font-medium text-slate-50">
        <slot name="title"></slot>
      </span>
      <span class="hidden sm:inline text-sm text-slate-300">
        <slot name="description"></slot>
      </span>
    </div>
    <Listbox as="div" class="w-full sm:w-48 flex-shrink-0" v-model="selected">
      <ListboxLabel class="block text-sm font-medium">
        <slot></slot>
      </ListboxLabel>
      <div class="relative mt-1">
        <ListboxButton
          ref="listbox"
          class="relative w-full cursor-default rounded-md border border-slate-700 bg-transparent py-2 pl-3 pr-10 text-left text-slate-100 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 sm:text-sm"
        >
          <span class="block truncate">{{ selected.label }}</span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon class="h-5 w-5 text-slate-400" aria-hidden="true" />
          </span>
        </ListboxButton>

        <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
          <ListboxOptions
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-600 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
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
                    active ? 'text-slate-100 bg-sky-600' : 'text-slate-100',
                    option.disabled ? 'opacity-50' : '',
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                  ]"
                >
                  <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ option.label }}</span>

                  <span v-if="selected" class="text-slate-100 absolute inset-y-0 right-0 flex items-center pr-4">
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
