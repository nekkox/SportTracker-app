<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUserStore } from "@/store/user";
import { useSupabaseClient } from '@/composables/supabase'
import { useAppStore } from "@/store/app";


const userStore = useUserStore();
const appStore = useAppStore();

const showDialog = ref(false);
const email = ref("");

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

const login = () => {
  if (email.value === "") {
    console.log("empty email");
    appStore.showDialog({
      title: "Email is required",
      contents: "We use the email address to send you a one time password login link. Please enter your email address."
    });
  } else {

    userStore.login(email.value)
      .then(xemail => {
        console.log(xemail);
        appStore.showDialog({
          title: "One Time Password login",
          contents: `We've sent a one time password login to the following email address: <strong>${email.value}</strong>. Using the link in the email, you can proceed to the app and you can close this browser window. If this is not the correct email address, please try again.`,
          fullscreen: true
        });
      })
      .catch(error => {
        if(error.toString().includes('Login failed')){
          console.log("yes");
          appStore.showDialog({
          title: "Wrong Email",
          contents: "Please provide a valid email address"
        });
        }
        
      });
  }
};




</script>
<template>
  <v-container>
    <v-card>
      <v-card-title>Login</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field v-model="email" label="Email" type="email" autofocus></v-text-field>
          <v-btn type="submit" color="primary">Login</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    <!---
    <v-dialog v-model="showDialog" fullscreen>
      <v-card>
        <v-card-title>One Time Password login</v-card-title>
        <v-card-text>
            <p>
            We've sent a one time password login the the following email address: <strong>{{ email }}</strong>. 
            Using the link in the email, you can proceed to the app and you can close this browser window.
          </p>
          <p> If this is not the correct email address, please try again.</p>
          </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="resetForm">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  -->
  </v-container>
</template>