<template>
  <Container :element="element">
    <component
      v-if="element !== undefined"
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
import Connector from './primitives/CanvasConnector.vue';
import { Element } from './elements/element';

const props = defineProps({
  element: {
    type: Object as PropType<Element>,
    required: true,
  },
});

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
    case 'Connector':
      return Connector;
    default:
      return undefined;
  }
});
</script>

<style lang="scss">
.svg {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  fill-opacity: 0;
  stroke-opacity: 1;
  stroke: black;
}
</style>