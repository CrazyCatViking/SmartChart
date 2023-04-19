<template>
  <div
    class="canvas-drag-select"
    :style="style"
    draggable="false"
  />

  <GlobalEvents
    v-if="isSelecting"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
  />
</template>

<script setup lang="ts">
import { StyleValue, computed, inject, ref } from 'vue';
import { GlobalEvents } from 'vue-global-events';
import { dragSelectStateKey } from './useDragSelect';
import { Vector, createVector } from '../utility/vector';
import { useCanvasCoordinates } from '../canvas/useCanvasCoordinates';

const { isSelecting, initialPosition, endSelection } = inject(dragSelectStateKey)!;
const { getCanvasCoordinates } = useCanvasCoordinates();

const currentPosition = ref<Vector>();

const style = computed<StyleValue>(() => {
  const { x: initialX, y: initialY } = initialPosition.value;
  const { x: currentX, y: currentY } = currentPosition.value ?? createVector(initialX, initialY);

  const width = Math.abs(currentX - initialX);
  const height = Math.abs(currentY - initialY);

  const x = initialX < currentX ? initialX : currentX;
  const y = initialY < currentY ? initialY : currentY;

  return {
    transform: `translate(${x}px, ${y}px)`,
    width: `${width}px`,
    height: `${height}px`,
  }
});

const onMouseMove = (e: MouseEvent) => {
  const { clientX, clientY } = e;

  const mouseClientPos = createVector(clientX, clientY);
  const mouseCanvasPos = getCanvasCoordinates(mouseClientPos);

  currentPosition.value = mouseCanvasPos;
};

const onMouseUp = (e: MouseEvent) => {
  const { clientX, clientY } = e;

  const mouseClientPos = createVector(clientX, clientY);
  const mouseCanvasPos = getCanvasCoordinates(mouseClientPos);

  endSelection(mouseCanvasPos);
};
</script>

<style lang="scss">
.canvas-drag-select {
  position: absolute;
  top: 0;
  left: 0;

  background-color: rgba($color: #7696cd, $alpha: 0.3);

  z-index: 2500;
}
</style>