<template>
  <g ref="container"></g>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import rough from "roughjs";
import type { Drawing } from "@/types/drawing";
import { renderShape } from "@/utils/drawing";

const props = defineProps<{
  drawing: Drawing;
}>();

const container = ref<any>(null);

const drawShape = () => {
  if (!container.value) return;

  // 清除现有内容
  container.value.innerHTML = "";

  const rc = rough.svg(container.value);

  const renderRoughDrawingVriable = {
    startX: props.drawing.startX,
    startY: props.drawing.startY,
    endX: props.drawing.endX,
    endY: props.drawing.endY,
    pathPoints: props.drawing.pathPoints,
  };

  const styleConfig = {
    strokeColor: props.drawing.strokeColor || "",
    backgroundColor: props.drawing.backgroundColor || "",
    size: props.drawing.size,
  };

  const roughElement = renderShape(rc, props.drawing.drawingType, renderRoughDrawingVriable, styleConfig);

  if (roughElement) {
    container.value.appendChild(roughElement);
  }
};

onMounted(drawShape);

watch(() => props.drawing, drawShape, { deep: true });
</script>
