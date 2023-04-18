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
      v-show="showConnectButton"
      class="toolbar-button"
      @click="onClickConnectSelected"
    >
      <span>{{ '+ Connect' }}</span>
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
import { computed, inject, ref } from 'vue';
import { GlobalEvents } from 'vue-global-events';
import { chartInjectionKey } from '@crazycatviking/smartcanvas';
import { Element, createConnector, createEllipse, createImage, createRect, createText } from '@crazycatviking/smartcanvas';
import { ElementPosition, ElementSize } from '@crazycatviking/smartcanvas';
import { canvasStateInjectionKey } from '@crazycatviking/smartcanvas';
import { Vector, createVector } from '@crazycatviking/smartcanvas';

const imageUrl = "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=620&quality=85&dpr=1&s=none";

const {
  addElements,
  convertToImage,
  selectElements: selectElement,
  commitChanges,
  selectedElements,
  elements,
} = inject(chartInjectionKey)!;

const { startAddElement, endAddElement } = inject(canvasStateInjectionKey)!;

const isCreatingEllipse = ref(false);
const isCreatingRectangle = ref(false);
const isCreatingText = ref(false);
const isCreatingImage = ref(false);

const onClickEllipse = () => {
  isCreatingEllipse.value = true
  startAddElement();
};

const onClickRectangle = () => {
  isCreatingRectangle.value = true
  startAddElement();
};

const onClickText = () => {
  isCreatingText.value = true
  startAddElement();
};

const onClickImage = () => {
  isCreatingImage.value = true
  startAddElement();
};

const onClickConnectSelected = () => {
  const elementIds = selectedElements.value;
  const els = elements.value.filter((el) => elementIds.includes(el.id));

  if (elementIds.length !== 2) return;

  const connector = createConnector({
    position: { x: 0, y: 0, z: 0, rotation: 0 },
    size: { width: 0, height: 0 },
    originElement: els[0],
    targetElement: els[1],
  });

  addElements(connector);
  commitChanges();
};

const showConnectButton = computed(() => selectedElements.value.length === 2);

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
    addElements(element);
  } else if (isCreatingRectangle.value) {
    const rectangle = createRect({ position, size });

    element = rectangle;
    addElements(element);
  } else if (isCreatingText.value) {
    const text = createText({ position, size, text: 'ipsum lorum' });

    element = text;
    addElements(element);
  } else if (isCreatingImage.value) {
    const image = createImage({ position, size, url: imageUrl });

    element = image;
    addElements(element);
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