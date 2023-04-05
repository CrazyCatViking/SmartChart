<template>
  <div class="container-anchor-top-left"
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

const { resizeRectTopLeft } = inject(rectInjectionToken)!;

const isResizing = ref(false);

const onResize = (e: MouseEvent) => {
  const { clientX, clientY } = e;
  const newTopLeft = createVector(clientX, clientY);

  resizeRectTopLeft(newTopLeft);
};
</script>

<style lang="scss">
.container-anchor-top-left {
  position: absolute;
  height: 5px;
  width: 5px;
  outline: 1px solid black;

  top: -6px;
  left: -6px;

  &:hover {
    cursor: nw-resize;
  }
}
</style>