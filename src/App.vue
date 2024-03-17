<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <h1>APP</h1>
  </v-app>
</template>

<script setup>
import { onMounted } from "vue";
import { useUserStore } from "@/store/user";
import { useSupabaseClient } from "@/composables/supabase";


const userStore = useUserStore();

onMounted(async () => {
//Authenticating users
  const { data } = await useSupabaseClient.auth.getSession();
console.log(data);
  if (data && data.session && data.session.user) {
    await userStore.insertProfile(data.session);
    userStore.setUserSession(data.session);
  }

  useSupabaseClient.auth.onAuthStateChange((_, _session) => {
    userStore.setUserSession(_session);
  });
})

</script>
