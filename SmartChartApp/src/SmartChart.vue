<template>
  <Canvas />
  <Toolbar />
</template>

<script setup lang="ts">
import Toolbar from './Toolbar/Toolbar.vue';
import { useCanvas, Canvas } from '@crazycatviking/smartcanvas';

const { chart } = useCanvas();
</script>