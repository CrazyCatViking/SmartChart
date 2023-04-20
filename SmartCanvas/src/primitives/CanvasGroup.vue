<template>
  <ContainerTransform
    v-show="isSelected"
    draggable="false"
  />
</template>

<script setup lang="ts">
import { PropType, inject } from 'vue';
import { ElementGroup } from '../elements/';
import ContainerTransform from '../Container/ContainerTransform.vue';
import { chartInjectionKey } from '../canvas/chart';

const props = defineProps({
  element: {
    type: Object as PropType<ElementGroup>,
    required: true,
  },
});

const { getIsSelected } = inject(chartInjectionKey)!;
const isSelected = getIsSelected(props.element.id);
</script>