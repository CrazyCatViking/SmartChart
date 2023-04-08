<template>
  <DragSelect
    v-if="isSelecting"
  />

  <div
    class="canvas"
    @mousedown="onCanvasMouseDown"
    draggable="false"
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
import DragSelect from './DragSelect/DragSelect.vue';
import { useDragSelect } from './DragSelect/useDragSelect';
import { createVector } from './utility/vector';

const { elements, deleteSelected } = inject(chartInjectionKey)!;
const { ctrlPressed } = inject(hotKeyStateInjectionKey)!;
const { isAddingElement } = inject(canvasStateInjectionKey)!;

const { isSelecting, beginSelection } = useDragSelect()!;

const onDelete = (e: KeyboardEvent) => {
  if (e.key === 'Delete') {
    deleteSelected();
  }
};

const onCanvasMouseDown = (e: MouseEvent) => {
  const { clientX, clientY } = e;
  beginSelection(createVector(clientX, clientY));
};
</script>

<style lang="scss">
.canvas {
  position: absolute;
  top: 0;
  left: 0;

  height: 100%;
  width: 100%;

  background-color: white;

  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
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