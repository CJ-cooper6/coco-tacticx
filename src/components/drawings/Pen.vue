<template>
  <path
    :d="drawing.pathData"
    :stroke="drawing.strokeColor || '#000000'"
    fill="none"
    :stroke-width="drawing.size || 2"
    stroke-linecap="round"
    stroke-linejoin="round"
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
