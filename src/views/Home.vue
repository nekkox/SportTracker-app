<script setup>
import WorkoutStatus from '@/components/WorkoutStats.vue'
import { useFitnessStore } from '@/store/fitness'
import { storeToRefs } from "pinia";
import { onMounted } from 'vue';
const fitnessStore = useFitnessStore()
const { dashboard } = storeToRefs(fitnessStore);
onMounted(()=>{
   // fitnessStore.getDashboard()
    console.log(dashboard);
})

</script>

<template>
<div class="main-content">   
<h1>HOME</h1>
<WorkoutStatus />

</div>
</template>

<style scoped>
.main-content {
  height: 300px; 
  padding-top: 0px;
  padding-bottom: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
}
</style>