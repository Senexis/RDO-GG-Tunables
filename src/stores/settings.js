import { defineStore } from 'pinia';

export const useStore = defineStore('settings', {
  persist: true,
  state: () => {
    return {
      // Open/close accordions.
      accordionsDismissed: [],

      // Open/close banners.
      bannersDismissed: [],

      // Show/hide panels.
      quickView: true,
      quickViewBelowTunables: false,

      // Show/hide types of changes.
      added: true,
      deleted: true,
      modified: true,
      unchanged: false,

      // Show/hide individual tunables.
      bonus: false,
      content: true,
      quickViewItems: false,
      tunables: true,
      verbose: false,
    };
  },
});
