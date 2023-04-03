<template>
  <div class="toolbar">
    <button
      class="toolbar-button"
      @click="onClick"
    >
      <span>{{ '+' }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { chartInjectionKey } from '../chart';
import { createEllipse } from '../element';
import { ElementPosition, ElementSize } from '../types';

const { addElement } = inject(chartInjectionKey)!;

const onClick = () => {
  const elementPositionC: ElementPosition = { x: 500, y: 500, z: 0, rotation: 0 };
  const elementSizeC: ElementSize = { width: 50, height: 50 };

  const elementC = createEllipse(elementPositionC, elementSizeC);
  addElement(elementC);
}
</script>

<style lang="scss">
.toolbar {
  position: absolute;
  bottom: 10px;
  left: 50%;

  padding-left: 0.5rem;

  display: flex;

  transform: translate(-50%);

  height: 2rem;
  width: 20rem;

  background-color: orange;

  z-index: 3000;
}

.toolbar-button {
  display: flex;
  height: 2rem;
  align-items: center;

  background: none;
  outline: none;
  border: none;
  padding: 0;
}
</style>