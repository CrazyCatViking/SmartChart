<template>
  <div class="arrow-anchors">
    <TopAnchor />
    <RightAnchor />
    <BottomAnchor />
    <LeftAnchor />
  </div>
</template>

<script setup lang="ts">
import BottomAnchor from './anchors/BottomAnchor.vue';
import LeftAnchor from './anchors/LeftAnchor.vue';
import RightAnchor from './anchors/RightAnchor.vue';
import TopAnchor from './anchors/TopAnchor.vue';
</script>

<style lang="scss">
.arrow-anchors {
  position: absolute;
  top: 0;
  left: 0;

  height: 100%;
  width: 100%;
}
</style>