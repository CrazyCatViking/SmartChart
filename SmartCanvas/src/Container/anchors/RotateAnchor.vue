<template>
  <div class="container-rotate"
    @mousedown.stop="onRotateStart"
    @click.stop.prevent
  />

  <GlobalEvents
    v-if="isRotating"
    @mousemove="onRotate"
    @mouseup="onRotateEnd"
  />
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import { GlobalEvents } from 'vue-global-events';
import { rectInjectionToken } from '../useRect';
import { chartInjectionKey } from '../../canvas/chart';
import { createVector } from '../../utility/vector';
import { useCanvasCoordinates } from '../../canvas/useCanvasCoordinates';

const { rotateRect } = inject(rectInjectionToken)!;
const { commitChanges } = inject(chartInjectionKey)!;

const { getCanvasCoordinates } = useCanvasCoordinates();

const isRotating = ref(false);
const mousePosition = ref(createVector(0, 0));

const onRotateStart = (e: MouseEvent) => {
  isRotating.value = true;

  const { clientX, clientY } = e;

  const mouseClientPos = createVector(clientX, clientY);
  const mouseCanvasPos = getCanvasCoordinates(mouseClientPos);

  mousePosition.value = mouseCanvasPos;
};

const onRotateEnd = (e: MouseEvent) => {
  isRotating.value = false;

  mousePosition.value = createVector(0, 0);

  commitChanges();
};

const onRotate = (e: MouseEvent) => {
  const { clientX, clientY } = e;

  const mouseClientPos = createVector(clientX, clientY);
  const mouseCanvasPos = getCanvasCoordinates(mouseClientPos);

  rotateRect(mouseCanvasPos);
};
</script>

<style lang="scss">
.container-rotate {
  position: absolute;
  height: 5px;
  width: 5px;
  border-radius: 50%;
  outline: 1px solid blue;

  top: -10px;
  left: 50%;
  transform: translate(-50%);

  &:hover {
    cursor: grab;
  }
}
</style>