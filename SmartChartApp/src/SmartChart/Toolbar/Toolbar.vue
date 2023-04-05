<template>
  <div class="toolbar">
    <button
      class="toolbar-button"
      @click="onClickEllipse"
    >
      <span>{{ '+ Ellipse' }}</span>
    </button>

    <button
      class="toolbar-button"
      @click="onClickRectangle"
    >
      <span>{{ '+ Rectangle' }}</span>
    </button>

    <button
      class="toolbar-button"
      @click="onClickText"
    >
      <span>{{ '+ Text' }}</span>
    </button>

    <button
      class="toolbar-button"
      @click="onClickImage"
    >
      <span>{{ '+ Image' }}</span>
    </button>

    <button
      class="toolbar-button"
      @click="convertToImage"
    >
      <span>{{ 'Download' }}</span>
    </button>
  </div>

  <GlobalEvents
    v-if="isCreatingEllipse || isCreatingRectangle || isCreatingText || isCreatingImage"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
  />
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import { GlobalEvents } from 'vue-global-events';
import { chartInjectionKey } from '../chart';
import { Element, createEllipse, createImage, createRect, createText } from '../elements';
import { ElementPosition, ElementSize } from '../types';
import { canvasStateInjectionKey } from '../canvasState';

const imageUrl = "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=620&quality=85&dpr=1&s=none";

const { addElement, convertToImage, selectElements: selectElement } = inject(chartInjectionKey)!;
const { startAddElement, endAddElement } = inject(canvasStateInjectionKey)!;

const isCreatingEllipse = ref(false);
const isCreatingRectangle = ref(false);
const isCreatingText = ref(false);
const isCreatingImage = ref(false);

const onClickEllipse = () => {
  isCreatingEllipse.value = true
  startAddElement();
}

const onClickRectangle = () => {
  isCreatingRectangle.value = true
  startAddElement();
}

const onClickText = () => {
  isCreatingText.value = true
  startAddElement();
}

const onClickImage = () => {
  isCreatingImage.value = true
  startAddElement();
}

const initialPosition = ref({ x: 0, y: 0 });
let element: Element | undefined;

const onMouseDown = (e: MouseEvent) => {
  const { clientX, clientY } = e;

  initialPosition.value.x = clientX;
  initialPosition.value.y = clientY;

  const position: ElementPosition = { x: clientX, y: clientY, z: 0, rotation: 0 };
  const size: ElementSize = { height: 0, width: 0 };

  if (isCreatingEllipse.value) {
    const ellipse = createEllipse(position, size);

    element = ellipse;
    addElement(element);
  } else if (isCreatingRectangle.value) {
    const rectangle = createRect(position, size);

    element = rectangle;
    addElement(element);
  } else if (isCreatingText.value) {
    const text = createText(position, size, 'ipsum lorum');

    element = text;
    addElement(element);
  } else if (isCreatingImage.value) {
    const image = createImage(position, size, imageUrl);

    element = image;
    addElement(element);
  }

  if (element != null) {
    selectElement(element?.id);
  }
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
  isCreatingEllipse.value = false;
  isCreatingRectangle.value = false;
  isCreatingText.value = false;
  isCreatingImage.value = false;

  element = undefined;

  endAddElement();
};
</script>

<style lang="scss">
.toolbar {
  position: absolute;
  gap: 1rem;
  bottom: 10px;
  left: 50%;

  padding-left: 0.5rem;
  padding-right: 0.5rem;

  display: flex;
  justify-content: space-between;

  transform: translate(-50%);

  height: 2rem;
  min-width: 20rem;

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