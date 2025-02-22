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
    <div class="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
      <h3 class="mb-4 border-b-2 border-secondary-200 pb-2 text-lg font-semibold dark:border-secondary-600">Attribution</h3>
      <div class="text-sm">
        <p>This website wouldn't be possible if the following people and services didn't contribute. Thank you for helping out!</p>
        <h4 class="my-4 border-b border-secondary-200 pb-2 font-semibold dark:border-secondary-600">People</h4>
        <ul class="ml-6 list-disc">
          <li>
            <strong><a href="https://twitter.com/WildBrick142" target="_blank" rel="noopener noreferrer">WildBrick142</a>:</strong> Thanks
            for providing a bunch of tunable names.
          </li>
          <li>
            <strong><a href="https://twitter.com/PLTytus" target="_blank" rel="noopener noreferrer">PLTytus</a>:</strong> Thanks for helping
            in general with various things.
          </li>
          <li>
            <strong><a href="https://alloc8or.re/" target="_blank" rel="noopener noreferrer">Alloc8or</a>:</strong> Thanks for helping with
            the parsing of the tunable files.
          </li>
          <li>
            <strong><a href="https://github.com/AlanXYLi" target="_blank" rel="noopener noreferrer">Ghost</a>:</strong> Thanks for helping
            fix the dates of each tunable file.
          </li>
          <li>
            <strong
              ><a href="https://github.com/Senexis/RDO-GG-Tunables/graphs/contributors" target="_blank" rel="noopener noreferrer"
                >Contributors</a
              >:</strong
            >
            Thanks for improving the website!
          </li>
          <li><strong>You:</strong> Yes, you. Thanks for using the website!</li>
        </ul>
        <h4 class="my-4 border-b border-secondary-200 pb-2 font-semibold dark:border-secondary-600">Services</h4>
        <ul class="ml-6 list-disc">
          <li>
            <strong><a href="https://gtalens.com/" target="_blank" rel="noopener noreferrer">GTALens</a>:</strong> Thanks for providing the
            website with various job IDs for display in the tunable files for GTA V.
          </li>
          <li>
            <strong><a href="https://www.cloudflare.com/" target="_blank" rel="noopener noreferrer">Cloudflare</a>:</strong> Thanks for
            optimizing and protecting the website from bad actors.
          </li>
          <li>
            <strong><a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</a>:</strong> Thanks for providing the
            website with hosting, source control, and more.
          </li>
          <li>
            <strong><a href="https://sentry.io/" target="_blank" rel="noopener noreferrer">Sentry</a>:</strong> Thanks for allowing the
            website to detect errors in order to improve it.
          </li>
        </ul>
        <h4 class="my-4 border-b border-secondary-200 pb-2 font-semibold dark:border-secondary-600">Other</h4>
        <ul class="ml-6 list-disc">
          <li>
            <strong><a href="https://www.rockstargames.com/" target="_blank" rel="noopener noreferrer">Rockstar Games</a>:</strong> Thanks
            for making the games this website is for.
          </li>
          <li>
            <strong
              ><a href="https://github.com/Senexis/RDO-GG-Tunables/network/dependencies" target="_blank" rel="noopener noreferrer"
                >Open Source packages</a
              >:</strong
            >
            Thanks for laying the groundwork for the website's functionality.
          </li>
        </ul>
        <p class="mt-4 text-xs text-secondary-500">
          If you'd like to suggest additions to or corrections for this list, please
          <a href="https://x.com/Tunables" target="_blank" rel="noopener noreferrer"
            >contact us on <font-awesome-icon icon="fa-brands fa-x-twitter" aria-label="X" /></a
          >! Apologies if we missed anyone. We try to update this list from time to time.
        </p>
      </div>
    </div>
    <div
      class="bg-secondary-50 px-4 py-3 text-secondary-900 dark:bg-secondary-800 dark:text-secondary-50 sm:flex sm:flex-row-reverse sm:px-6"
    >
      <div class="flex gap-3">
        <button
          type="button"
          class="mt-3 inline-flex w-full justify-center rounded-md border border-secondary-300 bg-white px-4 py-2 text-base font-medium text-secondary-800 shadow-sm hover:bg-secondary-50 hover:text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-secondary-700 dark:bg-secondary-800 dark:text-secondary-200 dark:hover:bg-secondary-700 dark:hover:text-secondary-200 sm:mt-0 sm:w-auto sm:text-sm"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </BaseModal>
</template>
