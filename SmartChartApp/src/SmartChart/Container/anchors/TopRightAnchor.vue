<template>
  <div class="container-anchor-top-right"
    @mousedown="() => isResizing = true"
  />

  <GlobalEvents
    v-if="isResizing"
    @mousemove="onResize"
    @mouseup="() => isResizing = false"
  />
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { GlobalEvents } from 'vue-global-events';
import { rectInjectionToken } from '../useRect';
import { createVector } from '../vector';

const { resizeRectTopRight } = inject(rectInjectionToken)!;

const isResizing = ref(false);

const onResize = (e: MouseEvent) => {
  const { clientX, clientY } = e;
  const newTopRight = createVector(clientX, clientY);

  resizeRectTopRight(newTopRight);
};
</script>

<style lang="scss">
.container-anchor-top-right {
  position: absolute;
  height: 5px;
  width: 5px;
  outline: 1px solid black;

  top: -6px;
  right: -6px;

  &:hover {
    cursor: ne-resize;
  }
}
</style>