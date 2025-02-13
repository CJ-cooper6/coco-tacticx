<template>
  <rect
    :x="Math.min(drawing.startX, drawing.endX)"
    :y="Math.min(drawing.startY, drawing.endY)"
    :width="Math.abs(drawing.endX - drawing.startX)"
    :height="Math.abs(drawing.endY - drawing.startY)"
    fill="none"
    :stroke="drawing.color"
    :stroke-width="drawing.size"
  />
</template>

<script setup lang="ts">
import { Drawing } from "../../types/drawing";

const props = defineProps({
  drawing: {
    type: Object as () => Drawing,
    required: true,
  },
});
</script>
