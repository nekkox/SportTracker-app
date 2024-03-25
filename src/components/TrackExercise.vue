<script setup>
import { ref, computed } from "vue"
const showDialogDate = ref(false);
const selectedDate = ref(undefined);

import AddRoutine from "./AddRoutine.vue";

import { useFitnessStore } from '@/store/fitness'
const fitnessStore = useFitnessStore()
import { useAppStore } from "@/store/app";
const appStore = useAppStore();


const routines = ref([]);
const showDialogRoutine = ref(false);


const addRoutineToExercise = (newRoutine) => {
    showDialogRoutine.value = false;
    routines.value.push(newRoutine);
};

const formattedDate = computed(() => {
    if (selectedDate.value) {
        return new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(selectedDate.value[0]);
    }
    return "";
});

//Check if any routines are inserted
const canSaveWorkout = computed(() => {
    return routines.value.length > 0;
});

const reset = () => {
    routines.value = [];
    selectedDate.value = undefined;
};


const saveWorkout = () => {
    if (selectedDate.value && routines.value?.length > 0) {
        fitnessStore.saveWorkout({
            date: selectedDate.value,
            routines: routines.value,
        });
        appStore.showDialog({
            title: "Success",
            contents: "Workout saved successfully",
        });
        console.log('SAVED:');
        reset();
    } else {
        appStore.showDialog({
            title: "Error",
            contents: "Please select a date and add at least one routine",
        });
    }
};

const checkResult = async () => console.log(await fitnessStore.insertWorkout(new Date(), '851dc083-190c-4964-b510-04e8712db398'))

console.log(checkResult());
</script>
<template>
    <h1>TrackExercise</h1>

    <v-container>
        <v-row class="align-center justify-space-between mb-6">
            <v-btn @click="showDialogDate = true">
                <span v-if="selectedDate">Change date</span>
                <span v-else>Select date</span>
            </v-btn>
            {{ formattedDate }}
            <v-dialog v-model="showDialogDate" center>
                <v-date-picker v-model="selectedDate" show-adjacent-months @click:cancel="showDialogDate = false"
                    @click:save="showDialogDate = false" style="margin: 0 auto"></v-date-picker>
            </v-dialog>
        </v-row>

        {{ routines }}

        <v-row class="mb-6">
            <v-btn block size="x-large" @click="showDialogRoutine = true" v-if="selectedDate">Add routine</v-btn>
            <v-dialog v-model="showDialogRoutine">
                <v-card>
                    <v-card-text>
                        <AddRoutine @add="addRoutineToExercise" />
                    </v-card-text>
                    <v-card-actions>
                        <v-btn color="primary" @click="showDialogRoutine = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>


        <v-row class="mb-6">
            <v-btn block size="x-large" :disabled="!canSaveWorkout" @click="saveWorkout" v-if="selectedDate">Save
                workout</v-btn>
        </v-row>

    </v-container>
</template>
