<template>
  <g class="tools-panel">
    <g v-for="(item, index) in toolItems" :key="`tool-item-${item.uuid}`">
      <circle
        :cx="item.x"
        :cy="item.y"
        :r="item.r"
        :fill="item.color"
        :key="`tool-item-${item.uuid}`"
        :stroke="itemStore.numberColor(item)"
        stroke-width="4"
        @pointerdown="startDragNewItem(item.color, $event, index)"
      />
      <!-- 号码 -->
      <text
        :x="item.x"
        :y="item.y"
        text-anchor="middle"
        dominant-baseline="central"
        class="player-number"
        :style="{ fill: itemStore.numberColor(item) }"
        pointer-events="none"
      >
        {{ item.number }}
      </text>
    </g>
  </g>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { isInsideField } from "../utils/index";
import { useItemStore } from "../stores/itemStore";
import { FieldElement } from "../types/fieldElement";
import { useAnimationStore } from "../stores/animationStore";
import { useGlobalStore } from "../stores/globalStore";

const itemStore = useItemStore();
const animationStore = useAnimationStore();
const globalStore = useGlobalStore();

// 方法可以直接解构
const { addElement, removeDraggingNewItem, setDraggingNewItem } = itemStore;

// 使用 storeToRefs 保持响应性
const { newDraggingItem } = storeToRefs(itemStore);
const { isAnimationMode } = storeToRefs(animationStore);
const { orientation } = storeToRefs(globalStore);

const toolItemNumbers = ref([0, 0]);
const toolItems = computed(() => {
  if (orientation.value === "landscape") {
    return [
      new FieldElement({ color: "#ffffff", x: -50, y: 300, number: toolItemNumbers.value[0] }),
      new FieldElement({ color: "#000000", x: -50, y: 370, number: toolItemNumbers.value[1] }),
    ];
  }
  return [
    new FieldElement({ color: "#ffffff", x: 310, y: 870, number: toolItemNumbers.value[0] }),
    new FieldElement({ color: "#000000", x: 380, y: 870, number: toolItemNumbers.value[1] }),
  ];
});

const startDragNewItem = (color: string, event: PointerEvent, index: number) => {
  // @ts-ignore
  const svg = document.getElementById("field") as SVGSVGElement;
  if (!svg) return;

  // 将位置信息转换为 SVG 的坐标系
  const getTransformedPoint = (moveEvent: PointerEvent) => {
    const point = svg.createSVGPoint();
    point.x = moveEvent.clientX;
    point.y = moveEvent.clientY;
    const svgPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());
    return { x: svgPoint.x, y: svgPoint.y };
  };
  const svgPoint = getTransformedPoint(event);
  const elementNumber = toolItemNumbers.value[index];
  setDraggingNewItem(
    new FieldElement({
      color,
      x: svgPoint.x,
      y: svgPoint.y,
      number: elementNumber,
      isDragging: true,
      state: "temporary",
    })
  );

  const stopDrag = (moveEvent: PointerEvent) => {
    const { x, y } = getTransformedPoint(moveEvent);
    if (isInsideField(x, y)) {
      const element = new FieldElement({ color, x, y, number: elementNumber });
      if (isAnimationMode.value) {
        element.creationMode = "animation";
        animationStore.addElement(element);
      }
      addElement(element);
      toolItemNumbers.value[index]++;
    }
    removeDraggingNewItem();
    svg.removeEventListener("pointerup", stopDrag);
    svg.removeEventListener("pointercancel", stopDrag);
  };

  const moveDrag = (moveEvent: PointerEvent) => {
    if (newDraggingItem.value) {
      const { x, y } = getTransformedPoint(moveEvent);
      newDraggingItem.value.x = x;
      newDraggingItem.value.y = y;
    }
  };

  svg.addEventListener("pointermove", moveDrag);
  svg.addEventListener("pointerup", stopDrag);
  svg.addEventListener("pointercancel", stopDrag);
};
</script>

<style lang="scss" scoped>
.tools-panel-content {
  display: flex;
  gap: 10px;
}
.player-number {
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}
</style>

<style>
circle {
  cursor: pointer;
  transition: r 0.2s ease;
}
</style>
