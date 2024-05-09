<script setup>
import BaseModal from './BaseModal.vue';

// eslint-disable-next-line no-undef
const appCopyrightYear = APP_COPYRIGHT_YEAR;

const emit = defineEmits(['close']);

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});
</script>

<template>
  <BaseModal :open="props.open" @close="emit('close')">
    <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <h3 class="text-lg font-semibold pb-2 mb-4 border-b-2 border-secondary-200 dark:border-secondary-600">License</h3>
      <div class="text-sm">
        <p>
          This website is licensed under the MIT License, a short and simple permissive license with conditions only requiring preservation
          of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and
          without source code.
        </p>
        <h4 class="text-md font-semibold pb-2 my-4 border-b border-secondary-200 dark:border-secondary-600">MIT License</h4>
        <p class="mb-2">Copyright &copy; 2023-{{ appCopyrightYear }} Senexis</p>
        <p class="mb-2">
          Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
          (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify,
          merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
          furnished to do so, subject to the following conditions:
        </p>
        <p class="mb-2">
          The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
        </p>
        <p class="mb-2 text-justify">
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
          LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
          CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        </p>
      </div>
    </div>
    <div
      class="bg-secondary-50 dark:bg-secondary-800 text-secondary-900 dark:text-secondary-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
    >
      <div class="flex gap-3">
        <button
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 px-4 py-2 text-base font-medium text-secondary-800 dark:text-secondary-200 shadow-sm hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-800 dark:hover:text-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </BaseModal>
</template>
