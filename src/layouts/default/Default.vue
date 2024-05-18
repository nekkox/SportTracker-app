<template>
  <v-app>

    <v-main style="margin-top: 0px;" class="d-flex align-center">
      <router-view style="height: fit-content; " />

    </v-main>

  </v-app>
</template>

<script setup>

</script>
<style>
.v-application__wrap {
  min-height: calc(100vh - 340px);
  min-height: calc(100dvh - 340px);
}
</style>