<script setup>


defineProps({
  exercise: {
    type: Object,
    required: true,
  },
});

</script>
<template>

  <v-col cols="12" class="mt-0">

    <v-row class="rounded-t-lg" style="background-color: rgb(177,52,146);">
      <v-col cols="12">
        <h5 class="text-h5 text-center">{{ exercise[0].exercise_name }}</h5>
      </v-col>
    </v-row>
    <v-row v-for="(routine, index) in exercise" :key="index">
      <v-col cols="6" class="text-center" style="background-color: rgb(33,33,33);">{{ routine.sets_weight }}</v-col>
      <v-divider vertical></v-divider>
      <v-col cols="6" class="text-center" style="background-color: rgb(33,33,33);">{{ routine.sets_repetitions
        }}</v-col>
    </v-row>
  </v-col>
</template>