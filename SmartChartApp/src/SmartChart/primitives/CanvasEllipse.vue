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
import { PropType, Ref, computed, ref } from 'vue';
import { Element, Ellipse } from '../elements/';

const props = defineProps({
  element: {
    type: Object as PropType<Element>,
    required: true,
  },
});

const internalElement = ref(props.element as Ellipse);

const cx = computed(() => internalElement.value.size.width / 2);
const cy = computed(() => internalElement.value.size.height / 2);
const rx = computed(() => internalElement.value.size.width / 2 - 3);
const ry = computed(() => internalElement.value.size.height / 2 - 3);

const style = computed(() => ({
  'stroke-width': internalElement.value.strokeWidth,
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