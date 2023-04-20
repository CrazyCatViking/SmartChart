<template>
  <ContainerTransform
    v-show="isSelected"
    draggable="false"
  />

  <ArrowAnchors />

  <pre
    class="text"
    :style="textStyle"
    @click.stop="onTextClick"
  >{{ element.text.value }}</pre>

  <textarea
    v-if="isEditing"
    class="text-area"
    :style="textStyle"
    ref="textAreaRef"
    v-model="element.text.value"
    @mousedown.stop
    @keydown.ctrl.c.exact.stop
    @keydown.ctrl.v.exact.stop
    @keydown.ctrl.x.exact.stop
  />

  <GlobalEvents
    v-if="isEditing"
    @mousedown="onClick"
  />
</template>

<script setup lang="ts">
import { PropType, StyleValue, computed, inject, ref } from 'vue';
import { GlobalEvents } from 'vue-global-events';
import { TextElement } from '../elements';
import ContainerTransform from '../Container/ContainerTransform.vue';
import { chartInjectionKey } from '../canvas/chart';
import ArrowAnchors from '../Container/arrowAnchors/ArrowAnchors.vue';

const props = defineProps({
  element: {
    type: Object as PropType<TextElement>,
    required: true,
  },
});

const { getIsSelected } = inject(chartInjectionKey)!;
const isSelected = getIsSelected(props.element.id);

const textAreaRef = ref();

const isEditing = ref(false);

const clickPrimed = ref(false);

const textStyle = computed<StyleValue>(() => {
  const {
    font,
    fontSize,
    fontWeight,
    lineHeight,
  } = props.element;

  return {
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
  pointer-events: all;
  position: absolute;
  top: 0;
  left: 0;

  padding: unset;
  margin: unset;

  color: black;

  width: 100%;
  height: 100%;
  
  overflow: hidden;
}

.text-area {
  pointer-events: all;
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

  color: black;
  white-space: nowrap;
  background-color: transparent;

  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;

  resize: none;

  &:focus {
    outline: 1px dotted blue;
  }
}
</style>