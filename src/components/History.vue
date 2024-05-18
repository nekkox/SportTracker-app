<script setup>
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";
import { useFitnessStore } from "@/store/fitness";
const fitnessStore = useFitnessStore();

const { workouts } = storeToRefs(fitnessStore);

import WorkoutStats from "./WorkoutStats.vue";
import GroupedExerciseView from "./GroupedExerciseView.vue"

const panel = ref([0]);

const formattedDate = (date) => {
  if (date) {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  }
  return "";
};


//every unique workout has a collection of corresponding exercises as a child
const workoutsById = (workouts = []) =>
  workouts.reduce((acc, curr) => {
    if (!acc[curr.workout_id])
      acc[curr.workout_id] = {
        workout_id: curr.workout_id,
        workout_created_at: curr.workout_created_at,
        sets: [],
      };
    acc[curr.workout_id].sets.push(curr);
    return acc;
  }, {});

const setsByExerciseName = (sets) =>
  sets.reduce((acc, curr) => {
    if (!acc[curr.exercise_name]) acc[curr.exercise_name] = [];
    acc[curr.exercise_name].push(curr);
    return acc;
  }, {});

const workoutIds = computed(() => Object.keys(workoutsById(workouts.value)));

const workoutsGroupedById = computed(() => workoutsById(workouts.value));



onMounted(() => {
  fitnessStore.getWorkouts({ order: 'descending' });
});
</script>

<template>
  <v-container>
    <WorkoutStats class="mb-4" />
    <h1>Past workouts</h1>
    <v-expansion-panels v-model="panel" multiple v-if="workouts">
      <v-expansion-panel v-for="id in workoutIds" :key="id">
        <v-expansion-panel-title>{{ formattedDate(new Date(workoutsGroupedById[id].workout_created_at))
          }}</v-expansion-panel-title>
        <v-expansion-panel-text>

          <GroupedExerciseView :exercise="set" v-for="(set, index) in 
            setsByExerciseName(workoutsGroupedById[id].sets)" :key="index" />

        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>