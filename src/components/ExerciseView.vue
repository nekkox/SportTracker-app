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
        <v-row class="">
            <v-col cols="12" class="">
                <div class="">
                <h5 class="text-h1">{{ exercise.exerciseName }}</h5>
            </div>
            </v-col>
        </v-row>
        <v-row v-for="(routine, index) in exercise.routines" :key="index">
            <v-col cols="6">{{ routine.weight }}</v-col>
            <v-col cols="6">{{ routine.repetitions }}</v-col>
        </v-row>
    </v-col>
</template>