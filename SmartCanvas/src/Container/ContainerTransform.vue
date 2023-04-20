<template>
  <div class="container-transform">
    <RotateAnchor />

    <TopLeftAnchor />

    <TopRightAnchor />

    <BottomLeftAnchor />

    <BottomRightAnchor />

    <ArrowAnchors />
  </div>
</template>

<script setup lang="ts">
import TopLeftAnchor from './anchors/TopLeftAnchor.vue';
import TopRightAnchor from './anchors/TopRightAnchor.vue';
import BottomLeftAnchor from './anchors/BottomLeftAnchor.vue';
import BottomRightAnchor from './anchors/BottomRightAnchor.vue';
import RotateAnchor from './anchors/RotateAnchor.vue';
import ArrowAnchors from './arrowAnchors/ArrowAnchors.vue';
</script>

<style lang="scss">
.container-transform {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  outline: 1px dotted blue;
}
</style>