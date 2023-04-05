<template>
  <div
    class="canvas"
    @click="resetSelection"
  >
    <CanvasElement
      v-for="element in elements"
      :key="element.id"
      :element="element"
    />
  </div>

  <div
    v-if="isAddingElement"
    class="canvas-draw-zone"
    @keydown.stop.prevent
  />

  <GlobalEvents
    @keydown.control.stop="() => ctrlPressed = true"
    @keyup.control.stop="() => ctrlPressed = false"
    @keydown.delete.stop="onDelete"
  />
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { GlobalEvents } from 'vue-global-events';
import CanvasElement from './CanvasElement.vue';
import { chartInjectionKey } from './chart';
import { hotKeyStateInjectionKey } from './hotKeyState';
import { canvasStateInjectionKey } from './canvasState';

const { elements, resetSelection, deleteSelected } = inject(chartInjectionKey)!;
const { ctrlPressed } = inject(hotKeyStateInjectionKey)!;
const { isAddingElement } = inject(canvasStateInjectionKey)!;

const onDelete = (e: KeyboardEvent) => {
  if (e.key === 'Delete') {
    deleteSelected();
  }
};
</script>

<style lang="scss">
.canvas {
  position: absolute;
  top: 0;
  left: 0;

  height: 100%;
  width: 100%;
}

.canvas-draw-zone {
  position: absolute;
  top: 0;
  left: 0;

  height: 100%;
  width: 100%;

  z-index: 2900;

  cursor: crosshair;
}
</style>