<template>
  <g ref="container"></g>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import rough from "roughjs";
import type { Drawing } from "@/types/drawing";
import { getRectangleParams, getEllipseParams, getShapeStyle } from "@/utils/drawing";

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
  };

  const styleConfig = {
    strokeColor: props.drawing.strokeColor || "",
    backgroundColor: props.drawing.backgroundColor || "",
    size: props.drawing.size,
  };
  const shapeStyleConfig = getShapeStyle(styleConfig);

  let shape;
  switch (props.drawing.drawingType) {
    case "ellipse": {
      const { centerX, centerY, width, height } = getEllipseParams(renderRoughDrawingVriable);
      shape = rc.ellipse(centerX, centerY, Math.abs(width), Math.abs(height), shapeStyleConfig);
      break;
    }
    case "rectangle": {
      const { x, y, width, height } = getRectangleParams(renderRoughDrawingVriable);
      shape = rc.rectangle(x, y, width, height, shapeStyleConfig);
      break;
    }

    case "line":
      shape = rc.line(props.drawing.startX, props.drawing.startY, props.drawing.endX, props.drawing.endY, {
        roughness: 2,
        stroke: props.drawing.strokeColor,
        fill: props.drawing.backgroundColor,
        strokeWidth: props.drawing.size,
        fillWeight: 2,
        hachureGap: 8,
        seed: 1,
      });
      break;
    default:
      break;
  }

  if (shape) {
    container.value.appendChild(shape);
  }
};

onMounted(drawShape);

watch(() => props.drawing, drawShape, { deep: true });
</script>
