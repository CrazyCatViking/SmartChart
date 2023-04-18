<template>
  <svg
    class="svg"
    :style="style"
  >
    <rect
      :width="element.size.value.width"
      :height="element.size.value.height"
    />
  </svg>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { Element, Rectangle } from '../elements/';

const props = defineProps({
  element: {
    type: Object as PropType<Rectangle>,
    required: true,
  },
});

const style = computed(() => ({
  'stroke-width': props.element.strokeWidth,
}));
</script>