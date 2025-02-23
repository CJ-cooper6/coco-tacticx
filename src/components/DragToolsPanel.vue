<template>
  <g class="tools-panel">
    <g v-for="(item, index) in toolItems" :key="`tool-item-${item.id}`">
      <circle
        :cx="item.x"
        :cy="item.y"
        :r="item.r"
        :fill="item.color"
        :key="`tool-item-${item.id}`"
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
import { GAME_CONSTANTS } from "../constants";
import { isInsideField } from "../utils/index";
import { useItemStore } from "../stores/itemStore";
import { Item } from "../types/item";
import { useAnimationStore } from "../stores/animationStore";
import { useGlobalStore } from "../stores/globalStore";

const itemStore = useItemStore();
const animationStore = useAnimationStore();
const globalStore = useGlobalStore();

// 方法可以直接解构
const { addItem, removeDraggingNewItem, setDraggingNewItem } = itemStore;

// 使用 storeToRefs 保持响应性
const { newDraggingItem } = storeToRefs(itemStore);
const { isAnimationMode } = storeToRefs(animationStore);
const { orientation } = storeToRefs(globalStore);

const toolItemNumbers = ref([0, 0]);
const toolItems = computed(() => {
  if (orientation.value === "landscape") {
    return [
      new Item("#ffffff", -50, 300, GAME_CONSTANTS.DefaultItemRadius, 0, "", toolItemNumbers.value[0]),
      new Item("#000000", -50, 370, GAME_CONSTANTS.DefaultItemRadius, 0, "", toolItemNumbers.value[1]),
    ];
  }
  return [
    new Item("#ffffff", 310, 870, GAME_CONSTANTS.DefaultItemRadius, 0, "", toolItemNumbers.value[0]),
    new Item("#000000", 380, 870, GAME_CONSTANTS.DefaultItemRadius, 0, "", toolItemNumbers.value[1]),
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
  const itemNumber = toolItemNumbers.value[index];
  setDraggingNewItem(new Item(color, svgPoint.x, svgPoint.y, GAME_CONSTANTS.DefaultItemRadius, 0, "", itemNumber));

  const stopDrag = (moveEvent: PointerEvent) => {
    const { x, y } = getTransformedPoint(moveEvent);
    if (isInsideField(x, y)) {
      const item = addItem(color, x, y);
      item.number = itemNumber;
      toolItemNumbers.value[index]++;
      if (isAnimationMode.value && item.id) {
        itemStore.setItemProperty(item.id, "type", "animation");
        animationStore.addElement(item);
      }
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
