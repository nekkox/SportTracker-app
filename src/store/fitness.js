import { ref } from "vue";
import { defineStore } from "pinia";
import { useSupabaseClient } from "@/composables/supabase";
import { useUserStore } from "@/store/user";

export const useFitnessStore = defineStore("fitness", () => {
  const exercises = ref([{}]);

  const dashboard = ref();

  const getDashboard = async () => {
    try {

        const userStore = useUserStore()
        const { session } = userStore

        if (session?.user?.id === undefined) return
        const { id } = session.user;

        const { data, error, status } = await useSupabaseClient
            .from('workout_dashboard_view')
            .select()
            .eq('profile_id', id)

        if (error && status !== 406) throw error

        if (data && data.length === 1) {
            dashboard.value = data[0]
        }
    } catch (error) {
        console.error(error.message);
    }
}
getDashboard()



  //Getting exercises from database
  const getExercises = async () => {
    try {
      const { data, error, status } = await useSupabaseClient
        .from("exercises")
        .select("id, name, color, created_at");

      if (error && status !== 406) throw error;

      if (data) {
        exercises.value = data;
        return data;
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  getExercises();

  const insertWorkout = async (date, profile_id) => {
    try {
      const { data, error } = await useSupabaseClient
        .from("workouts")
        .insert({ created_at: date, profile_id: profile_id })
        .select();

      if (error) throw error;
      const workoutId = data?.[0].id;
      return workoutId;
    } catch (error) {
      console.error(error.message);
      return error;
    }
  };

  const insertSets = async (sets = []) => {
    try {
      const { error } = await useSupabaseClient.from("sets").insert(sets);

      if (error) throw error;
    } catch (error) {
      console.error(error.message);
      return error;
    }
  };

  const saveWorkout = async (workout) => {
    const userStore = useUserStore();
    const { session } = userStore;

    if (session?.user?.id === undefined) return;
    const { id } = session.user;
    console.log("Session ID:", id);

    try {
      const workoutId = await insertWorkout(workout.date, id);
      if (workoutId) {
        const sets = [];

        for (const routine of workout.routines) {
          for (const innerRoutine of routine.routines) {
            sets.push({
              exercise_id: routine.exercise || "",
              workout_id: workoutId,
              profile_id: id,
              weight: innerRoutine.weight,
              repetitions: innerRoutine.repetitions,
            });
          }
        }

        await insertSets(sets);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return { exercises, getExercises, saveWorkout, dashboard, getDashboard };
});
