<script setup>
import { ref } from "vue";
import GraphPie from '@/components/GraphPie.vue'
import GraphBar from '@/components/GraphBar.vue'
import GraphLine from '@/components/GraphLine.vue'

const panel = ref([null]);
</script>
<template>
 <v-container>
      <h1>Graphs</h1>
      <v-expansion-panels v-model="panel" accordion>
        <v-expansion-panel>
          <v-expansion-panel-title>Workout distribution all time (sets & reps)</v-expansion-panel-title>
          <v-expansion-panel-text>
            <GraphPie />
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-title>Monthly cumulative weight per exercise</v-expansion-panel-title>
          <v-expansion-panel-text>
            <GraphBar />
          </v-expansion-panel-text>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-title>Cumulative effort per exercise over time</v-expansion-panel-title>
          <v-expansion-panel-text>
            <GraphLine />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
</template>