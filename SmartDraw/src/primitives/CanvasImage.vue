<template>
  <img
    :src="element.url"
    :height="element.size.value.height"
    :width="element.size.value.width"
    draggable="false"
  />
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { Image } from '../elements';

const props = defineProps({
  element: {
    type: Object as PropType<Image>,
    required: true,
  },
});
</script>