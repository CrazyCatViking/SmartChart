<template>
  <div class="container-anchor-top-right"
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

const { resizeRect, rectVertices } = inject(rectInjectionToken)!;
const { commitChanges } = inject(chartInjectionKey)!;

const isResizing = ref(false);
const initialPosition = ref<Vector>()

const onResizeStart = () => {
  isResizing.value = true
  initialPosition.value = rectVertices.value.d;
};

const onResizeEnd = () => {
  isResizing.value = false
  initialPosition.value = undefined;

  commitChanges();
};

const onResize = (e: MouseEvent) => {
  const { clientX, clientY } = e;
  const mousePosition = createVector(clientX, clientY);

  resizeRect(mousePosition, initialPosition.value!);
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