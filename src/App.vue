<script setup>
import { onMounted } from "vue";
import { useUserStore } from "@/store/user";
import { useSupabaseClient } from "@/composables/supabase";
import AppMenu from "./components/AppMenu.vue";


const userStore = useUserStore();

onMounted(async () => {
//Authenticating users
  const { data } = await useSupabaseClient.auth.getSession();
//data is null if user is not signed-in or has logged ou
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
    <v-main>
      <router-view />
    </v-main>
    <h1>APP</h1>
  </v-app>
</template>