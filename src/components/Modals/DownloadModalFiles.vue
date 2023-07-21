<script setup>
import { DocumentTextIcon, DocumentMagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { computed, ref } from 'vue';

const props = defineProps({
  files: {
    type: Array,
    required: true,
  },
});

const page = ref(1);
const perPage = 10;

const pages = computed(() => {
  return Math.ceil(props.files.length / perPage);
});

const filesForPage = computed(() => {
  return props.files.slice((page.value - 1) * perPage, page.value * perPage);
});

const previousDisabled = computed(() => {
  return page.value === 1;
});

const nextDisabled = computed(() => {
  return page.value === pages.value;
});

function getUrl(url) {
  return `https://api.rdo.gg${url}`;
}
</script>

<template>
  <template v-if="props.files?.length">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div
        v-for="file in filesForPage"
        :key="file.hash"
        class="relative flex items-center space-x-3 rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-3 shadow-sm focus-within:ring-2 focus-within:ring-sky-500 focus-within:ring-offset-2 hover:border-slate-600 dark:hover:border-slate-400"
      >
        <div class="flex-shrink-0">
          <DocumentTextIcon class="h-6 w-6" />
        </div>
        <div class="min-w-0 flex-1">
          <a :href="getUrl(file.url)" class="focus:outline-none">
            <span class="absolute inset-0" aria-hidden="true" />
            <p class="text-sm font-medium text-slate-700 dark:text-slate-300">{{ file.date }}</p>
            <p class="truncate text-xs font-mono text-slate-500 dark:text-slate-500">
              {{ file.hash }}
            </p>
          </a>
        </div>
      </div>
    </div>
    <div class="mt-4 flex justify-between">
      <button
        @click="page--"
        :disabled="previousDisabled"
        type="button"
        class="relative inline-flex items-center rounded-md border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 focus-within:ring-2 focus-within:ring-sky-500 focus-within:ring-offset-2 hover:border-slate-600 dark:hover:border-slate-400 disabled:opacity-50 disabled:pointer-events-none"
      >
        Previous
      </button>
      <button
        @click="page++"
        :disabled="nextDisabled"
        type="button"
        class="relative ml-3 inline-flex items-center rounded-md border border-slate-300 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 focus-within:ring-2 focus-within:ring-sky-500 focus-within:ring-offset-2 hover:border-slate-600 dark:hover:border-slate-400 disabled:opacity-50 disabled:pointer-events-none"
      >
        Next
      </button>
    </div>
  </template>
  <template v-else>
    <div class="relative block w-full rounded-lg border-2 border-dashed border-slate-500 dark:border-slate-500 p-12 text-center">
      <DocumentMagnifyingGlassIcon class="mx-auto h-12 w-12 text-slate-500 dark:text-slate-500" />
      <span class="mt-2 block text-sm font-medium text-slate-500 dark:text-slate-500"> No files available to download. </span>
    </div>
  </template>
</template>
