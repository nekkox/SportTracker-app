// Utilities
import { defineStore } from "pinia";
import { ref } from "vue";
import router from "@/router";

export const useAppStore = defineStore("app", () => {
  const drawer = ref(false);

  const toggleDrawer = (newValue) => {
    if (typeof newValue === "boolean") {
      drawer.value = newValue;
    } else {
      drawer.value = !drawer.value;
    }
  };

  const pageTitle = ref("Home");

  const navigateToPage = (page) => {
    const title = page.slice(1).charAt(0).toUpperCase() + page.slice(2);
    pageTitle.value = title || "Home";
    toggleDrawer(false);
    router.push(page);
  };

  const dialog = ref({
    title: "",
    contents: "",
    visible: false,
    fullscreen: false,
  });

  const showDialog = (options) => {
    dialog.value = { ...options, visible: true };
  };

  const hideDialog = () => {
    dialog.value = {
      title: "",
      contents: "",
      visible: false,
      fullscreen: false,
    };
  };

  return {
    drawer,
    pageTitle,
    toggleDrawer,
    navigateToPage,
    dialog,
    showDialog,
    hideDialog,
  };
});
