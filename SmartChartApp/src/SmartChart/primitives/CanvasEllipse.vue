<template>
  <svg
    class="svg"
    :style="style"
  >
    <ellipse
      :cx="cx"
      :cy="cy"
      :rx="rx >= 0 ? rx : 0"
      :ry="ry >= 0 ? ry : 0"
    />
  </svg>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { Ellipse } from '../elements/';

const props = defineProps({
  element: {
    type: Object as PropType<Ellipse>,
    required: true,
  },
});

const cx = computed(() => props.element.size.value.width / 2);
const cy = computed(() => props.element.size.value.height / 2);
const rx = computed(() => props.element.size.value.width / 2 - 3);
const ry = computed(() => props.element.size.value.height / 2 - 3);

const style = computed(() => ({
  'stroke-width': props.element.strokeWidth,
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