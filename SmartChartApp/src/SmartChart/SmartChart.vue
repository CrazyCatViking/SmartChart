<template>
  <Canvas />
  <Toolbar />
</template>

<script setup lang="ts">
import Canvas from './Canvas.vue';
import Toolbar from './Toolbar/Toolbar.vue';
import { useChart } from './chart';

const chart = useChart();
</script>