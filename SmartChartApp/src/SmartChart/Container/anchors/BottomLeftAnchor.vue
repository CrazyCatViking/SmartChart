<template>
  <div class="container-anchor-bottom-left"
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

const { resizeRectBottomLeft } = inject(rectInjectionToken)!;

const isResizing = ref(false);

const onResize = (e: MouseEvent) => {
  const { clientX, clientY } = e;
  const newBottomLeft = createVector(clientX, clientY);

  resizeRectBottomLeft(newBottomLeft);
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