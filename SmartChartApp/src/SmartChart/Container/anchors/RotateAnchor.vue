<template>
  <div class="container-rotate"
    @mousedown="onRotateStart"
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

const { rotateRect } = inject(rectInjectionToken)!;

const isRotating = ref(false);
const mousePosition = ref({ x: 0, y: 0 });

const onRotateStart = (e: MouseEvent) => {
  isRotating.value = true;

  mousePosition.value = {
    x: e.clientX,
    y: e.clientY,
  };
};

const onRotateEnd = (e: MouseEvent) => {
  isRotating.value = false;

  mousePosition.value = {
    x: 0,
    y: 0,
  };
};

const onRotate = (e: MouseEvent) => {
  rotateRect(e.clientX, e.clientY);
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