<template>
  <div class="canvas">
    <Container />
  </div>
</template>

<script setup lang="ts">
import Container from './Container.vue';


</script>

<style lang="scss">
.canvas {
  position: absolute;
  top: 0;
  left: 0;

  height: 100%;
  width: 100%;
}
</style>