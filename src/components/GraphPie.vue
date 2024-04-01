<script setup >
import { ref, onMounted } from "vue";

import { useGraphStore } from "@/store/graph";

const graphStore = useGraphStore();

import { Pie } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const chartData = ref({ labels: [], datasets: [] });

const chartOptions = {
  responsive: true,
};

onMounted(async () => {
  const res = await graphStore.getGraphPie();
  if (res?.labels && res?.datasets) {
    chartData.value = {
      labels: res.labels,
      datasets: res.datasets,
    };
  }
});
</script>

<template>
    <div>
  <Pie id="pie-chart-id" :options="chartOptions" :data="chartData" v-if="chartData.labels.length > 0 && chartData.datasets.length > 0"/>
  <div v-else> Sorry, no data </div>
</div>
</template>