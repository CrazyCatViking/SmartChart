<template>
  <div class="container-arrow-anchor__left"
    @click.stop.prevent
    @mousedown.stop="onMouseDown"
    @mouseup.stop="onMouseUp"
  />

  <GlobalEvents
    v-if="isOrigin"
    @mousemove="onMouseMove"
    @mouseup.stop="onMouseUp"
  />
</template>

<script setup lang="ts">
import { GlobalEvents } from 'vue-global-events';
import { useDrawArrow } from './useDrawArrow';

const {
  onMouseDown,
  onMouseMove,
  onMouseUp,
  isOrigin,
} = useDrawArrow('Left');
</script>

<style lang="scss">
.container-arrow-anchor__left {
  position: absolute;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  outline: 2px solid black;

  left: -20px;
  top: 50%;
  transform: translate(0, -50%);

  &:hover {
    cursor: pointer;
    background-color: rgba($color: #000000, $alpha: 0.2);
  }
}
</style>