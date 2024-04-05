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
  <v-app theme="dark" full-height>
    <div class="">
      <app-menu />
      <v-app-bar app height="40" >
        <v-app-bar-nav-icon @click="appStore.toggleDrawer()"></v-app-bar-nav-icon>
        <v-toolbar-title>💪 Fittest Pal - {{ pageTitle }}</v-toolbar-title>
      </v-app-bar>




<v-container>
      <v-main app style="height: calc(100vh - 70px); overflow: hidden; ">
        <div>

          <!-- If using vue-router -->
          <router-view></router-view>
          
        </div>
     
      </v-main>
    </v-container>
      <v-footer app>
        <span>&copy; {{ currentYear }} 💪 Fittest Pal Fitness Tracker</span>
      </v-footer>
    </div>
  </v-app>
</template>

