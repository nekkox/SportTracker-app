import { defineStore } from 'pinia'
import { useFitnessStore } from "@/store/fitness";


export const useGraphStore = defineStore('graph', () => {
  const getWorkouts = async () => {
    const fitnessStore = useFitnessStore();
    await fitnessStore.getWorkoutsWithSets();
    const workouts = fitnessStore.workoutsWithSets;
    return workouts;
  };

  // helper function to gather and format the data based on a monthly average.
  const createGraphData = async (workouts) => {
    const monthlyAverages = {};

    for (const entry of workouts) {
      const month = new Date(entry.created_at).toLocaleString('en-US', { month: 'long' });

      for (const set of entry.sets) {
        const { name, color } = set.exercises;
        const weightRepetitions = set.weight * set.repetitions;

        if (!monthlyAverages[name]) {
          monthlyAverages[name] = {
            labels: [],
            datasets: [
              {
                label: name,
                backgroundColor: color,
                data: [],
              },
            ],
          };
        }

        const exerciseData = monthlyAverages[name];
        const monthIndex = exerciseData.labels.indexOf(month);
        if (monthIndex === -1) {
          exerciseData.labels.push(month);
          exerciseData.datasets[0].data.push(weightRepetitions);
        } else {
          exerciseData.datasets[0].data[monthIndex] += weightRepetitions;
        }
      }
    }

    return monthlyAverages;
  };



  const getGraphMonthlyAverage = async () => {
    const workouts = await getWorkouts();
    if (!workouts) return;

    const monthlyAverages = await createGraphData(workouts);

    const datasets = Object.values(monthlyAverages).map((exercise) => exercise.datasets[0]);

    const labels = monthlyAverages[Object.keys(monthlyAverages)[0]].labels;
    return { labels, datasets };
  };


  //getting the workout data from database and returning it as an object that’s compatible with a pie chart
  const getGraphPie = async () => {
    const workouts = await getWorkouts();
    if (!workouts) return;

    const exerciseNames = [];
    const exerciseData = {
      datasets: [{
        backgroundColor: [],
        data: []
      }]
    };

    for (const entry of workouts) {
      for (const set of entry.sets) {
        const exerciseName = set.exercises.name;
        const exerciseColor = set.exercises.color;
        const total = set.repetitions;

        const exerciseIndex = exerciseNames.indexOf(exerciseName);
        if (exerciseIndex === -1) {
          exerciseNames.push(exerciseName);
          exerciseData.datasets[0].backgroundColor.push(exerciseColor);
          exerciseData.datasets[0].data.push(total);
        } else {
          exerciseData.datasets[0].data[exerciseIndex] += total;
        }
      }
    }

    return {
      labels: exerciseNames,
      datasets: exerciseData.datasets,
    };
  };

  return { getGraphMonthlyAverage, getGraphPie }
})