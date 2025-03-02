<template>
  <g ref="container"></g>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import rough from "roughjs";

const props = defineProps<{
  type: "ellipse" | "rectangle" | "line";
  drawing: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    color: string;
    size: number;
  };
}>();

const container = ref<any>(null);

const drawShape = () => {
  if (!container.value) return;

  // 清除现有内容
  container.value.innerHTML = "";

  const rc = rough.svg(container.value);

  let shape;
  switch (props.type) {
    case "ellipse": {
      const width = props.drawing.endX - props.drawing.startX;
      const height = props.drawing.endY - props.drawing.startY;
      const centerX = props.drawing.startX + width / 2;
      const centerY = props.drawing.startY + height / 2;
      shape = rc.ellipse(centerX, centerY, Math.abs(width), Math.abs(height), {
        roughness: 1.5,
        stroke: props.drawing.color,
        strokeWidth: props.drawing.size,
      });
      break;
    }
    case "rectangle":
      shape = rc.rectangle(
        props.drawing.startX,
        props.drawing.startY,
        props.drawing.endX - props.drawing.startX,
        props.drawing.endY - props.drawing.startY,
        {
          roughness: 1.5,
          stroke: props.drawing.color,
          strokeWidth: props.drawing.size,
        }
      );
      break;
    case "line":
      shape = rc.line(props.drawing.startX, props.drawing.startY, props.drawing.endX, props.drawing.endY, {
        roughness: 1.5,
        stroke: props.drawing.color,
        strokeWidth: props.drawing.size,
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
