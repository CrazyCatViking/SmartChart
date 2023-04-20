<template>
  <div class="container-arrow-anchor__right"
  @click.stop.prevent
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
  />

  <GlobalEvents
    v-if="isOrigin"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
  />
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import { GlobalEvents } from 'vue-global-events';
import { rectInjectionToken } from '../../useRect';
import { createVector } from '../../../utility/vector';
import { useCanvasCoordinates } from '../../../canvas/useCanvasCoordinates';
import { useCanvasArrows } from '../../../canvas/useCanvasArrows';
import { Anchor } from '../../../elements';

const {
  startDrawingArrow,
  setTargetAnchor,
  endDrawingArrow,
} = useCanvasArrows();

const { getCanvasCoordinates } = useCanvasCoordinates();

const { element } = inject(rectInjectionToken)!;

const isOrigin = ref(false);

const onMouseDown = (e: MouseEvent) => {
  const { clientX, clientY } = e;

  const mousePos = createVector(clientX, clientY);
  const mouseCanvasPos = getCanvasCoordinates(mousePos);

  isOrigin.value = true;

  const targetAnchor: Anchor = {
    anchorCoordinates: mouseCanvasPos,
  };

  const originAnchor: Anchor = {
    element,
    anchorPoint: 'Right',
    anchorCoordinates: createVector(0, 0),
  };

  startDrawingArrow(originAnchor, targetAnchor);
};

const onMouseMove = (e: MouseEvent) => {
  const targetAnchor = getTargetFromMouse(e);
  setTargetAnchor(targetAnchor);
}

const onMouseUp = (e: MouseEvent) => {
  const targetAnchor: Anchor = !isOrigin.value ? {
    element,
    anchorPoint: 'Right',
    anchorCoordinates: createVector(0, 0),
  } : getTargetFromMouse(e)

  setTargetAnchor(targetAnchor);
  endDrawingArrow();

  isOrigin.value = false;
}

const getTargetFromMouse = (e: MouseEvent) => {
  const { clientX, clientY } = e;

  const mousePos = createVector(clientX, clientY);
  const mouseCanvasPos = getCanvasCoordinates(mousePos);

  const targetAnchor: Anchor = {
    anchorCoordinates: mouseCanvasPos,
  };

  return targetAnchor;
}
</script>

<style lang="scss">
.container-arrow-anchor__right {
  position: absolute;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  outline: 2px solid black;

  right: -10px;
  top: 50%;
  transform: translate(0, -50%);

  &:hover {
    cursor: pointer;
    background-color: rgba($color: #000000, $alpha: 0.2);
  }
}
</style>