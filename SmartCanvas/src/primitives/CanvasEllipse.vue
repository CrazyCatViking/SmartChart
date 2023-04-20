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

  <ContainerTransform
    v-show="isSelected"
    draggable="false"
  />

  <ArrowAnchors />
</template>

<script setup lang="ts">
import { PropType, computed, inject } from 'vue';
import { Ellipse } from '../elements/';
import ContainerTransform from '../Container/ContainerTransform.vue';
import { chartInjectionKey } from '../canvas/chart';
import ArrowAnchors from '../Container/arrowAnchors/ArrowAnchors.vue';

const props = defineProps({
  element: {
    type: Object as PropType<Ellipse>,
    required: true,
  },
});

const { getIsSelected } = inject(chartInjectionKey)!;
const isSelected = getIsSelected(props.element.id);

const cx = computed(() => props.element.size.value.width / 2);
const cy = computed(() => props.element.size.value.height / 2);
const rx = computed(() => props.element.size.value.width / 2 - 3);
const ry = computed(() => props.element.size.value.height / 2 - 3);

const style = computed(() => ({
  'stroke-width': props.element.strokeWidth,
}));
</script>