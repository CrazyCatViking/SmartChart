<template>
  <div class="canvas">
    <Container 
      v-slot="{ containerSize }"
      :element-position="elementPositionA"
      :element-size="elementSizeA"
    >
      <img
        src="https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=620&quality=85&dpr=1&s=none"
        :height="containerSize.height"
        :width="containerSize.width"
        draggable="false"
      />
    </Container>

    <Container 
      v-slot="{ containerSize }"
      :element-position="elementPositionB"
      :element-size="elementSizeB"
    >
      <img
        src="https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=620&quality=85&dpr=1&s=none"
        :height="containerSize.height"
        :width="containerSize.width"
        draggable="false"
      />
    </Container>

    <Container 
      v-slot="{ containerSize }"
      :element-position="elementPositionC"
      :element-size="elementSizeC"
    >
      <svg class="svg">
        <ellipse
          :cx="containerSize.width / 2"
          :cy="containerSize.height / 2"
          :rx="containerSize.width / 2 - 3"
          :ry="containerSize.height / 2 - 3"
        />
      </svg>
    </Container>
  </div>
</template>

<script setup lang="ts">
import Container from './Container/Container.vue';
import { ElementPosition, ElementSize } from './types';

const elementPositionA: ElementPosition = { x: 0, y: 0, rotation: 0 };
const elementSizeA: ElementSize = { width: 50, height: 50 };

const elementPositionB: ElementPosition = { x: 300, y: 300, rotation: 0 };
const elementSizeB: ElementSize = { width: 50, height: 50 };

const elementPositionC: ElementPosition = { x: 500, y: 500, rotation: 0 };
const elementSizeC: ElementSize = { width: 50, height: 50 };
</script>

<style lang="scss">
.canvas {
  position: absolute;
  top: 0;
  left: 0;

  height: 100%;
  width: 100%;
}

.svg {
  width: 100%;
  height: 100%;
  fill-opacity: 0;
  stroke-opacity: 1;
  stroke-width: 3px;
  stroke: black;
}
</style>