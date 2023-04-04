<template>
  <div
    class="container" 
    :style="style"
    :tabindex="elementPosition.z"
    @focus="() => isSelected = true"
    @blur="() => isSelected = false"
  >
    <ContainerTransform v-show="isSelected" />

    <div
      class="container-content"
      draggable="false"
      @mousedown="onDragStart"
    >
      <slot :containerSize="rectSize" :containerPosition="rectPosition"></slot>
    </div>
  </div>

  <GlobalEvents
    v-if="isDragging"
    @mousemove="onDrag"
    @mouseup="onDragEnd"
  />
</template>

<script setup lang="ts">
import { PropType, computed, ref } from 'vue';
import { GlobalEvents } from 'vue-global-events';
import { ElementPosition, ElementSize } from '../types';
import { useRect } from './useRect';
import ContainerTransform from './ContainerTransform.vue';

const props = defineProps({
  elementPosition: {
    type: Object as PropType<ElementPosition>,
    required: true,
  },
  elementSize: {
    type: Object as PropType<ElementSize>,
    required: true,
  },
});

const isSelected = ref(false);

const isDragging = ref(false);

const inititalPosition = ref({ x: 0, y: 0 });

const {
  rectPosition,
  rectSize,
  moveRect,
} = useRect(props.elementPosition, props.elementSize);

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

  moveRect(deltaX, deltaY);
};

const style = computed(() => ({
  transform: `translate(${rectPosition.value.x}px, ${rectPosition.value.y}px) rotate(${rectPosition.value.rotation}rad)`,
  width: `${rectSize.value.width}px`,
  height: `${rectSize.value.height}px`,
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

.container-content {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
}
</style>