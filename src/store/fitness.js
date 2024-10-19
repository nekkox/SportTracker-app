import { ref } from "vue";
import { defineStore } from "pinia";
import { useSupabaseClient } from "@/composables/supabase";
import { useUserStore } from "@/store/user";
import { useDateWithDashes } from "@/composables/date_formatting";

export const useFitnessStore = defineStore("fitness", () => {
  const exercises = ref([{}]);
  const dashboard = ref();

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
      console.log("INSERTING DATA: ", date);
      const { data, error } = await useSupabaseClient
        .from("workouts")
        .insert({ created_at: date, profile_id: profile_id })
        .select();

      if (error) throw error;
      const workoutId = data?.[0].id;
      return workoutId;
    } catch (error) {
      return error;
    }
  };

  const insertSets = async (sets) => {
    try {
      console.log("xxxx", sets);
      const { error } = await useSupabaseClient.from("sets").insert(sets);

      if (error) throw error;
    } catch (error) {
      return error;
    }
  };

  const saveWorkout = async (workout) => {
    const userStore = useUserStore();
    const { session } = userStore;

    if (session?.user?.id === undefined) return;
    const { id } = session.user;

    try {
      console.log("WORKOUT DATE", workout.date);
      //workout.date = '2024-04-04'
      console.log(workout.date);
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
        await getDashboard();
        await getWorkouts({ order: "descending" });
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const workouts = ref([]);

  const getWorkouts = async (options = { order: "ascending" }) => {
    try {
      const userStore = useUserStore();
      const { session } = userStore;

      if (session?.user?.id === undefined) return;
      const { id } = session.user;

      const order = { ascending: options.order === "ascending" };

      const { data, error, status } = await useSupabaseClient
        .from("workout_history_view")
        .select()
        .eq("profile_id", id)
        .order("workout_created_at", order);

      if (error && status !== 406) throw error;

      if (data) {
        workouts.value = data;
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const workoutsWithSets = ref([]);

  const getWorkoutsWithSets = async (options = { order: "ascending" }) => {
    try {
      const userStore = useUserStore();
      const { session } = userStore;

      if (session?.user?.id === undefined) return;
      const { id } = session.user;

      const order = { ascending: options.order === "ascending" };

      // Creating summary of workaout by joining tables: workouts, sets and exercises
      const { data, error, status } = await useSupabaseClient
        .from("workouts")
        .select(
          `
                id, created_at,
                sets (
                  workout_id, weight, repetitions,
                  exercises ( name, color ) 
                )
              `
        )
        .eq("profile_id", id)
        .order("created_at", order);

      if (error && status !== 406) throw error;

      if (data) {
        workoutsWithSets.value = data;
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const workoutsWithSetsByDate = ref([]);

  const getWorkoutsInDay = async (options = { order: "ascending" }) => {
    try {
      const userStore = useUserStore();
      const { session } = userStore;

      if (session?.user?.id === undefined) return;
      const { id } = session.user;

      const order = { ascending: options.order === "ascending" };

      // Creating summary of workaout by joining tables: workouts, sets and exercises
      const { data, error, status } = await useSupabaseClient
        .from("workouts")
        .select(
          `
              id, created_at,
              sets (
                workout_id, weight, repetitions,
                exercises ( name, color ) 
              )
            `
        )
        .eq("profile_id", id)
        .order("created_at", order);

      if (error && status !== 406) throw error;

      if (data) {
        workoutsWithSetsByDate.value = data;
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const getDashboard = async () => {
    try {
      const userStore = useUserStore();
      const { session } = userStore;

      if (session?.user?.id === undefined) {
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
        dashboard.value = data[0];
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  getDashboard();

  const byDate = ref([]);
  //Get workouts creaed at given date
  const getWorkoutsbyDate = async (date, options = { order: "ascending" }) => {
    const formattedDate = useDateWithDashes(date);
    //const gte = dateFormatting(date);
    //const lt = formatDatePlusOne(gte);

    try {
      const userStore = useUserStore();
      const { session } = userStore;

      if (session?.user?.id === undefined) return "CHECKING SESSION";

      const { id } = session.user;

      const order = { ascending: options.order === "ascending" };

      // Creating summary of workaout by joining tables: workouts, sets and exercises
      const { data, error, status } = await useSupabaseClient

        .from("workouts")
        .select(
          `
              id, created_at,
              sets (
                workout_id, weight, repetitions,
                exercises ( name, color ) 
              )
            `
        )
        .eq("profile_id", id)
        //.gte("created_at", `${gte}T00:00:00+00:00`)
        //.lt("created_at", `${lt}T00:00:00+00:00`)
        .eq("created_at", formattedDate);
      //.order("created_at", order);

      if (error && status !== 406) throw error;

      if (data) {
        byDate.value = data;
        console.log("Workouts by data", byDate.value);
        return byDate.value;
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  getWorkoutsbyDate();

  const todayWorkouts = ref();
  const getTodaysWorkout = async () => {
    try {
      todayWorkouts.value = await getWorkoutsbyDate(new Date());
    } catch (error) {
      console.error(error.message);
    }
  };

  return {
    exercises,
    getExercises,
    saveWorkout,
    workouts,
    getWorkouts,
    dashboard,
    getDashboard,
    workoutsWithSets,
    getWorkoutsWithSets,
    getWorkoutsInDay,
    workoutsWithSetsByDate,
    byDate,
    getWorkoutsbyDate,
    getTodaysWorkout,
    todayWorkouts,
  };
});
