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
    <p class="mb-6 text-sm text-secondary-700 dark:text-secondary-300">
      Tunables will open in a new tab. You can then use <kbd>Ctrl</kbd> + <kbd>S</kbd> to save them as JSON. Feel free to use and/or edit
      them as needed. Mentioning the <code>provider</code> and <code>special_thanks</code> sections would be appreciated though!
    </p>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div
        v-for="file in filesForPage"
        :key="file.hash"
        class="relative flex items-center space-x-3 rounded-lg border border-secondary-300 p-3 shadow-sm focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:border-secondary-600 dark:border-secondary-700 dark:hover:border-secondary-400"
      >
        <div class="flex-shrink-0">
          <DocumentTextIcon class="size-6" />
        </div>
        <div class="min-w-0 flex-1">
          <a :href="getUrl(file.url)" target="_blank" rel="noopener noreferrer" class="focus:outline-none">
            <span class="absolute inset-0" aria-hidden="true" />
            <p class="text-sm font-medium text-secondary-700 dark:text-secondary-300">{{ file.date }}</p>
            <template v-if="file.weekly_event_id || file.membership_event_id">
              <p class="my-1 truncate text-xs font-medium text-secondary-700 dark:text-secondary-300">
                Weekly ID: {{ file.weekly_event_id ?? 'N/A' }}
                <br />
                GTA+ ID: {{ file.membership_event_id ?? 'N/A' }}
              </p>
            </template>
            <p class="truncate font-mono text-xs text-secondary-500">
              {{ file.hash }}
            </p>
          </a>
        </div>
      </div>
    </div>
    <div class="mt-4 flex justify-between">
      <button
        :disabled="previousDisabled"
        type="button"
        class="relative inline-flex items-center rounded-md border border-secondary-300 px-4 py-2 text-sm font-medium text-secondary-700 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:border-secondary-600 disabled:pointer-events-none disabled:opacity-50 dark:border-secondary-700 dark:text-secondary-300 dark:hover:border-secondary-400"
        @click="page--"
      >
        Previous
      </button>
      <button
        :disabled="nextDisabled"
        type="button"
        class="relative ml-3 inline-flex items-center rounded-md border border-secondary-300 px-4 py-2 text-sm font-medium text-secondary-700 focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:border-secondary-600 disabled:pointer-events-none disabled:opacity-50 dark:border-secondary-700 dark:text-secondary-300 dark:hover:border-secondary-400"
        @click="page++"
      >
        Next
      </button>
    </div>
  </template>
  <template v-else>
    <div class="relative block w-full rounded-lg border-2 border-dashed border-secondary-500 p-12 text-center dark:border-secondary-500">
      <DocumentMagnifyingGlassIcon class="mx-auto size-12 text-secondary-500" />
      <span class="mt-2 block text-sm font-medium text-secondary-500">No files available to download.</span>
    </div>
  </template>
</template>
