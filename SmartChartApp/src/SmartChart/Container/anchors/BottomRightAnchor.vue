<template>
  <div class="container-anchor-bottom-right"
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
import { Vector, createVector } from '../vector';

const { resizeRect, rectVertices } = inject(rectInjectionToken)!;

const isResizing = ref(false);
const initialPosition = ref<Vector>()

const onResizeStart = () => {
  isResizing.value = true
  initialPosition.value = rectVertices.value.a;
};

const onResizeEnd = () => {
  isResizing.value = false
  initialPosition.value = undefined;
};

const onResize = (e: MouseEvent) => {
  const { clientX, clientY } = e;
  const mousePosition = createVector(clientX, clientY);

  resizeRect(mousePosition, initialPosition.value!);
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