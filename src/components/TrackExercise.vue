<script setup>
import { ref, computed, onMounted } from "vue"
import { useFitnessStore } from '@/store/fitness'
const fitnessStore = useFitnessStore()
import { useAppStore } from "@/store/app";
const appStore = useAppStore();
import { storeToRefs } from "pinia";
const { workoutsWithSets } = storeToRefs(fitnessStore);
import { useDateWithoutTime } from "@/composables/date_formatting";

const exercisesOnDay = ref()
const props = defineProps(['today'])
const showToday = ref(true)
const noExercises = ref(false)

const computedtoday = computed(() => {

    return props.today

})

const { todayWorkouts } = storeToRefs(fitnessStore);
console.log('ii', todayWorkouts);

const showDialogDate = ref(false);
const selectedDate = ref(new Date());



const formattedDate = computed(() => {
    console.log('computed', selectedDate.value);
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


const fullName = computed({
    // getter
    get() {
        if (selectedDate.value) {
            return new Intl.DateTimeFormat("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            }).format(selectedDate.value);
        }
        return "";
    },
    // setter
    set(newValue) {
        // Note: we are using destructuring assignment syntax here.
        selectedDate.value = newValue.split(' ')
    }
})


import AddRoutine from "./AddRoutine.vue";
import ExerciseGrouping from "./ExerciseGrouping.vue"

const routines = ref([]);
const showDialogRoutine = ref(false);


const addRoutineToExercise = (newRoutine) => {
    showDialogRoutine.value = false;
    routines.value.push(newRoutine);
};



//Check if any routines are inserted
const canSaveWorkout = computed(() => {
    return routines.value.length > 0;
});

const reset = () => {
    routines.value = [];
    //selectedDate.value = new Date();
};



const saveWorkout = () => {
    if (selectedDate.value && routines.value?.length > 0) {

        //Formt selectedDate to have actual time as well
        console.log('Prepared date', selectedDate.value);
        const dateString = selectedDate.value
        const formattedDateString = useDateWithoutTime(dateString);
        console.log(formattedDateString);


        fitnessStore.saveWorkout({
            date: formattedDateString,
            routines: routines.value,
        });
        appStore.showDialog({
            title: "Success",
            contents: "Workout saved successfully",
        });
        console.log('SAVED:', selectedDate.value);
        reset();
    } else {
        appStore.showDialog({
            title: "Error",
            contents: "Please select a date and add at least one routine",
        });
    }
};

onMounted(async () => {

    //get todays workout
    //const ddd = await fitnessStore.getWorkoutsbyDate(new Date())
    //console.log('uuuu', ddd[0]);

    //await getPonies()
    console.log(exercisesOnDay.value);
    //showToday.value = false
});


const getPonies = async () => {
    console.log("Getting workouts by given date");
    console.log('Data in ponies', selectedDate.value);
    if (selectedDate.value == undefined) {
        selectedDate.value = new Date()
    }
    await fitnessStore.getWorkoutsbyDate(selectedDate.value)
    const response = fitnessStore.byDate
    if (response.length > 0) {
        exercisesOnDay.value = response.map(entry => ({
            name: entry.sets[0].exercises.name,
            weight: entry.sets[0].weight,
            repetitions: entry.sets[0].repetitions
        }));
        noExercises.value = false
    }
    else {
        console.log("No exercises this day")
        exercisesOnDay.value = null
        showToday.value = false
        noExercises.value = true

    }

    //const { byDate } = storeToRefs(fitnessStore);
    //console.log('RES3', byDate.value[0]);
    // console.log('RES3ALL', byDate.value);
    //return "vego"

}


//exercisesOnDay.value = todayWorkouts
//console.log('start', exercisesOnDay.value);

function getCurrentDate(date) {

    const year = date.getFullYear();
    let month = date.getMonth() + 1; // Adding 1 because months are zero-based
    let day = date.getDate();

    // Add leading zeros if month/day is a single digit
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    return `${year}-${month}-${day}`;
}

</script>
<template>
    <h1 class="text-center mb-6">Track You Exercise And Add new Routines:</h1>
    <v-container style="">
        <v-row class="mb-6 justify-space-around">

            <v-col>
                <p>Showing Workouts for:&nbsp; {{ fullName }}</p>
            </v-col>
            <v-col class="text-right">
                <p>Todays date is:&nbsp;&nbsp; <span class="text-pink">{{ formattedDate }}</span></p>
            </v-col>
        </v-row>


        <v-row class="d-flex align-center mb-10">

            <!--BUTTONS -->
            <v-col cols="4">
                <v-sheet class="pa-2 ma-2" style="">


                    <!--Change Date button-->
                    <v-row class="d-flex justify-center mb-6">

                        <v-btn @click="showDialogDate = true" class="w-50" style="background-color:rgb(177,52,146);">
                            <span v-if="selectedDate">Change date</span>
                            <span v-else>Select date</span>
                        </v-btn>


                        <div class="text-center" id="xxx">
                            <v-dialog v-model="showDialogDate" width="auto">
                                <v-card max-width="350px" class="d-flex align-center justify-center">
                                    <v-date-picker v-model="selectedDate" show-adjacent-months
                                        @click:cancel="showDialogDate = false" @click:save="showDialogDate = false"
                                        style="margin: 0 auto"></v-date-picker>

                                    <template v-slot:actions>
                                        <v-btn class="ms-auto" text="Ok"
                                            @click="showDialogDate = false; getPonies()"></v-btn>
                                        <v-btn class="ms-auto" text="Cancel" @click="showDialogDate = false"></v-btn>
                                    </template>
                                </v-card>

                            </v-dialog>
                        </div>
                    </v-row>


                    <!--Add Routine button-->
                    <v-row class="mb-6">
                        <v-btn block size="x-large" @click="showDialogRoutine = true" v-if="selectedDate"
                            style="background-color: rgb(87,185,208);">Add
                            routine</v-btn>
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

                    <!--Save Workout button-->
                    <v-row class="mb-6">
                        <v-btn block size="x-large" :disabled="!canSaveWorkout" @click="saveWorkout" v-if="selectedDate"
                            style="background-color: rgb(87,185,208);">Save workout</v-btn>
                    </v-row>

                    <v-row class="d-flex justify-center">
                        <!--Get All button-->
                        <v-btn @click="getPonies()" class="w-50" style="background-color:rgb(177,52,146);">GET
                            ALL</v-btn>
                    </v-row>
                </v-sheet>
            </v-col>



            <!-- TABLE -->
            <v-col cols="8">
                <v-sheet class="pa-2 ma-2" style=" min-height: 150px;">

                    <v-card class="">

                        {{ console.log(selectedDate) }}
                        <v-table v-if="exercisesOnDay && exercisesOnDay.length > 0" height="auto" fixed-header>
                            <template v-slot:top>
                                <div class="d-flex justify-center align-center"
                                    style="height: 35px; background-color: rgb(177,52,146)">
                                    <h2 class="text-center">{{ getCurrentDate(selectedDate) == getCurrentDate(new
                    Date()) ?
                    'Todays\'s Routines' : fullName }}</h2>
                                </div>
                            </template>
                            <thead>
                                <tr>
                                    <th class="text-left text-pink">
                                        Exercise Name
                                    </th>
                                    <th class="text-left text-pink">
                                        Weight
                                    </th>
                                    <th class="text-left text-pink">
                                        Repetitions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, index) in exercisesOnDay" :key="index">
                                    <td>{{ row.name }}</td>
                                    <td>{{ row.weight }}</td>
                                    <td>{{ row.repetitions }}</td>
                                </tr>
                            </tbody>
                        </v-table>


                        <div v-if="Array.isArray(computedtoday) && !exercisesOnDay && showToday">

                            <v-table height="auto" fixed-header>
                                <template v-slot:top>
                                    <div class=" d-flex justify-center align-center"
                                        style="height: 35px; background-color: rgb(177,52,146);">
                                        <h2 class="text-center">Todays's Routines</h2>
                                    </div>
                                </template>

                                <thead>
                                    <tr>
                                        <th class="text-left text-pink">
                                            Exercise Name
                                        </th>
                                        <th class="text-left text-pink">
                                            Weight
                                        </th>
                                        <th class="text-left text-pink">
                                            Repetitions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(row, index) in computedtoday" :key="index">
                                        <td>{{ row.sets[0].exercises.name }}</td>
                                        <td>{{ row.sets[0].weight }}</td>
                                        <td>{{ row.sets[0].repetitions }}</td>
                                    </tr>
                                </tbody>
                            </v-table>

                        </div>
                        <h2 v-if="noExercises" class="text-center">NO ROUTINES FOR THIS DAY</h2>
                    </v-card>

                </v-sheet>
            </v-col>
        </v-row>


        <div>
            <h2 class="mb-3" v-if="routines.length > 0">Workouts to be Added:</h2>
            <ExerciseGrouping :key="index" v-for="(row, index) in routines" :exercise-id="row.exercise || 'Unknown'"
                :routines="row?.routines" class="mb-0" />
            {{ console.log(routines) }}
        </div>


    </v-container>

</template>
