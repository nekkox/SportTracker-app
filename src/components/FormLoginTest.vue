<script setup>
import { onMounted, ref } from "vue";
import { useUserStore } from "@/store/user";
import { useSupabaseClient } from '@/composables/supabase'
import { useAppStore } from "@/store/app";
import router from '@/router/';


const userStore = useUserStore(); //login functions
const appStore = useAppStore();

//const showDialog = ref(false);
const email = ref("");
const password = ref("")

//If login is ok then dialogbox is shown
/*
const login = () => {
  userStore.login(email.value);
  showDialog.value = true;
};

const resetForm = () => {
  showDialog.value = false;
};
*/
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const login =async  () => {
  if (email.value === "") {
    console.log("empty email");
    appStore.showDialog({
      title: "Email is required",
      contents: "Use 'test@gmail.com' to login"
    });
  }
  if (password.value === "") {
    console.log("empty password");
    appStore.showDialog({
      title: "Password is required",
      contents: "Use 'test' as password"
    });
  }


  else {
    console.log('trying');
    await userStore.TEST_login(email.value, password.value)
    router.go('/');
   /*    .then(xemail => {
        console.log(xemail);
        appStore.showDialog({
          title: "One Time Password login",
          contents: `Login Successful`,
          fullscreen: false
        });
        sleep(3000).then(() => {
          console.log("Redirecting");
          router.go('/');
        }); */

      /* })
      .catch(error => {
        console.log(error);
        if (error.toString().includes('Login failed')) {
          console.log("yes");
          appStore.showDialog({
            title: "Wrong Email",
            contents: "Please provide a valid email address"
          });
        }

      }); */
  }
};


</script>
<template>
  <v-container>
    <v-card min-width="230px" min-height="150" style="background-color:#383838;">
      <v-card-title style="margin-bottom: 10px;">Login With Test Accout<br><br>
        <span class="text-red">Email:</span> test@gmail.com <br>
        <span class="text-red">Password:</span> test
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field v-model="email" label="Email" type="email"></v-text-field>
          <v-text-field v-model="password" label="Password" type="password"></v-text-field>
          <v-btn type="submit" color="primary">Login</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

  </v-container>
</template>