<script setup>
import { ref, computed } from "vue"
const showDialogDate = ref(false);
const selectedDate = ref(undefined);

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
    </v-container>
</template>
