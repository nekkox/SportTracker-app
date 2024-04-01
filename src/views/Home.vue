<script setup>
import WorkoutStatus from '@/components/WorkoutStats.vue'
import { useFitnessStore } from '@/store/fitness'
import { storeToRefs } from "pinia";
import { onMounted } from 'vue';
const fitnessStore = useFitnessStore()
const { dashboard } = storeToRefs(fitnessStore);
onMounted(()=>{
    fitnessStore.getDashboard()
    console.log(dashboard);
})

</script>

<template>
   
<h1>HOME</h1>
<WorkoutStatus />
</template>