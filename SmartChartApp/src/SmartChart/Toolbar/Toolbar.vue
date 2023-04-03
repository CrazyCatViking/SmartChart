<template>
  <div class="toolbar">
    <button
      class="toolbar-button"
      @click="() => isCreatingElement = true"
    >
      <span>{{ '+' }}</span>
    </button>
    <button
      class="toolbar-button"
      @click="convertToImage"
    >
      <span>{{ 'Download' }}</span>
    </button>
  </div>

  <GlobalEvents
    v-if="isCreatingElement"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
  />
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import { GlobalEvents } from 'vue-global-events';
import { chartInjectionKey } from '../chart';
import { Element, createEllipse } from '../elements';
import { ElementPosition, ElementSize } from '../types';

const { addElement, convertToImage } = inject(chartInjectionKey)!;

const isCreatingElement = ref(false);
const initialPosition = ref({ x: 0, y: 0 });
let element: Element | undefined;

const onMouseDown = (e: MouseEvent) => {
  const { clientX, clientY } = e;

  initialPosition.value.x = clientX;
  initialPosition.value.y = clientY;

  const position: ElementPosition = { x: clientX, y: clientY, z: 0, rotation: 0 };
  const size: ElementSize = { height: 0, width: 0 };

  const ellipse = createEllipse(position, size);

  element = ellipse;
  addElement(element);
};

const onMouseMove = (e: MouseEvent) => {
  if (!element) return;

  const { clientX, clientY } = e;
  const { x, y } = initialPosition.value;

  const width = Math.abs(clientX - x);
  const height = Math.abs(clientY - y);

  const newX = x < clientX ? x : clientX;
  const newY = y < clientY ? y : clientY;

  element.position.value.x = newX;
  element.position.value.y = newY;
  element.size.value.width = width;
  element.size.value.height = height;
};

const onMouseUp = (e: MouseEvent) => {
  isCreatingElement.value = false;
  element = undefined;
};
</script>

<style lang="scss">
.toolbar {
  position: absolute;
  bottom: 10px;
  left: 50%;

  padding-left: 0.5rem;
  padding-right: 0.5rem;

  display: flex;
  justify-content: space-between;

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

  &:focus {
    outline: none;
  }
}
</style>