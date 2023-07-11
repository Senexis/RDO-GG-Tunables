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
    <div class="bg-slate-900 text-slate-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <h3 class="text-lg font-bold pb-2 mb-4 border-b-2 border-slate-600">Attribution</h3>
      <div class="text-sm">
        <p>This app wouldn't be possible if the following people and services didn't contribute. Thank you for helping out!</p>
        <h4 class="text-md font-bold pb-2 my-4 border-b border-slate-600">People</h4>
        <ul class="list-disc ml-6">
          <li><strong>Alloc8or:</strong> Thanks for helping with the parsing of the tunable files.</li>
          <li><strong>WildBrick142:</strong> Thanks for providing a bunch of tunable names.</li>
          <li><strong>Ghost:</strong> Thanks for helping fix the dates of each tunable file.</li>
          <li>
            <strong>PLTytus:</strong> Thanks for helping fix the Daily Objectives (<a
              href="https://github.com/Senexis/RDO-GG-Tunables/issues/3"
              target="_blank"
              rel="noopener noreferrer"
              >#3</a
            >).
          </li>
        </ul>
        <h4 class="text-md font-bold pb-2 my-4 border-b border-slate-600">Services</h4>
        <ul class="list-disc ml-6">
          <li><strong>Cloudflare:</strong> Thanks for optimizing and protecting the app from bad actors.</li>
          <li><strong>GitHub:</strong> Thanks for providing the app with hosting, source control, and more.</li>
          <li><strong>GTALens:</strong> Thanks for providing the app with various job IDs for display in the tunable files for GTA V.</li>
          <li><strong>Sentry:</strong> Thanks for allowing the app to detect errors in order to improve it.</li>
        </ul>
        <h4 class="text-md font-bold pb-2 my-4 border-b border-slate-600">Other</h4>
        <ul class="list-disc ml-6">
          <li><strong>Rockstar Games:</strong> Thanks for making the games this app is for.</li>
          <li><strong>You:</strong> Yes, you. Thanks for using the app!</li>
        </ul>
      </div>
    </div>
    <div class="bg-slate-800 text-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
      <div class="flex gap-3">
        <button
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md border border-slate-700 bg-slate-800 px-4 py-2 text-base font-medium text-slate-200 shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </BaseModal>
</template>
