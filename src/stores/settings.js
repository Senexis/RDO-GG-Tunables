import { defineStore } from 'pinia';

export const useStore = defineStore('settings', {
  persist: true,
  state: () => {
    return {
      // TODO: 😎
      // dark: true,

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
      content: true,
      quickViewItems: false,
      sales: true,
      tunables: true,
      verbose: false,
    };
  },
});
