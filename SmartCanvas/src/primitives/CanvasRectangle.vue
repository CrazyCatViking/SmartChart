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

  <ContainerTransform
    v-show="isSelected"
    draggable="false"
  />

  <ArrowAnchors />
</template>

<script setup lang="ts">
import { PropType, computed, inject } from 'vue';
import { Rectangle } from '../elements/';
import ContainerTransform from '../Container/ContainerTransform.vue';
import { chartInjectionKey } from '../canvas/chart';
import ArrowAnchors from '../Container/arrowAnchors/ArrowAnchors.vue';

const props = defineProps({
  element: {
    type: Object as PropType<Rectangle>,
    required: true,
  },
});

const { getIsSelected } = inject(chartInjectionKey)!;
const isSelected = getIsSelected(props.element.id);

const style = computed(() => ({
  'stroke-width': props.element.strokeWidth,
}));
</script>