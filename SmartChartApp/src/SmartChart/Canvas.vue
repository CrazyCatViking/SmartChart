<template>
  <div class="canvas">
    <CanvasElement
      v-for="element in elements"
      :key="element.id"
      :element="element"
    />
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import CanvasElement from './CanvasElement.vue';
import { chartInjectionKey } from './chart';
import { createImage, createEllipse } from './elements';
import { ElementPosition, ElementSize } from './types';

const { elements, addElement, removeElement } = inject(chartInjectionKey)!;

const imageUrl = "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=620&quality=85&dpr=1&s=none";

const elementPositionA: ElementPosition = { x: 0, y: 0, z: 0, rotation: 0 };
const elementSizeA: ElementSize = { width: 50, height: 50 };

const elementA = createImage(elementPositionA, elementSizeA, imageUrl);

const elementPositionB: ElementPosition = { x: 300, y: 300, z: 0, rotation: 0 };
const elementSizeB: ElementSize = { width: 50, height: 50 };

const elementB = createImage(elementPositionB, elementSizeB, imageUrl);

const elementPositionC: ElementPosition = { x: 500, y: 500, z: 0, rotation: 0 };
const elementSizeC: ElementSize = { width: 50, height: 50 };

const elementC = createEllipse(elementPositionC, elementSizeC);

addElement(elementA);
addElement(elementB);
addElement(elementC);
</script>

<style lang="scss">
.canvas {
  position: absolute;
  top: 0;
  left: 0;

  height: 100%;
  width: 100%;
}
</style>