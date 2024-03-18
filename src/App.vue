<script setup>
import { onMounted } from "vue";
import { useUserStore } from "@/store/user";
import { useSupabaseClient } from "@/composables/supabase";
import AppMenu from "./components/AppMenu.vue";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/store/app";


const userStore = useUserStore();
const appStore = useAppStore();

const { pageTitle, dialog } = storeToRefs(appStore);
const currentYear = new Date().getFullYear();

onMounted(async () => {
//Authenticating users
  const { data } = await useSupabaseClient.auth.getSession();
//data is null if user is not signed-in or has logged out
 
if (data && data.session && data.session.user) {
    await userStore.insertProfile(data.session);
    userStore.setUserSession(data.session);
  }

  useSupabaseClient.auth.onAuthStateChange((_, _session) => {
    userStore.setUserSession(_session);
  });
})

</script>

<template>
  <v-app>
   <AppMenu />
   <v-app-bar app style="position: relative">
    <v-app-bar-nav-icon @click="appStore.toggleDrawer()"></v-app-bar-nav-icon>
<v-toolbar-title>💪 Fittest Pal - {{ pageTitle }}</v-toolbar-title>
</v-app-bar>
    <v-main>
      <router-view />

      <v-dialog v-model="dialog.visible" :fullscreen="dialog.fullscreen">
        <v-card>{{ console.log(dialog) }}
          <v-card-title>{{ dialog.title }}</v-card-title>
          <v-card-text><p v-html="dialog.contents"></p> </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="appStore.hideDialog">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-main>

    <v-footer app>
<span>&copy; {{ currentYear }} 💪 Fittest Pal Fitness Tracker</span>
</v-footer>
  </v-app>
</template>