<script setup >
import { computed } from "vue";
import { storeToRefs } from "pinia";

import { useFitnessStore } from "@/store/fitness";
import GroupedExerciseView from "./GroupedExerciseView.vue";

const fitnessStore = useFitnessStore();

const { exercises } = storeToRefs(fitnessStore);


const props = defineProps({
  exerciseId: {
    type: String,
    required: true,
  },
  routines: {
    type: Array,
    required: true,
  },
});

const exerciseIdToName = (id) => {
  const exercise = exercises?.value?.find(
    (exercise) => exercise.id === id
  );
  return exercise?.name ? exercise.name : "Unknown";
};

const exercise = computed(() =>
  props.routines.map((routine) => ({
    exercise_name: exerciseIdToName(props.exerciseId),
    sets_weight: routine.weight,
    sets_repetitions: routine.repetitions,
  }))
);
</script>
<template>
  <GroupedExerciseView :exercise="exercise" v-if="exercise" />
</template>