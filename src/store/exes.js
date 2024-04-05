import { defineStore } from 'pinia'
import { useFitnessStore } from "@/store/fitness";
import { ref } from "vue";
import { useSupabaseClient } from "@/composables/supabase";
import { useUserStore } from "@/store/user";

export const useExesStore = defineStore('exes', () => {

    const works = ref([]);
    const all = ref();

  const getWorkouts = async () => {
    const data= null
    const fitnessStore = useFitnessStore();
    await fitnessStore.getWorkoutsWithSets();
    const workouts = fitnessStore.workoutsWithSets;
    works.value = fitnessStore.workoutsWithSets;
    console.log('workouts', works.value);
    return workouts;
  }; 
  getWorkouts()


  const getAll = async () => {
    try {
      const userStore = useUserStore();
      const { session } = userStore;

      if (session?.user?.id === undefined){
        console.log("No user session");
        return;
      } 
      
      
      const { id } = session.user;
      console.log("Sesion Working");
      const { data, error, status } = await useSupabaseClient
        .from("workout_dashboard_view")
        .select()
        .eq("profile_id", id);

      if (error && status !== 406) throw error;

      if (data && data.length === 1) {
        all.value = data[0];
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  getAll();

  return { getWorkouts, getAll, all }
})