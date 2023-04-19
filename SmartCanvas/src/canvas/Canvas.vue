<template>
  <DragSelect
    v-if="isSelecting"
  />

  <div
    class="canvas"
    @mousedown="onCanvasMouseDown"
    draggable="false"
    ref="canvas"
  >
    <CanvasElement
      v-for="(element) in elements"
      :key="uuidv4()"
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

    @keydown.ctrl.z.exact="undoChanges"
    @keydown.ctrl.shift.z="redoChanges"

    @keydown.ctrl.c.exact="copySelected"
    @keydown.ctrl.x.exact="cutSelected"
    @keydown.ctrl.v.exact="paste"
  />
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import { GlobalEvents } from 'vue-global-events';
import { v4 as uuidv4 } from 'uuid';
import CanvasElement from '../canvas/CanvasElement.vue';
import { chartInjectionKey } from './chart';
import { hotKeyStateInjectionKey } from './hotKeyState';
import { canvasStateInjectionKey } from './canvasState';
import DragSelect from '../DragSelect/DragSelect.vue';
import { useDragSelect } from '../DragSelect/useDragSelect';
import { createVector } from '../utility/vector';
import { useCopyPaste } from './copyPaste';
import { useCanvasCoordinates } from './useCanvasCoordinates';

const {
  elements,
  deleteSelected,
  undoChanges,
  redoChanges,
  commitChanges,
} = inject(chartInjectionKey)!;
const { ctrlPressed } = inject(hotKeyStateInjectionKey)!;
const { isAddingElement } = inject(canvasStateInjectionKey)!;

const canvas = ref<HTMLElement>();

const { isSelecting, beginSelection } = useDragSelect();
const { copySelected, cutSelected, paste } = useCopyPaste();
const { getCanvasCoordinates } = useCanvasCoordinates(canvas);

const onDelete = (e: KeyboardEvent) => {
  if (e.key === 'Delete') {
    deleteSelected();
    commitChanges();
  }
};

const onCanvasMouseDown = (e: MouseEvent) => {
  const { clientX, clientY } = e;
  const mouseClientPos = createVector(clientX, clientY);
  const mouseCanvasPos = getCanvasCoordinates(mouseClientPos);

  beginSelection(mouseCanvasPos);
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