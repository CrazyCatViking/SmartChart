<template>
  <img
    :src="element.url"
    :height="element.size.value.height"
    :width="element.size.value.width"
    draggable="false"
  />

  <ContainerTransform
    v-show="isSelected"
    draggable="false"
  />

  <ArrowAnchors />
</template>

<script setup lang="ts">
import { PropType, inject } from 'vue';
import { Image } from '../elements';
import ContainerTransform from '../Container/ContainerTransform.vue';
import { chartInjectionKey } from '../canvas/chart';
import ArrowAnchors from '../Container/arrowAnchors/ArrowAnchors.vue';

const props = defineProps({
  element: {
    type: Object as PropType<Image>,
    required: true,
  },
});

const { getIsSelected } = inject(chartInjectionKey)!;
const isSelected = getIsSelected(props.element.id);
</script>