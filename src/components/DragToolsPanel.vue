<template>
  <g class="tools-panel">
    <g v-for="(item, index) in toolItems" :key="`tool-item-${item.id}`">
      <g v-if="item.elementType === 'player'">
        <circle
          :cx="item.x"
          :cy="item.y"
          :r="item.r"
          :fill="item.color"
          :key="`tool-item-${item.id}`"
          :stroke="itemStore.numberColor(item)"
          stroke-width="4"
          @pointerdown="startDragNewItem(item, $event, index)"
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
      <g v-else>
        <image
          :x="item.x - ELEMENT_RADIUS_OBJECT.ball"
          :y="item.y - ELEMENT_RADIUS_OBJECT.ball"
          :width="ELEMENT_RADIUS_OBJECT.ball * 2"
          :height="ELEMENT_RADIUS_OBJECT.ball * 2"
          :href="ballSvg"
          @pointerdown="startDragNewItem(item, $event, index)"
        />
      </g>
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
            :class="{ 'is-active': currentTool === 'select' }"
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
import { useItemStore } from "../stores/itemStore";
import { FieldElement } from "../types/fieldElement";
import { useAnimationStore } from "../stores/animationStore";
import { useGlobalStore } from "../stores/globalStore";
import { useHistory } from "../composables/useHistory";
import { gradientColor, ELEMENT_RADIUS_OBJECT } from "../constants";
import GradientSvgIcon from "./common/GradientSvgIcon.vue";
import Shape from "./drawings/Shape.vue";
import { useBoardStore } from "../stores/boardStore";
import ballSvg from "@/assets/icons/ball.svg";

const itemStore = useItemStore();
const animationStore = useAnimationStore();
const globalStore = useGlobalStore();
const boardStore = useBoardStore();
const { pushHistory } = useHistory();

// 方法可以直接解构
const { addElement, removeDraggingNewItem, setDraggingNewItem } = itemStore;
const { setCurrentTool } = globalStore;

// 使用 storeToRefs 保持响应性
const { newDraggingItem } = storeToRefs(itemStore);
const { isAnimationMode } = storeToRefs(animationStore);
const { orientation, currentTool } = storeToRefs(globalStore);

const toolItemNumbers = ref([0, 0, 0, 0, 0, 0]);
const toolItems = computed(() => {
  if (orientation.value === "landscape") {
    return [
      new FieldElement({ color: "#eb281e", x: -50, y: 80, number: toolItemNumbers.value[0], elementType: "player" }),
      new FieldElement({ color: "#853ee5", x: -50, y: 150, number: toolItemNumbers.value[1], elementType: "player" }),
      new FieldElement({ color: "#2495ff", x: -50, y: 220, number: toolItemNumbers.value[2], elementType: "player" }),
      new FieldElement({ color: "#fffd55", x: -50, y: 290, number: toolItemNumbers.value[3], elementType: "player" }),
      new FieldElement({ color: "#ffffff", x: -50, y: 360, number: toolItemNumbers.value[4], elementType: "player" }),
      new FieldElement({ color: "#000000", x: -50, y: 430, number: toolItemNumbers.value[5], elementType: "player" }),
      new FieldElement({ x: -50, y: 500, elementType: "ball" }),
    ];
  }
  return [
    new FieldElement({ color: "#eb281e", x: 150, y: 870, number: toolItemNumbers.value[0], elementType: "player" }),
    new FieldElement({ color: "#853ee5", x: 220, y: 870, number: toolItemNumbers.value[1], elementType: "player" }),
    new FieldElement({ color: "#2495ff", x: 290, y: 870, number: toolItemNumbers.value[2], elementType: "player" }),
    new FieldElement({ color: "#fffd55", x: 360, y: 870, number: toolItemNumbers.value[3], elementType: "player" }),
    new FieldElement({ color: "#ffffff", x: 430, y: 870, number: toolItemNumbers.value[4], elementType: "player" }),
    new FieldElement({ color: "#000000", x: 500, y: 870, number: toolItemNumbers.value[5], elementType: "player" }),
    new FieldElement({ x: 570, y: 870, elementType: "ball" }),
  ];
});

const toolsPanelPosition = computed(() => {
  if (globalStore.orientation === "landscape") {
    return { x: -100, y: 600, width: 100, height: 800 };
  }
  return { x: 950, y: 820, width: 800, height: 100 };
});

const startDragNewItem = (item: FieldElement, event: PointerEvent, index: number) => {
  // @ts-ignore
  const svg = document.getElementById("field") as SVGSVGElement;
  if (!svg) return;

  const svgPoint = boardStore.getSvgPosition(event);
  const elementNumber = toolItemNumbers.value[index];
  setDraggingNewItem(
    new FieldElement({
      color: item.color,
      x: svgPoint.x,
      y: svgPoint.y,
      number: elementNumber,
      isDragging: true,
      state: "temporary",
      elementType: item.elementType,
    })
  );

  const stopDrag = (moveEvent: PointerEvent) => {
    const { x, y } = boardStore.getSvgPosition(moveEvent);
    if (!boardStore.isOutOfBoardArea(moveEvent, ELEMENT_RADIUS_OBJECT[item.elementType])) {
      const element = new FieldElement({
        color: item.color,
        x,
        y,
        number: elementNumber,
        elementType: item.elementType,
      });
      if (isAnimationMode.value) {
        element.creationMode = "animation";
        animationStore.addElement(element);
      }
      pushHistory();
      addElement(element);
      toolItemNumbers.value[index]++;
    }
    removeDraggingNewItem();
    svg.removeEventListener("pointerup", stopDrag);
    svg.removeEventListener("pointercancel", stopDrag);
  };

  const moveDrag = (moveEvent: PointerEvent) => {
    if (newDraggingItem.value) {
      const { x, y } = boardStore.getSvgPosition(moveEvent);
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

image {
  cursor: pointer;
}
</style>

<style>
circle {
  cursor: pointer;
  transition: r 0.2s ease;
}
</style>
