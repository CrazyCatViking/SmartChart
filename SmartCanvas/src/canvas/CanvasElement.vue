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
import Container from '../Container/Container.vue';
import { Element } from '../elements/element';
import { usePrimitiveFactory } from './primitiveFactory';

const props = defineProps({
  element: {
    type: Object as PropType<Element>,
    required: true,
  },
});

const { createPrimitive } = usePrimitiveFactory();

const component = computed(() => {
  if (!props.element.type) return undefined;
  return createPrimitive(props.element.type);
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