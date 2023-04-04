<template>
  <svg
    class="svg"
    :style="style"
  >
    <ellipse
      :cx="size.width / 2"
      :cy="size.height / 2"
      :rx="size.width / 2 - 3"
      :ry="size.height / 2 - 3"
    />
  </svg>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { Element, Ellipse } from '../elements/';

const props = defineProps({
  element: {
    type: Object as PropType<Element>,
    required: true,
  },
});

const { size, strokeWidth } = props.element as Ellipse;

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