<template>
  <div class="board">
    <svg
      ref="svgRef"
      id="field"
      width="1250"
      height="826"
      viewBox="0 0 1250 826"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      @pointerdown="startDrawing"
      @pointermove="moveDrawing"
      @pointerup="endDrawing"
      @dblclick.stop
      class="field"
    >
      <!-- 工具栏区域 -->
      <ToolsPanel />

      <!-- 拖动工具栏区域 -->
      <g id="toolbar-drag" @touchmove.prevent>
        <g id="tools-panel">
          <DragToolsPanel />
        </g>
      </g>
      <!-- 球场区域 -->
      <g>
        <!-- 场地区域 -->
        <!-- 动态引入场地组件 -->
        <component :is="currentFieldComponent" @touchmove.prevent.stop>
          <!-- 非动画模式 -->
          <template v-if="!isAnimationMode">
            <g id="drawings">
              <component
                v-for="drawing in drawings"
                :key="drawing.id"
                :is="getDrawingComponent(drawing.type)"
                :drawing="drawing"
              />
            </g>
            <!-- 球员 -->
            <g id="players">
              <ItemComponent
                v-for="item in normalItems"
                :key="item.id"
                :item="item"
                @start-drag="startDrag(item, $event)"
              />
            </g>
          </template>
          <!-- 动画模式 -->
          <template v-else>
            <!-- 播放动画时的图层 -->
            <!-- 播放动画是从上一帧位置移动到当前帧位置，所以一开始需要显示上一帧的元素 -->
            <g id="players" v-show="isPlaying">
              <ItemComponent v-for="item in prevFrameElements" :key="item.id" :item="item" />
            </g>
            <template v-if="!isPlaying">
              <!-- 创建动画时的图层 -->
              <!-- 和上一帧之间的曲线路径 -->
              <g id="paths" v-for="item in animationItems" :key="`path-${item.id}`" style="z-index: 1">
                <path
                  v-if="showPath(item)"
                  :d="pathData(item)"
                  stroke="rgba(0,0,0,0.2)"
                  fill="none"
                  stroke-dasharray="5,5"
                  stroke-width="4"
                />
                <!-- 控制点 -->
                <circle
                  v-if="currentFrameIndex !== 0"
                  :cx="pathControlPoint(item)?.x"
                  :cy="pathControlPoint(item)?.y"
                  r="5"
                  fill="red"
                  @pointerdown="startDragControlPoint(item, $event)"
                />
              </g>
              <!-- 上一帧球员 -->
              <g id="prev-frame-elements" style="opacity: 0.5; z-index: 10">
                <ItemComponent v-for="item in haveActionPrevFrameElements" :key="`prev-${item.id}`" :item="item" />
              </g>
              <!-- 球员 -->
              <g id="players">
                <ItemComponent
                  v-for="item in animationItems"
                  :key="item.id"
                  :item="item"
                  @start-drag="startDrag(item, $event)"
                />
              </g>
            </template>
          </template>
          <!-- 水印 -->
          <template v-if="showWatermark" #watermark>
            <Watermark />
          </template>
        </component>
      </g>

      <!-- 正在移动的新元素 -->
      <g id="tools-panel">
        <ItemComponent v-if="newDraggingItem" :item="newDraggingItem" />
      </g>
      <!-- 正在绘制的新元素 -->
      <g id="new-drawing">
        <component
          v-if="newDraggingDrawing"
          :is="getDrawingComponent(newDraggingDrawing.type)"
          :drawing="newDraggingDrawing"
        />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Component } from "vue";
import { storeToRefs } from "pinia";
import { GAME_CONSTANTS } from "../constants";
// 组件导入
import ItemComponent from "./Item.vue";
import ToolsPanel from "./ToolsPanel.vue";
import DragToolsPanel from "./DragToolsPanel.vue";
import FootballField from "./fields/FootballField.vue";
import RectangleComponent from "./drawings/Rectangle.vue";
import CircleComponent from "./drawings/Circle.vue";
import Watermark from "./Watermark.vue";

// Store 导入
import { useItemStore } from "../stores/itemStore";
import { useGlobalStore } from "../stores/globalStore";
import { useBoardStore } from "../stores/boardStore";
import { useDrawStore } from "../stores/drawStore";
import { useAnimationStore } from "../stores/animationStore";

// Composables 导入
import { useDrawing } from "../composables/useDrawing";
import { useDraggable } from "../composables/useDraggable";
import { usePath } from "../composables/usePath";

// 组合式函数初始化
const { startDrawing, moveDrawing, endDrawing } = useDrawing();
const { startDrag } = useDraggable();
const { showPath, pathData, pathControlPoint, startDragControlPoint } = usePath();

// Store 初始化
const globalStore = useGlobalStore();
const itemStore = useItemStore();
const boardStore = useBoardStore();
const drawStore = useDrawStore();
const animationStore = useAnimationStore();

// Store 状态和方法解构
const { items, newDraggingItem } = storeToRefs(itemStore);
const { drawings, newDraggingDrawing } = storeToRefs(drawStore);
const { isAnimationMode, haveActionPrevFrameElements, currentFrameIndex, isPlaying, currentFrameElements } =
  storeToRefs(animationStore);

const svgRef = ref<SVGSVGElement | null>(null);
const currentFieldType = ref("football");

// 场地组件注册
const fieldComponents: Record<string, Component> = {
  football: FootballField,
  // 在这里添加更多场地类型
};

// 计算属性
const currentFieldComponent = computed(() => fieldComponents[currentFieldType.value]);

const normalItems = computed(() => items.value.filter((item) => item.type === "normal"));

const animationItems = computed(() => currentFrameElements.value);

const prevFrameElements = computed(() => {
  if (currentFrameIndex.value === 0) return animationStore.getFrameElements(0);
  return animationStore.getFrameElements(currentFrameIndex.value - 1);
});

const showWatermark = computed(() => GAME_CONSTANTS.showWatermark);

// 工具函数
const getDrawingComponent = (type: string) => {
  switch (type) {
    case "rectangle":
      return RectangleComponent;
    case "circle":
      return CircleComponent;
    default:
      return null;
  }
};

onMounted(() => {
  if (svgRef.value) {
    boardStore.setBoardArea(svgRef.value.getElementById("board-area") as SVGGraphicsElement);
    boardStore.setSvgElement(svgRef.value);
  }
});
</script>

<style scoped>
.app-icon {
  width: 35px;
  height: 35px;
  fill: #64a7a5;
  cursor: pointer;
}

.field {
  width: 100%;
  height: auto;
  overflow: visible;
}
</style>
