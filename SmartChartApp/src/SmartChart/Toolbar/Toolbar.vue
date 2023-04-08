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
import { Vector, createVector } from '../utility/vector';

const imageUrl = "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=620&quality=85&dpr=1&s=none";

const { addElement, convertToImage, selectElements: selectElement, commitChanges } = inject(chartInjectionKey)!;
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

const anchorPosition = ref<Vector>();
let element: Element | undefined;

const onMouseDown = (e: MouseEvent) => {
  const { clientX, clientY } = e;

  anchorPosition.value = createVector(clientX, clientY);

  const position: ElementPosition = { x: clientX, y: clientY, z: 0, rotation: 0 };
  const size: ElementSize = { height: 0, width: 0 };

  if (isCreatingEllipse.value) {
    const ellipse = createEllipse({ position, size });

    element = ellipse;
    addElement(element);
  } else if (isCreatingRectangle.value) {
    const rectangle = createRect({ position, size });

    element = rectangle;
    addElement(element);
  } else if (isCreatingText.value) {
    const text = createText({ position, size, text: 'ipsum lorum' });

    element = text;
    addElement(element);
  } else if (isCreatingImage.value) {
    const image = createImage({ position, size, url: imageUrl });

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

  const mousePosition = createVector(clientX, clientY);

  element.resize(mousePosition, anchorPosition.value!);
};

const onMouseUp = (e: MouseEvent) => {
  isCreatingEllipse.value = false;
  isCreatingRectangle.value = false;
  isCreatingText.value = false;
  isCreatingImage.value = false;

  element = undefined;

  endAddElement();
  commitChanges();
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