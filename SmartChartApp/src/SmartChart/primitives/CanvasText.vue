<template>
  <pre
    class="text"
    :style="textStyle"
    @click.stop="onTextClick"
  >{{ internalElement.text }}</pre>

  <textarea
    v-if="isEditing"
    class="text-area"
    :style="textStyle"
    ref="textAreaRef"
    v-model="internalElement.text"
    @mousedown.stop
  />

  <GlobalEvents
    v-if="isEditing"
    @mousedown="onClick"
  />
</template>

<script setup lang="ts">
import { PropType, StyleValue, computed, ref } from 'vue';
import { GlobalEvents } from 'vue-global-events';
import { Element, TextElement } from '../elements';

const props = defineProps({
  element: {
    type: Object as PropType<Element>,
    required: true,
  },
});

const textAreaRef = ref();

const isEditing = ref(false);
const internalElement= ref(props.element as TextElement);

const clickPrimed = ref(false);

const textStyle = computed<StyleValue>(() => {
  const { font, fontSize, fontWeight, lineHeight } = internalElement.value;

  return {
    width: internalElement.value.size.width,
    height: internalElement.value.size.height,
    'font-family': font,
    'font-size': `${fontSize}px`,
    'font-weight': fontWeight,
    'text-align': 'center',
    'line-height': `${lineHeight}px`,
  };
});

const onTextClick = () => {
  if (!clickPrimed.value) {
    clickPrimed.value = true;

    setTimeout(() => {
      clickPrimed.value = false;
    }, 500);

    return;
  }

  isEditing.value = true;
  clickPrimed.value = false;
};

const onClick = (e: MouseEvent) => {
  if (e.target === textAreaRef.value) return;
  isEditing.value = false;
};
</script>

<style lang="scss">
.text {
  position: absolute;
  top: 0;
  left: 0;

  padding: unset;
  margin: unset;

  width: 100%;
  height: 100%;
  
  overflow: hidden;
}

.text-area {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  border: none;
  overflow: hidden;
  outline: none;
  padding: unset;
  margin: unset;

  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;

  resize: none;

  &:focus {
    outline: 1px dotted blue;
  }
}
</style>