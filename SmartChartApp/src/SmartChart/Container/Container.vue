<template>
  <div
    class="container" 
    :style="style"
    :tabindex="element.position.value.z"
    draggable="false"
    @mousedown.stop="onSelectElement"
    @click.stop.prevent
  >
    <ContainerTransform
      v-show="isSelected"
      draggable="false"
    />

    <div
      class="container-content"
      draggable="false"
      @mousedown="onDragStart"
    >
      <slot :containerSize="element.size" :containerPosition="element.position"></slot>
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

const { selectElements: selectElement, getIsSelected, commitChanges } = inject(chartInjectionKey)!;
const isSelected = getIsSelected(props.element.id);

const isDragging = ref(false);

const inititalPosition = ref({ x: 0, y: 0 });

const { moveRect } = useRect(props.element);

const onSelectElement = () => {
  const id = props.element.id;
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

  commitChanges();
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

const style = computed(() => {
  const { x, y, rotation } = props.element.position.value;
  const { width, height } = props.element.size.value;

  return {
    transform: `translate(${x}px, ${y}px) rotate(${rotation}rad)`,
    width: `${width}px`,
    height: `${height}px`,
  }
});
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