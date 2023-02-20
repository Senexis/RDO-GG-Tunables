import { defineStore } from "pinia";

export const useStore = defineStore("settings", {
  persist: true,
  state: () => {
    return {
      // Panels.
      quickView: true,
      quickViewOpen: [
        "casino",
        "daily_objectives",
        "gun_van",
        "ls_car_meet",
        "luxury_autos_showroom",
        "premium_deluxe_motorsport_showroom",
        "time_trials",
        "sales",
      ],

      // Banners.
      bannersDismissed: [],

      // Types of changes.
      added: true,
      deleted: true,
      modified: true,
      unchanged: false,

      // Individual keys.
      bonus: false,
      content: true,
      tunables: true,
      verbose: false,
    };
  },
});
