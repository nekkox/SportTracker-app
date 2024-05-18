<script setup>
import { onMounted } from "vue";
import { useUserStore } from "@/store/user";
import { useSupabaseClient } from "@/composables/supabase";
import AppMenu from "./components/AppMenu.vue";
import { storeToRefs } from "pinia";
import { useAppStore } from "@/store/app";

const fitnessStore = useFitnessStore()
import { useFitnessStore } from '@/store/fitness'


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

    //!!!!
    await fitnessStore.getDashboard();
    //const ddd = await fitnessStore.getWorkoutsbyData(new Date())
    //console.log('uuuu', ddd);

  }

  useSupabaseClient.auth.onAuthStateChange((_, _session) => {
    userStore.setUserSession(_session);
  });

  await fitnessStore.getTodaysWorkout()

})

</script>




<template>
  <v-app theme="dark" app id="app">

    <app-menu />
    <v-app-bar app style="" height="40px">
      <v-app-bar-nav-icon @click="appStore.toggleDrawer()"></v-app-bar-nav-icon>
      <v-toolbar-title>💪 Fittest Pal - {{ pageTitle }}</v-toolbar-title>

    </v-app-bar>

    <v-sheet height="200" width="100%" style="margin-top: 40px;">
      <v-img src="/src/assets/new3.gif" cover height="200"></v-img>
    </v-sheet>

    <v-main style="margin-top: 0px; padding-top: 0px;">
      <v-container class="d-flex justify-center"> <router-view class="custom-router-view"
          style="height: fit-content"></router-view>

      </v-container>
      <v-dialog v-model="dialog.visible" :fullscreen="dialog.fullscreen">
        <v-card>
          <v-card-title>{{ dialog.title }}</v-card-title>
          <v-card-text>
            <p v-html="dialog.contents"></p>
          </v-card-text>
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


<style>
.v-application__wrap {
  min-height: calc(100vh - 340px);
  min-height: calc(100dvh - 340px);
}
</style>