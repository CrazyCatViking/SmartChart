<template>
  <Container
    :element-position="position"
    :element-size="size"
  >
    <component
      :is="component"
      :element="element"
    />
  </Container>  
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import Container from './Container/Container.vue';
import Ellipse from './primitives/CanvasEllipse.vue';
import Rectangle from './primitives/CanvasRectangle.vue';
import Image from './primitives/CanvasImage.vue';
import TextElement from './primitives/CanvasText.vue';
import { Element } from './elements/element';

const props = defineProps({
  element: {
    type: Object as PropType<Element>,
    required: true,
  },
});

const { position, size } = props.element;

const component = computed(() => {
  switch(props.element.type) {
    case 'Rectangle':
      return Rectangle;
    case 'Ellipse':
      return Ellipse;
    case 'Image':
      return Image;
    case 'Text':
      return TextElement;
  }
});
</script>