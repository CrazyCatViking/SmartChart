<template>
  <svg
    class="svg"
    :style="style"
  >
    <rect
      :width="size.width"
      :height="size.height"
    />
  </svg>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { Element, Rectangle } from '../elements/';

const props = defineProps({
  element: {
    type: Object as PropType<Element>,
    required: true,
  },
});

const { size, strokeWidth } = props.element as Rectangle;

const style = computed(() => ({
  'stroke-width': strokeWidth,
}));
</script>

<style lang="scss">
.svg {
  width: 100%;
  height: 100%;
  fill-opacity: 0;
  stroke-opacity: 1;
  stroke: black;
}
</style>