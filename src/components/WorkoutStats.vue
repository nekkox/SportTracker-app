<script setup>
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useFitnessStore } from "@/store/fitness";
const fitnessStore = useFitnessStore();
const { dashboard } = storeToRefs(fitnessStore);

const daysSinceLastWorkout = computed(() => {
    if (!dashboard.value) return 0;
    const lastWorkout = new Date(dashboard.value.last_workout_date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastWorkout.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
});


onMounted(async () => {
    //fitnessStore.getDashboard();
});


</script>

<template>

    <div class="d-flex flex-wrap ga-4">
        <v-card color="blue" width="200px" height="90" class="align-self-stretch flex-grow-1 text-center">
            <v-card-title>{{ daysSinceLastWorkout }}</v-card-title>
            <v-card-text>Days since last workout</v-card-text>
        </v-card>
        <v-card color="blue" width="200px" height="90" class="align-self-stretch flex-grow-1 text-center">
            <v-card-title>{{ dashboard?.total_workouts || 0 }}</v-card-title>
            <v-card-text>Total workouts</v-card-text>

        </v-card>
        <v-card color="blue" width="200px" height="90" class="align-self-stretch flex-grow-1 text-center">
            <v-card-title>{{ dashboard?.cumulative_weight || 0 }}</v-card-title>
            <v-card-text>Cumulative weight moved</v-card-text>

        </v-card>
        <v-card color="blue" width="200px" height="90" class="align-self-stretch flex-grow-1 text-center">
            <v-card-title>{{ dashboard?.most_weight_single_workout || 0 }} </v-card-title>
            <v-card-text>Most weight in a single workout</v-card-text>
        </v-card>
    </div>
</template>