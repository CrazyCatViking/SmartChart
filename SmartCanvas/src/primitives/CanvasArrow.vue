<template>
  <svg
    class="svg"
    :style="style"
  >
    <line 
      v-for="line in lines"
      :x1="line.origin.x"
      :y1="line.origin.y"
      :x2="line.target.x"
      :y2="line.target.y"

      style="position: static"
    />
  </svg>
</template>

<script setup lang="ts">import { PropType, computed } from 'vue';
import { ArrowElement } from '../elements';

const props = defineProps({
  element: {
    type: Object as PropType<ArrowElement>,
    required: true,
  },
});

const lines = props.element.lines;

const style = computed(() => ({
  'stroke-width': props.element.strokeWidth,
}));
</script>