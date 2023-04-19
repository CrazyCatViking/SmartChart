<template>
  <div class="container-anchor-bottom-left"
    @mousedown.stop="onResizeStart"
    @click.stop
  />

  <GlobalEvents
    v-if="isResizing"
    @mousemove="onResize"
    @mouseup="onResizeEnd"
  />
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { GlobalEvents } from 'vue-global-events';
import { rectInjectionToken } from '../useRect';
import { Vector, createVector } from '../../utility/vector';
import { chartInjectionKey } from '../../canvas/chart';
import { useCanvasCoordinates } from '../../canvas/useCanvasCoordinates';

const { resizeRect, rectVertices } = inject(rectInjectionToken)!;
const { commitChanges } = inject(chartInjectionKey)!;

const { getCanvasCoordinates } = useCanvasCoordinates();

const isResizing = ref(false);
const initialPosition = ref<Vector>()

const onResizeStart = () => {
  isResizing.value = true
  initialPosition.value = rectVertices.value.b;
};

const onResizeEnd = () => {
  isResizing.value = false
  initialPosition.value = undefined;

  commitChanges();
};

const onResize = (e: MouseEvent) => {
  const { clientX, clientY } = e;

  const mouseClientPos = createVector(clientX, clientY);
  const mouseCanvasPos = getCanvasCoordinates(mouseClientPos);

  resizeRect(mouseCanvasPos, initialPosition.value!);
};
</script>

<style lang="scss">
.container-anchor-bottom-left {
  position: absolute;
  height: 5px;
  width: 5px;
  outline: 1px solid black;

  bottom: -6px;
  left: -6px;

  &:hover {
    cursor: sw-resize;
  }
}
</style>