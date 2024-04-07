<script setup>
import WorkoutStatus from '@/components/WorkoutStats.vue'
import { useFitnessStore } from '@/store/fitness'
import { storeToRefs } from "pinia";
import { onMounted } from 'vue';
const fitnessStore = useFitnessStore()
const { dashboard } = storeToRefs(fitnessStore);
onMounted(() => {
    // fitnessStore.getDashboard()
    console.log(dashboard);
})

</script>

<template>
    <div class="main-content">
        <h1 class="text-center">Summary of your Workouts:</h1>

        <v-sheet border="lg opacity-12" class="text-body-2 mx-auto" max-width="1200">
            <v-container>
                <v-row> 
                    <v-col cols="3" md="3" >
                        <v-img width="" height="200" src="/src/assets/cat3.png"></v-img>
                    </v-col>
                    <v-col cols="8" md="8" class="d-flex align-center">
                        <WorkoutStatus />
                    </v-col>
                    
                </v-row>
            </v-container>
        </v-sheet>

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
