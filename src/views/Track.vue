<script setup>
import { onMounted, ref } from 'vue';
import TrackExercise from "@/components/TrackExercise.vue";
import { storeToRefs } from "pinia";
import { useFitnessStore } from '@/store/fitness'

const fitnessStore = useFitnessStore()

const {todayWorkouts} = storeToRefs(fitnessStore);
const todayWorks = ref(todayWorkouts)
console.log('t',todayWorkouts);
onMounted(async()=>{
    await fitnessStore.getTodaysWorkout()
})

</script>
<template>
<div style="height: auto; width: 1000px;">
<TrackExercise :today="todayWorks"/>
</div>
</template>