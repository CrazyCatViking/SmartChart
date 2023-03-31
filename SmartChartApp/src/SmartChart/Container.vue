<template>
  <div
    class="container"
    :style="style"
    tabindex="0"
    @focus="() => isSelected = true"
    @blur="() => isSelected = false"
  >
    <div class="container-transform"
      v-show="isSelected"
    >
      <div class="container-rotate"
        @mousedown="onRotateStart"
      />
      <div class="container-anchor-top-left"
        @mousedown="onResizeTopLeftStart"
      />
      <div class="container-anchor-top-right"
        @mousedown="onResizeTopRightStart"
      />
      <div class="container-anchor-bottom-left" />
      <div class="container-anchor-bottom-right" />
    </div>

    <div
      class="container-svg"
      @mousedown="onDragStart"
    >
      <svg class="svg">
        <rect
          :width="`${elementSize.width}px`"
          :height="`${elementSize.height}px`"
          class="rect"></rect>
      </svg>
    </div>
  </div>

  <GlobalEvents
    v-if="isDragging"
    @mousemove="onDrag"
    @mouseup="onDragEnd"
  />

  <GlobalEvents
    v-if="isRotating"
    @mousemove="onRotate"
    @mouseup="onRotateEnd"
  />

  <GlobalEvents
    v-if="isTransformingTopLeft"
    @mousemove="onResizeTopLeft"
    @mouseup="onResizeTopLeftEnd"
  />

  <GlobalEvents
    v-if="isTransformingTopRight"
    @mousemove="onResizeTopRight"
    @mouseup="onResizeTopRightEnd"
  />
</template>

<script setup lang="ts">
import { computed, Ref, ref } from 'vue';
import { GlobalEvents } from 'vue-global-events';
import { ElementPosition, ElementSize } from './types';
import { useRect } from './useRect';

const isSelected = ref(false);

const isDragging = ref(false);
const isRotating = ref(false);
const isTransformingTopLeft = ref(false);
const isTransformingTopRight = ref(false);
const isTransformingBottomLeft = ref(false);
const isTransformingBottomRight = ref(false);

const inititalPosition = ref({ x: 0, y: 0 });

const elementPosition = ref<ElementPosition>({ x: 0, y: 0, rotation: 0 });
const elementSize = ref<ElementSize>({ width: 50, height: 50 });

const onDragStart = (e: MouseEvent) => {
  isDragging.value = true;

  inititalPosition.value = {
    x: e.clientX,
    y: e.clientY,
  };
};

const onDragEnd = (e: MouseEvent) => {
  isDragging.value = false;

  inititalPosition.value = {
    x: 0,
    y: 0,
  };
};

const onDrag = (e: MouseEvent) => {
  const deltaX = e.clientX - inititalPosition.value.x;
  const deltaY = e.clientY - inititalPosition.value.y;

  inititalPosition.value = {
    x: e.clientX,
    y: e.clientY, 
  };

  elementPosition.value.x += deltaX;
  elementPosition.value.y += deltaY;
};

const onRotateStart = (e: MouseEvent) => {
  isRotating.value = true;

  inititalPosition.value = {
    x: e.clientX,
    y: e.clientY,
  };
};

const onRotateEnd = (e: MouseEvent) => {
  isRotating.value = false;

  inititalPosition.value = {
    x: 0,
    y: 0,
  };
};

const onRotate = (e: MouseEvent) => {
  const boxCenter = {
    x: elementPosition.value.x + elementSize.value.width / 2,
    y: elementPosition.value.y + elementSize.value.height / 2,
  };

  const rotation = Math.atan2(e.pageX - boxCenter.x, - (e.pageY - boxCenter.y));

  elementPosition.value.rotation = rotation;
};

const onResizeTopLeftStart = (e: MouseEvent) => {
  isTransformingTopLeft.value = true;

  inititalPosition.value = {
    x: e.clientX,
    y: e.clientY, 
  };
};

const onResizeTopLeftEnd = (e: MouseEvent) => {
  isTransformingTopLeft.value = false;

  inititalPosition.value = {
    x: 0,
    y: 0,
  };
};

const onResizeTopRightStart = (e: MouseEvent) => {
  isTransformingTopRight.value = true;

  inititalPosition.value = {
    x: e.clientX,
    y: e.clientY, 
  };
};

const onResizeTopRightEnd = (e: MouseEvent) => {
  isTransformingTopRight.value = false;

  inititalPosition.value = {
    x: 0,
    y: 0,
  };
};

const onResizeTopLeft = (e: MouseEvent) => {
  const { clientX, clientY } = e;
  
  const { updateElement, setX1, setY1 } = useRect(elementPosition, elementSize);
  setX1(clientX);
  setY1(clientY);

  updateElement();
};

const onResizeTopRight = (e: MouseEvent) => {
  const { clientX, clientY } = e;
  
  const { updateElement, setX2, setY1 } = useRect(elementPosition, elementSize);
  setX2(clientX);
  setY1(clientY);

  updateElement();
};

const style = computed(() => ({
  transform: `translate(${elementPosition.value.x}px, ${elementPosition.value.y}px) rotate(${elementPosition.value.rotation}rad)`,
  width: `${elementSize.value.width}px`,
  height: `${elementSize.value.height}px`,
}));
</script>

<style lang="scss">
.container {
  position: absolute;
  top: 0;
  left: 0;

  &:focus {
    outline: 1px dotted blue;
  }
}

.container-svg {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
}

.container-transform {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
}

.container-rotate {
  position: absolute;
  height: 5px;
  width: 5px;
  border-radius: 50%;
  outline: 1px solid blue;

  top: -10px;
  left: 50%;
  transform: translate(-50%);

  &:hover {
    cursor: grab;
  }
}

.container-anchor-top-left {
  position: absolute;
  height: 5px;
  width: 5px;
  outline: 1px solid black;

  top: -6px;
  left: -6px;

  &:hover {
    cursor: nw-resize;
  }
}

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

.container-anchor-bottom-left {
  position: absolute;
  height: 5px;
  width: 5px;
  outline: 1px solid black;

  bottom: -6px;
  left: -6px;

  &:hover {
    cursor: sw-resize;
  }
}

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

.svg {
  width: 100%;
  height: 100%;
  fill-opacity: 0;
  stroke-opacity: 1;
  stroke-width: 3px;
  stroke: black;
}
</style>