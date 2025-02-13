<template>
  <circle
    :cx="(drawing.startX + drawing.endX) / 2"
    :cy="(drawing.startY + drawing.endY) / 2"
    :r="radius"
    fill="none"
    :stroke="drawing.color"
    :stroke-width="drawing.size"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Drawing } from "../../types/drawing";

const props = defineProps({
  drawing: {
    type: Object as () => Drawing,
    required: true,
  },
});

const radius = computed(() => {
  const dx = props.drawing.endX - props.drawing.startX;
  const dy = props.drawing.endY - props.drawing.startY;
  return Math.hypot(dx, dy) / 2;
});
</script>
