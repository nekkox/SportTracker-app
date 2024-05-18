<script setup>
import Form from '@/components/FormLogin.vue'
import FormTest from '@/components/FormLoginTest.vue'
import { onMounted, ref } from 'vue';


</script>

<template>
   <v-sheet class="d-flex align-center">
      <v-sheet width="500px">
         <v-container class="">

            <Form />
         </v-container>
      </v-sheet>

      <v-sheet width="500px">
         <v-container class="">


            <FormTest />
         </v-container>
      </v-sheet>
   </v-sheet>
</template>

<style></style>