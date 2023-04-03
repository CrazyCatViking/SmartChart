<template>
  <img
    :src="url"
    :height="size.height"
    :width="size.width"
    draggable="false"
  />
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { Element, Image } from '../element';

const props = defineProps({
  element: {
    type: Object as PropType<Element>,
    required: true,
  },
});

const { size, url } = props.element as Image;
</script>