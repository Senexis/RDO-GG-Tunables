<script setup>
import BaseModal from './BaseModal.vue';

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
    <div class="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <h3 class="text-lg font-bold pb-2 mb-4 border-b-2 border-slate-400 dark:border-slate-600">License</h3>
      <div class="text-sm">
        <p>
          This app is licensed under the MIT License, a short and simple permissive license with conditions only requiring preservation of
          copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and
          without source code.
        </p>
        <h4 class="text-md font-bold pb-2 my-4 border-b border-slate-400 dark:border-slate-600">MIT License</h4>
        <p class="mb-2">Copyright &copy; 2023 Senexis</p>
        <p class="mb-2">
          Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files
          (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify,
          merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
          furnished to do so, subject to the following conditions:
        </p>
        <p class="mb-2">
          The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
        </p>
        <p class="mb-2">
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
          LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
          CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        </p>
      </div>
    </div>
    <div class="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
      <div class="flex gap-3">
        <button
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 px-4 py-2 text-base font-medium text-slate-800 dark:text-slate-200 shadow-sm hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </BaseModal>
</template>
