<template>
  <div
    class="container" 
    :style="style"
    :tabindex="internalElement.position.z"
    @mousedown.stop="onSelectElement"
    @click.stop.prevent
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
import { PropType, computed, inject, ref } from 'vue';
import { GlobalEvents } from 'vue-global-events';
import { useRect } from './useRect';
import ContainerTransform from './ContainerTransform.vue';
import { chartInjectionKey } from '../chart';
import { Element } from '../elements';

const props = defineProps({
  element: {
    type: Object as PropType<Element>,
    required: true,
  },
});

const internalElement = ref(props.element);

const { selectElements: selectElement, getIsSelected } = inject(chartInjectionKey)!;
const isSelected = getIsSelected(internalElement.value.id);

const isDragging = ref(false);

const inititalPosition = ref({ x: 0, y: 0 });

const {
  rectPosition,
  rectSize,
  moveRect,
} = useRect(internalElement.value.position, internalElement.value.size);

const onSelectElement = () => {
  const id = internalElement.value.id;
  selectElement(id);
};

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

  cursor: pointer;
}

.container-content {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
}
</style>