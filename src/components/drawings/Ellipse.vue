<template>
  <RoughWrapper type="ellipse" :drawing="drawing" />
</template>

<script setup lang="ts">
import { Drawing } from "../../types/drawing";
import RoughWrapper from "./RoughWrapper.vue";

const props = defineProps({
  drawing: {
    type: Object as () => Drawing,
    required: true,
  },
});
</script>
