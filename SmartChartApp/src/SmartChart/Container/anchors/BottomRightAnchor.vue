<template>
  <div class="container-anchor-bottom-right"
    @mousedown.stop="() => isResizing = true"
    @click.stop
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

const { resizeRectBottomRight } = inject(rectInjectionToken)!;

const isResizing = ref(false);

const onResize = (e: MouseEvent) => {
  const { clientX, clientY } = e;
  const newBottomRight = createVector(clientX, clientY);

  resizeRectBottomRight(newBottomRight);
};
</script>

<style lang="scss">
.container-anchor-bottom-right {
  position: absolute;
  height: 5px;
  width: 5px;
  outline: 1px solid black;

  bottom: -6px;
  right: -6px;

  &:hover {
    cursor: se-resize;
  }
}
</style>