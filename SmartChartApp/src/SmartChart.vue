<template>
  <Canvas />
  <Toolbar />
</template>

<script setup lang="ts">
import Canvas from './SmartChart/Canvas.vue';
import Toolbar from './Toolbar/Toolbar.vue';
import { useCanvas } from './SmartChart/useCanvas';

const { chart } = useCanvas();
</script>