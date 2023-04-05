<template>
  <div class="canvas">
    <CanvasElement
      v-for="element in elements"
      :key="element.id"
      :element="element"
    />
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import CanvasElement from './CanvasElement.vue';
import { chartInjectionKey } from './chart';

const { elements, removeElement } = inject(chartInjectionKey)!;
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