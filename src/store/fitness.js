import { ref } from "vue";
import { defineStore } from 'pinia';
import { useSupabaseClient } from '@/composables/supabase'


export const useFitnessStore = defineStore('fitness', () => {

    const exercises = ref([{}]);

//Getting exercises from database
    const getExercises = async () => {
        try {
            const { data, error, status } = await useSupabaseClient
                .from("exercises")
                .select('id, name, color, created_at');

            if (error && status !== 406) throw error;

            if (data) {
                exercises.value = data
                return data
            }
        } catch (error) {
            console.error(error.message);
        }
    }
    getExercises()


  
    return {exercises, getExercises }
  })