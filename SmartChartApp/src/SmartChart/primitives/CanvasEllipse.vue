<template>
  <svg class="svg">
    <ellipse
      :cx="size.width / 2"
      :cy="size.height / 2"
      :rx="size.width / 2 - 3"
      :ry="size.height / 2 - 3"
    />
  </svg>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { Element, Ellipse } from '../elements/';

const props = defineProps({
  element: {
    type: Object as PropType<Element>,
    required: true,
  },
});

const { size } = props.element as Ellipse;
</script>

<style lang="scss">
.svg {
  width: 100%;
  height: 100%;
  fill-opacity: 0;
  stroke-opacity: 1;
  stroke-width: 3px;
  stroke: black;
}
</style>