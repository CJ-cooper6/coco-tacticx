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
    <foreignObject
      :x="toolsPanelPosition.x"
      :y="toolsPanelPosition.y"
      :width="toolsPanelPosition.width"
      :height="toolsPanelPosition.height"
      overflow="visible"
    >
      <div class="tools-panel-content">
        <div class="tools-panel-item">
          <div
            class="icon-button"
            title="选择"
            :class="{ select: currentTool === 'select' }"
            @click="setCurrentTool('select')"
          >
            <GradientSvgIcon
              class="icon select-icon"
              :startColor="gradientColor.startColor"
              :endColor="gradientColor.endColor"
              name="select"
            />
          </div>
        </div>

        <Shape></Shape>
      </div>
    </foreignObject>
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
import { gradientColor } from "../constants";
import GradientSvgIcon from "./common/GradientSvgIcon.vue";
import Shape from "./drawings/Shape.vue";
import { useDrawStore } from "../stores/drawStore";

const itemStore = useItemStore();
const animationStore = useAnimationStore();
const globalStore = useGlobalStore();
const drawStore = useDrawStore();

// 方法可以直接解构
const { addElement, removeDraggingNewItem, setDraggingNewItem } = itemStore;
const { setCurrentTool } = drawStore;

// 使用 storeToRefs 保持响应性
const { newDraggingItem } = storeToRefs(itemStore);
const { isAnimationMode } = storeToRefs(animationStore);
const { orientation } = storeToRefs(globalStore);
const { currentTool } = storeToRefs(drawStore);

const toolItemNumbers = ref([0, 0, 0, 0, 0, 0]);
const toolItems = computed(() => {
  if (orientation.value === "landscape") {
    return [
      new FieldElement({ color: "#eb281e", x: -50, y: 80, number: toolItemNumbers.value[0] }),
      new FieldElement({ color: "#853ee5", x: -50, y: 150, number: toolItemNumbers.value[1] }),
      new FieldElement({ color: "#2495ff", x: -50, y: 220, number: toolItemNumbers.value[2] }),
      new FieldElement({ color: "#fffd55", x: -50, y: 290, number: toolItemNumbers.value[3] }),
      new FieldElement({ color: "#ffffff", x: -50, y: 360, number: toolItemNumbers.value[4] }),
      new FieldElement({ color: "#000000", x: -50, y: 430, number: toolItemNumbers.value[5] }),
    ];
  }
  return [
    new FieldElement({ color: "#eb281e", x: 150, y: 870, number: toolItemNumbers.value[0] }),
    new FieldElement({ color: "#853ee5", x: 220, y: 870, number: toolItemNumbers.value[1] }),
    new FieldElement({ color: "#2495ff", x: 290, y: 870, number: toolItemNumbers.value[2] }),
    new FieldElement({ color: "#fffd55", x: 360, y: 870, number: toolItemNumbers.value[3] }),
    new FieldElement({ color: "#ffffff", x: 430, y: 870, number: toolItemNumbers.value[4] }),
    new FieldElement({ color: "#000000", x: 500, y: 870, number: toolItemNumbers.value[5] }),
  ];
});

const toolsPanelPosition = computed(() => {
  if (globalStore.orientation === "landscape") {
    return { x: -100, y: 600, width: 100, height: 800 };
  }
  return { x: 950, y: 820, width: 800, height: 100 };
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
  gap: 20px;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;

  .tools-panel-item {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 5px;
  }
}
.player-number {
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}

.select-icon {
  width: 35px;
  height: 35px;
}
</style>

<style>
circle {
  cursor: pointer;
  transition: r 0.2s ease;
}
</style>
