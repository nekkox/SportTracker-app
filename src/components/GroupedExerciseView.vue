<script setup>


defineProps({
  exercise: {
    type: Object,
    required: true,
  },
});

</script>
<template>
  <v-col cols="12">
    <v-row>
        <v-col cols="12"><h5 class="text-h5">{{ exercise[0].exercise_name }}</h5></v-col>
    </v-row>
    <v-row v-for="(routine, index) in exercise" :key="index">
      <v-col cols="6">{{ routine.sets_weight }}</v-col>
      <v-col cols="6">{{ routine.sets_repetitions }}</v-col>
    </v-row>
  </v-col>
</template>