import { defineStore } from 'pinia';

export const useStore = defineStore('settings', {
  persist: true,
  state: () => {
    return {
      dark: true,

      // Open/close accordions.
      accordionsDismissed: [],

      // Open/close banners.
      bannersBlocked: false,
      bannersDismissed: [],

      // Show/hide panels.
      quickView: true,
      quickViewBelowTunables: false,
      tunablesPanel: true,

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

      // Miscellanous tunables settings.
      goToWeek: true,
      meta: true,
    };
  },
});
